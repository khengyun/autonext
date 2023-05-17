function check_course_list(params) {
  var boolean = false;

  USER_COURSE.forEach((element) => {
    if (element.id == params) {
      boolean = true;
    }
  });
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

function group_have_user(params) {
  var team = [];
  params.forEach((group) => {
    console.log("group: ", group);

    // return group.listStudentByGroups;
    group.listStudentByGroups.forEach((element) => {
      if (element.id == USER_INFOR.userId) {
        team = group;
        console.log(team);
      }
    });
  });
  

  return {
    listStudentByGroups: team.listStudentByGroups,
    classroomSessionId: team.classroomSessionId,
    groupId: team.id,
  };
}

function format_grade_teammates(
  groups,
  privateCqId,
  classroomSessionId,
  groupId
) {
  // console.log(params);
  // console.log(privateCqId, classroomSessionId, groupId);
  user_group = group_have_user(groups);
  var teamlist = user_group.listStudentByGroups;
  var team_classroomSessionId = user_group.classroomSessionId;
  var team_groupId = user_group.groupId;
  console.log("user_group: ", user_group);
  console.log("teamlist: ", teamlist);
  console.log("teamlist: ", teamlist.length);

  // var teamlist = params;
  var newParams = [];

  for (let index = 0; index < teamlist.length; index++) {
    if (teamlist[index].id != USER_INFOR.userId) {
      console.log("user_in_teamlist", teamlist[index]);
      console.log(privateCqId, classroomSessionId);

      newParams.push({
        id: 539319,
        hardWorking: 5,
        goodKnowledge: 5,
        teamWorking: 5,
        userIsGraded: teamlist[index].id ? teamlist[index].id : 0,
        groupId: team_groupId ? team_groupId : 0,
        privateCqId: privateCqId,
        classroomSessionId: team_classroomSessionId ? team_classroomSessionId : 0,
        userIsGradedId: teamlist[index].id ? teamlist[index].id : 0,
      });
    }
  }

  console.log("newparams: ", newParams);
  // console.log("newparams: \n\n\n\n\n\n\n\n\n" , newParams.length);
  return newParams;
}

//call update api from github
function update_api() {
  const ans = get_api({
    url: "https://raw.githubusercontent.com/khengyun/autonext/main/background_script/apicallpack.json",
  });
  ans.then((data) => {
    API = data;
    console.log(API);
  });
}

// declare mess to post to popup script
function messtopopup(params) {
  chrome.runtime.sendMessage({
    message: params.message,
    type: params.type,
  });
}
// declare mess to post to popup script
function messtocontent(params, token) {
  chrome.tabs.sendMessage(params.tabId, {
    token: token,
    details: params,
  });
}

// background script listen message from popup script and content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(request);
  if (request.type == "content_to_background") {
    const ans = post_api({
      url: `https://fugw-edunext.fpt.edu.vn/api/auth/token`,
    });
    ans.then((data) => {
      // console.log(data)
      messtopopup({ type: "background", message: data.data });
    });
  }
  if (request.type == "popup_to_background") {
    const ans = post_api({
      url: `https://fugw-edunext.fpt.edu.vn/api/auth/token`,
    });
    ans.then((data) => {
      // console.log(data)
      messtopopup({ type: "background", message: data.data });
    });
  }
});
