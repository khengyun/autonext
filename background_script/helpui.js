console.log("helpui.js")
function check_course_list(params) {
    var boolean = false;
  
    USER_COURSE.forEach(element => {
      if (element.id == params)
      {
        boolean = true;
      }
    })
    return boolean;
  }



  // convert questions to json
function question_format(params) {

    for (let i = 0; i < params.length; i++) {
        const element = params[i];
        params[i].questions = JSON.parse(element.questions);
    }
    
    return params;
}


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