


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

function format_grade_teammates(
  params,
  privateCqId,
  classroomSessionId,
  groupId
) {
  // console.log(params);
  // console.log(privateCqId, classroomSessionId, groupId);
  var teamlist = params;
  var newParams = [];

  for (let index = 0; index < teamlist.length; index++) {
    newParams.push({
      id: teamlist[index].id,
      hardWorking: 5,
      goodKnowledge: 5,
      teamWorking: 5,
      userIsGraded: teamlist[index].userIsGraded
        ? teamlist[index].userIsGraded
        : 0,
      groupId: groupId ? groupId : 0,
      privateCqId: privateCqId,
      classroomSessionId: teamlist[index].classroomSessionId
        ? teamlist[index].classroomSessionId
        : 0,
      userIsGradedId: teamlist[index].userIsGraded
        ? teamlist[index].userIsGraded
        : 0,
    });
  }
  // console.log(newParams);
  return newParams;
}

//call update api from github
function update_api() {
    const ans = get_api({
      url: "https://raw.githubusercontent.com/khengyun/autonext/main/background_script/apicallpack.json",
    });
    ans.then((data) => {
        API = data;
        console.log(API)
    })
    
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
  if(request.type == 'content_to_background') {
    
    const ans = post_api({url: `https://fugw-edunext.fpt.edu.vn/api/auth/token`})
    ans.then((data) => {
      // console.log(data)
      messtopopup({type: "background", message: data.data})
    })
  }
  if(request.type == 'popup_to_background') { 
    const ans = post_api({url: `https://fugw-edunext.fpt.edu.vn/api/auth/token`})
    ans.then((data) => {
      // console.log(data)
      messtopopup({type: "background", message: data.data})
    })
  }
})
