console.log("background.js");
importScripts("api.js");
importScripts("helpui.js");

function check_group_user(params) {
  var boolean = false;
  params.listStudentByGroups.forEach((element) => {
    if (element.id == USER_INFOR.userId) {
      boolean = true;
      // console.log(params)
    }
  });
  return boolean;
}

function format_grade_teammates(
  params,
  privateCqId,
  classroomSessionId,
  groupId
) {
  console.log(params);
  console.log(privateCqId, classroomSessionId,groupId);
  var teamlist = params;
  var newParams = [];
  console.log(params);
  for (let index = 0; index < teamlist.length; index++) {
    newParams.push({
      "id": teamlist[index].id,
      "hardWorking": 5,
      "goodKnowledge": 5,
      "teamWorking": 5,
      "userIsGraded": teamlist[index].userIsGraded ? teamlist[index].userIsGraded : 0,
      "groupId": groupId ? groupId : 0,
      "privateCqId": privateCqId,
      "classroomSessionId": teamlist[index].classroomSessionId ? teamlist[index].classroomSessionId : 0,
      "userIsGradedId": teamlist[index].userIsGraded ? teamlist[index].userIsGraded : 0,
    });
  };
  // console.log(newParams);
  return newParams;
}

function grade_teammates(params, privateCqId, classroomSessionId, groupId) {
  console.log(params);
  
  // console.log(
  //   format_grade_teammates(params, privateCqId, classroomSessionId, groupId)
  // );


  console.log(params);
  const ans = post_api({
    url: `https://fugw-edunext.fpt.edu.vn:${PORT}/api/v1/grade/grade-teammates`,
    body: {"gradeTeammatesList":format_grade_teammates(params, privateCqId, classroomSessionId, groupId)},
  });
  ans
    .then((data) => {})
    .catch((e) => {
      console.log(e);
    });
}

function get_grade(params) {
  // param = {"privateCqId":privateCqId,"sessionId":sessionId,"groupId":groupID}
  
  const ans = post_api({
    url: `https://fugw-edunext.fpt.edu.vn:${PORT}/api/v1/grade/get-grade`,
    body: {
      privateCqId: params.privateCqId,
      groupId: params.groupId,
    },
  });
  ans
    .then((data) => {
      if (data.data.gradeResponseList.length != 0) {
        // console.log(params.privateCqId, params.sessionId, params.groupId);
        console.log(data.data);
        
        privateCqId = params.privateCqId;
        sessionId = params.sessionId;
        groupId = params.groupId;
        grade_teammates(
          data.data.gradeResponseList,
          privateCqId,sessionId, groupId
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
          url: `https://fugw-edunext.fpt.edu.vn:${PORT}/api/v1/group/list-group?classroomSessionId=${element2.classroomSessionId}`,
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
                  "privateCqId": privateCqId,
                  "sessionId": sessionId,
                  "groupId": groupID,
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
          .catch((e) => {});
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
        url: `https://fugw-edunext.fpt.edu.vn:${PORT}/api/v1/course/course-detail?id=${element.id}&currentPage=1&pageSize=100&statusClickAll=false`,
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
      url: `https://fugw-edunext.fpt.edu.vn:${PORT}/api/v1/class/class-info?id=${element.classId}`,
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
    url: `https://fugw-edunext.fpt.edu.vn:${PORT}/api/v1/class/home/student?id=${USER_INFOR.userId}&semesterName=${params}`,
  });
  ans
    .then((data) => {
      USER_SUBJECTS = data;
      // console.log(USER_SUBJECTS)
      class_infor();
    })
    .catch((e) => {
      console.log(e);
    });
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    // initiator
    if (details.initiator === "https://fu-edunext.fpt.edu.vn") {
      const token = details.requestHeaders[2].value;
      if (token.includes("Bearer")) {
        TOKEN = token;
      }
      //get token infor
      let ans = post_api(details);
      ans
        .then((data) => {
          USER_INFOR = data.data;
          console.log(USER_INFOR);
          subjects_in_the_semester("DEFAULT");
        })
        .catch((e) => {
          console.log(e.message);
        });
      chrome.tabs.sendMessage(details.tabId, {
        token: token,
        details: details,
      });
    }
  },
  {
    urls: ["https://fugw-edunext.fpt.edu.vn:8443/api/auth/token"],
  },
  ["requestHeaders"]
);
