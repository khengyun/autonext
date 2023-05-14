console.log("background.js");
importScripts("api.js");
importScripts("helpui.js");
function grade_teammates(params, privateCqId, classroomSessionId, groupId) {
  // console.log(params);

  // console.log(
  //   format_grade_teammates(params, privateCqId, classroomSessionId, groupId)
  // );
  // console.log(params);
  const ans = post_api({
    url: `${API.grade_teammates}`,
    body: {
      gradeTeammatesList: format_grade_teammates(
        params,
        privateCqId,
        classroomSessionId,
        groupId
      ),
    },
  });
  ans
    .then((data) => {
      console.log(data);
    })
    .catch((e) => {
      console.log(e);
    });
}

function get_grade(params) {
  // param = {"privateCqId":privateCqId,"sessionId":sessionId,"groupId":groupID}

  const ans = post_api({
    url: `${API.get_grade}`,
    body: {
      privateCqId: params.privateCqId,
      groupId: params.groupId,
    },
  });
  ans
    .then((data) => {
      if (data.data.gradeResponseList.length != 0) {
        // console.log(params.privateCqId, params.sessionId, params.groupId);
        // console.log(data.data);

        privateCqId = params.privateCqId;
        sessionId = params.sessionId;
        groupId = params.groupId;
        grade_teammates(
          data.data.gradeResponseList,
          privateCqId,
          sessionId,
          groupId
        );
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

// This function lists all the groups in a classroom.
// Iterate over all the courses in the USER_COURSE array.
function list_group() {
  for (let i = 0; i < USER_COURSE.length; i++) {
    // Get the current course.
    const element = USER_COURSE[i];

    // Iterate over all the courses in the current course.
    for (let j = 0; j < element.courseList.length; j++) {
      // Get the current course.
      const element2 = element.courseList[j];

      // Get the classroom session ID for the current course.
      classroomSessionId = element2.classroomSessionId;

      // Iterate over all the questions in the current course.
      for (let k = 0; k < element2.questions.length; k++) {
        // console.log(element2.questions[k]);
        const privateCqId = element2.questions[k].privateCqId;
        const sessionId = element2.questions[k].sessionId;

        // Post a request to the API to get the list of groups for the current course.
        const ans = post_api({
          url: `${API.list_group}${element2.classroomSessionId}`,
        });

        // Handle the response from the API.
        ans
          .then((data) => {
            // Iterate over the groups in the response.
            for (let k = 0; k < data.length; k++) {
              // Get the current group.
              const element3 = data[k];
              const groupID = element3.id;
              // console.log(groupID)
              if (check_group_user(element3)) {
                // console.log(element3);

                get_grade({
                  privateCqId: privateCqId,
                  sessionId: sessionId,
                  groupId: groupID,
                });
              }

              // Iterate over the students in the current group.
              // for (let l = 0; l < element3.listStudentByGroups.length; l++) {
              //   // Get the current student.
              //   const listStudentByGroups = element3.listStudentByGroups[l];

              //   // Print the student's information.
              //   console.log(data);
              //   console.log(data.id)
              // }
            }
          })
          .catch((e) => { });
      }
    }
  }
}

function course_detail(params) {
  //load course detail

  if (USER_CLASS.length == USER_COURSE.length) {
    // question_detail()
    list_group();
  } else {
    for (let i = 0; i < USER_CLASS.length; i++) {
      const element = USER_CLASS[i];
      const ans = get_api({
        url: `${API.course_detail[0]}${element.id}${API.course_detail[1]}`,
      });
      ans
        .then((data) => {
          // console.log(data.data)
          if (
            USER_CLASS.length > USER_COURSE.length &&
            check_course_list(USER_CLASS[i].id) == false
          ) {
            let format = {
              className: USER_CLASS[i].className,
              id: USER_CLASS[i].id,
              courseCode: USER_CLASS[i].courseCode,
              courseTitle: USER_CLASS[i].courseTitle,
              courseId: USER_CLASS[i].courseId,
              courseList: question_format(data.data),
            };
            USER_COURSE.push(format);
            if (USER_CLASS.length == USER_COURSE.length) {
              // question_detail()
              list_group();
            }
          }
          if (USER_CLASS.length == USER_COURSE.length) {
            // question_detail()
            list_group();
          }
          // console.log(USER_COURSE);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
}

function class_infor() {
  for (let i = 0; i < USER_SUBJECTS.length; i++) {
    const element = USER_SUBJECTS[i];
    const ans = get_api({
      url: `${API.class_info}${element.classId}`,
    });
    ans
      .then((data) => {
        // console.log(data.data)
        USER_CLASS.push(data.data);
        course_detail();
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

function subjects_in_the_semester(params) {
  const ans = get_api({
    url: `${API.semester[0]}${USER_INFOR.userId}${API.semester[1]}${params}`,
  });
  ans
    .then((data) => {
      USER_SUBJECTS = data;
      // console.log(USER_SUBJECTS)
      class_infor();
    })
    .catch((e) => {

      console.log(e)
      
    });
}
update_api();
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {

    // initiator
    if (details.initiator == "https://fu-edunext.fpt.edu.vn") {
      const token = details.requestHeaders[2].value;
      if (token.includes("Bearer")) {
        TOKEN = token;
        console.log(TOKEN);
      }
      //get token infor
      let ans = post_api(details);
      ans
        .then((data) => {
          USER_INFOR = data.data;
          console.log(USER_INFOR);



          subjects_in_the_semester("DEFAULT");

          // send mess from background script to popup script
          messtopopup({ type: "background", message: USER_INFOR });
          //send mess from background script to content script
          messtocontent(details, token);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  },
  {
    urls: [
      `https://fugw-edunext.fpt.edu.vn/api/auth/token`,
      `https://fugw-edunext.fpt.edu.vn:8443/api/auth/token`,
    ],
  },
  ["requestHeaders"]
);
