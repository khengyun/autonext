console.log("background.js");
importScripts("api.js");
importScripts("helpui.js");
update_api();

function get_grade_group(params) {
  privateCqId = params.privateCqId;
  classroomSessionId = params.classroomSessionId;
  roundId = params.roundId;
  presentGroupId = params.presentGroupId;
  presentGroupName = params.presentGroupName;
  reviewGroupId = params.reviewGroupId;
  reviewGroupName = params.reviewGroupName;

  const listgroup = post_api({
    url: `${API.list_group}${classroomSessionId}`,
  });

  // Handle the response from the  API.
  listgroup
    .then((groups) => {
      user_group = group_have_user(groups);
      teamlist = user_group.listStudentByGroups;
      team_classroomSessionId = user_group.classroomSessionId;
      team_groupId = user_group.groupId;

      post_present = post_api({
        url: `https://fugw-edunext.fpt.edu.vn:8443/api/v1/grade/grading-group`,
        body: format_grade_present({
          classroomSessionId: team_classroomSessionId,
          roundId:  roundId,
          presentGroupId: presentGroupId,
          privateCqId: privateCqId,
        }),
      });
      post_present
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log({
        error: `${e}`,
        message: `${API.list_group}${course.classroomSessionId}`,
      });
    });

  // ans = post_api({
  //   url: `https://fugw-edunext.fpt.edu.vn:8443/api/v1/grade/get-grade-group`,
  //   body: {
  //     classroomSessionId: classroomSessionId,
  //     privateCqId: privateCqId,
  //     roundId: roundId,
  //   }
  // })
  // ans.then((data) => {

  // })

  // console.log(privateCqId, classroomSessionId, roundId, presentGroupId, presentGroupName, reviewGroupId, reviewGroupName)
}

function get_round_for_grading(params) {
  ans = get_api({
    url: `https://fugw-edunext.fpt.edu.vn:8443/api/v1/round/get?privateCqId=${params}`,
  });
  ans
    .then((data) => {
      // console.log(data.datacqDetail)
        console.log(data.data);
        data.data.forEach((datum) => {
          get_grade_group(datum);
        });
      
    })
    .catch((e) => {
      console.log(e);
    });
}

function grade_teammates(groups, privateCqId, classroomSessionId, groupId) {
  console.log("groupsooo: ", groups);
  // console.log(params);
  const ans = post_api({
    url: `${API.grade_teammates}`,
    body: {
      gradeTeammatesList: format_grade_teammates(
        groups,
        privateCqId,
        classroomSessionId,
        groupId
      ),
    },
  });
  ans
    .then((data) => {})
    .catch((e) => {
      console.log("catch: ", {
        gradeTeammatesList: format_grade_teammates(
          groups,
          privateCqId,
          classroomSessionId,
          groupId
        ),
      });
      console.log({
        error: `${e}`,
        message: `${API.grade_teammates}`,
      });
    });
}

function get_grade(params, groups) {
  // param = {"privateCqId":privateCqId,"sessionId":sessionId,"groupId":groupID}
  privateCqId = params.privateCqId;
  sessionId = params.sessionId;
  groupId = params.groupId;
  console.log("get_grade: ", groups, params);
  grade_teammates(groups, privateCqId, sessionId, groupId);
  get_round_for_grading(privateCqId);
}

// This function lists all the groups in a classroom.
// Iterate over all the courses in the USER_COURSE array.
function list_group(params) {
  console.log("some thing here");
  // Get the current course.
  const element = params;

  // Iterate over all the courses in the current course.
  for (let j = 0; j < element.courseList.length; j++) {
    // Get the current course.
    var course = element.courseList[j];

    // Get the classroom session ID for the current course.
    classroomSessionId = course.classroomSessionId;

    // Iterate over all the questions in the current course.
    for (let k = 0; k < course.questions.length; k++) {
      // console.log(element2.questions[k]);
      const privateCqId = course.questions[k].privateCqId;
      const sessionId = course.questions[k].sessionId;

      // Post a request to the API to get the list of groups for the current course.
      const ans = post_api({
        url: `${API.list_group}${course.classroomSessionId}`,
      });

      // Handle the response from the API.
      ans
        .then((groups) => {
          get_grade(
            {
              privateCqId: privateCqId,
              sessionId: sessionId,
              groupId: 12345678,
            },
            groups
          );

          // Iterate over the groups in the response.
        })
        .then(() => {})
        .catch((e) => {
          console.log({
            error: `${e}`,
            message: `${API.list_group}${course.classroomSessionId}`,
          });
        });
    }
  }
}

function course_detail(params) {
  //load course detail
  for (let i = 0; i < USER_CLASS.length; i++) {
    const element = USER_CLASS[i];
    const ans = get_api({
      url: `${API.course_detail[0]}${element.id}${API.course_detail[1]}`,
    });
    ans
      .then((data) => {
        // console.log(data.data)
        console.log(
          USER_CLASS.length >= USER_COURSE.length,
          check_course_list(USER_CLASS[i].id)
        );
        if (
          USER_CLASS.length >= USER_COURSE.length &&
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
        }
        // console.log(USER_COURSE);
      })
      .then(() => {
        // question_detail()
        console.log("log here");
        console.log(USER_COURSE);
        list_group(USER_COURSE[i]);
        console.log("haha");
      })
      .catch((e) => {
        console.log({
          error: `${e}`,
          message: `${API.course_detail[0]}${element.id}${API.course_detail[1]}`,
        });
      });
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
        if (USER_CLASS.length <= 2) {
          USER_CLASS.push(data.data);
          course_detail();
        }
      })
      .catch((e) => {
        console.log({
          error: `${e}`,
          message: `${API.class_info}${element.classId}`,
        });
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
      console.log({
        error: `${e}`,
        message: `${API.semester[0]}${USER_INFOR.userId}${API.semester[1]}${params}`,
      });
    });
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    // initiator
    if (details.initiator == "https://fu-edunext.fpt.edu.vn") {
      const token = details.requestHeaders[2].value;
      if (token.includes("Bearer")) {
        TOKEN = token;
        // console.log(TOKEN);
      }
      //get token infor
      let ans = post_api(details);
      ans
        .then((data) => {
          USER_INFOR = data.data;
          console.log(USER_INFOR);

          subjects_in_the_semester("DEFAULT");
          //background

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
