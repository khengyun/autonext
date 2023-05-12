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