let ele = document.getElementsByClassName("view-detail")


const compareDates = (endtime, currenttime) => {
    let date1 = new Date(endtime);
    let date2 = new Date(currenttime);

    if (date1 < date2) {
        return false
    } else if (date1 >= date2) {
        return true
};}




function remove_loading(){
    for (let i = 0 ; i < ele.length ; i++){
        setInterval(function () {

            document.getElementById(`loadding${i}`)?.remove();

        },5000)
    }
}

function push_user_ingroup(push_data) {
    let activityId = push_data.activityId
    let classId = push_data.classId
    let groupId = push_data.groupId


    const post_point_to_server = post_api({
        "url": `https://fuapi.edunext.vn/learn/v2/classes/presentcritical/evaluate-inside-group?activityId=${activityId}&classId=${classId}&groupid=${groupId}`,
        "body": `[${push_data.body}]`
    })
    post_point_to_server.then((e) => {
        // console.log(e)
        //log some thing here
    }).catch((e)=>{
        console.log(e.message)
    })
}

function get_evaluate_inside_group_score(input_data) {
    // console.log(input_data)

    const return_data = get_api({
        "url": `https://fuapi.edunext.vn/learn/v2/classes/presentcritical/get-evaluate-inside-group-score?groupid=${input_data.groupId}&activityId=${input_data.activityId}&classId=${input_data.classId}`
    })
    return_data.then((e) => {
        let point = Individual_grade_point
        js_data = {'userId': 0, 'hardWorkingPoint': 0, 'goodPoint': 0, 'cooperativePoint': 0}
        const members = JSON.parse(e).data;
        const list_user_point = []
        for (let member = 0; member < members.length; member++) {
            js_data.userId = members[member].userId;
            js_data.hardWorkingPoint = point;
            js_data.goodPoint = point;
            js_data.cooperativePoint = point;
            list_user_point.push(JSON.stringify(js_data))

            if (list_user_point.length === members.length) {
                push_user_ingroup({
                    "body": list_user_point,
                    "activityId": input_data.activityId,
                    "classId": input_data.classId,
                    "groupId": input_data.groupId
                })
            }
        }

    })
}

function Individual_grade(input_data) {
    const req = new XMLHttpRequest();
    req.open("GET", `https://fuapi.edunext.vn/learn/v2/course/get-session-activity-detail?activityId=${input_data.activityId}&sessionid=${input_data.sessionId}`);
    req.addEventListener("load", function () {
        const data = JSON.parse(req.responseText).data;
        let groupId = data.groupId;

        if (groupId) {
            get_evaluate_inside_group_score({
                "groupId": groupId,
                "activityId": input_data.activityId,
                "classId": input_data.classId
            })
        }


    });
    req.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
    req.send();
}

function evaluate_present(presentCriticalId) {
    let point = evaluate_present_point;

    let return_data = post_api({
        "url": presentCriticalId.url,
        "present_id": presentCriticalId.present_id,
        "point": point,
        "body": `{"presentCriticalId":${presentCriticalId.present_id},"beinTimePoint":${point},"focusOnTopicPoint":${point},"presentPoint":${point},"informativePoint":${point}}`
    })
    return_data.then((e) => {
        //output some thing here
    })
}

function get_list_present_critical(get_list_present) {

    let activityId = get_list_present.activityId
    let sessionId = get_list_present.sessionId
    let classId = get_list_present.classId

    let title = get_list_present.title
    let current_active_count = get_list_present.current_active_count
    let list_active_lenght = get_list_present.list_active_lenght
    let status = true

    let data = get_api({
        url: "https://fuapi.edunext.vn/learn/v2/classes/presentcritical/get-list-present-critical?activityId=" + activityId + "&sessionId=" + sessionId + "&classId=" + classId
    })
    data.then((e) => {
        let list_present_critical = JSON.parse(e).data
        // console.log(list_present_critical)
        if (list_present_critical && list_present_critical.length !== 0) {

            let check_done_evaluate_present = 0


            for (let present_critical = 0; present_critical < list_present_critical.length; present_critical++) {

                let activityId = list_present_critical[present_critical].activityId;
                let present_id = list_present_critical[present_critical].id;
                let presentGroupId = list_present_critical[present_critical].presentGroupId;
                let presentGroupName = list_present_critical[present_critical].presentGroupName;
                let criticalGroupId = list_present_critical[present_critical].criticalGroupId;
                let criticalGroupName = list_present_critical[present_critical].criticalGroupName;

                // remove_loading()

                if (!presentation_grading && !group_members_grading) {

                }


                if (presentation_grading ) {
                    evaluate_present({
                        "present_id": present_id,
                        "title": title,
                        "url": 'https://fuapi.edunext.vn/learn/v2/classes/presentcritical/evaluate-present',
                    })
                }

                // console.log(list_present_critical)
            }

        }
    })

}

function get_class_sessions_details(input_get_class_sessions) {
    let data = get_api({
        url: "https://fuapi.edunext.vn/learn/v2/classes/get-class-sessions-details?classId=" + input_get_class_sessions.classId + "&courseId=" + input_get_class_sessions.CourseOfUser_id
    })
    data.then((e) => {
        let list_sessions_in_course = JSON.parse(e).data.sessions;
        // console.log({"externalcode: ":input_get_class_sessions.externalcode,list_sessions_in_course})
        for (let session = 0; session < list_sessions_in_course.length; session++) {

            // let endTime = list_sessions_in_course[session].endTime; //th???i gian k???t th??c m??n h???c
            let sessionId = list_sessions_in_course[session].sessionId;
            let isOnGoing = list_sessions_in_course[session].isOnGoing;
            let list_activities = list_sessions_in_course[session].sections[0].activities

            let courseId = list_sessions_in_course[session].sections[0].courseId

            // console.log(list_sessions_in_course[session])
            if (list_activities && list_activities.length !== 0 ) {
                for (let activitie = 0; activitie < list_activities.length; activitie++) {


                    let activityId = list_activities[activitie].id;
                    let sectionId = list_activities[activitie].sectionId;
                    let title = list_activities[activitie].title;
                    let endTime = list_activities[activitie].endTime; //th???i gian k???t th??c ho???t ?????ng
                    let startTime = list_activities[activitie].startTime;
                    let currentUTC = list_activities[activitie].currentUTC;
                    let permalink = list_activities[activitie].permalink;

                    if (compareDates(endTime,currentUTC)  ){

                        // console.log(endTime,currentUTC,input_get_class_sessions.classId,input_get_class_sessions.CourseOfUser_id, activityId ,sessionId)

                        get_list_present_critical({
                            "activityId": activityId,
                            "sessionId": sessionId,
                            "classId": input_get_class_sessions.classId,
                            "title": input_get_class_sessions.title,
                        })

                        if (group_members_grading ) {

                            Individual_grade({
                                "sessionId": sessionId,
                                "activityId": activityId,
                                "classId": input_get_class_sessions.classId,
                            })
                        }
                    }



                    // console.log(`${input_get_class_sessions.title} ${activitie}/${list_activities.length - 1}`)
                }
            }
        }
    })
}

function get_course_current_of_user() {
    let data = get_api({
            url: "https://fuapi.edunext.vn/learn/v2/classes/get-course-current-of-user"
        }
    )
    data.then((e) => {
        listCourseOfUser = JSON.parse(e).data.listCourseOfUser
        for (let CourseOfUser = 0; CourseOfUser < listCourseOfUser.length; CourseOfUser++) {
            let classId = listCourseOfUser[CourseOfUser].classId;
            let title = listCourseOfUser[CourseOfUser].title;
            let externalcode = listCourseOfUser[CourseOfUser].externalcode;
            let CourseOfUser_id = listCourseOfUser[CourseOfUser].id;
            let owner_Id = listCourseOfUser[CourseOfUser].owner_Id;
            let owner = listCourseOfUser[CourseOfUser].owner;
            let totalStudent = listCourseOfUser[CourseOfUser].totalStudent;

            get_class_sessions_details({
                "classId": classId,
                "CourseOfUser_id": CourseOfUser_id,
                "externalcode": externalcode,
                "title": externalcode
            });
            console.log(classId, externalcode, CourseOfUser_id, owner_Id, owner, totalStudent)
        }
    })
}

function __main__() {

    const _setting_ = get_settings()
    _setting_.then(() => {
        //code something here

        if (work) {
            get_course_current_of_user()

            setInterval(function () {
                const element = document.getElementsByClassName("course-infor");
                let text_null = element[0]?.getElementsByTagName("a")[1].innerText ;

                if (text_null !== undefined ){
                    for (let i = 0; i < element.length; i++) {
                        element[i].getElementsByTagName("a")[1]?.setAttribute("id", `loadding${i}`)
                        element[i].getElementsByTagName("a")[1].innerHTML = `

                    <div  class="load_icon loadingio-spinner-spinner-i78guwe8ib">
                        <div class="ldio-onmbc07cl2j">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        
                    </div>
                    
                    <style type="text/css">
                    @keyframes ldio-onmbc07cl2j {
                      0% { opacity: 1 }
                      100% { opacity: 0 }
                    }
                    .ldio-onmbc07cl2j div {
                      left: 50px;
                      top: 50px;
                      position: fixed;
                      animation: ldio-onmbc07cl2j linear 1s infinite;
                      background: #34bf49;
                      width: 12px;
                      height: 24px;
                      border-radius: 6px / 12px;
                      transform-origin: 6px 52px;
                      
                      
                    }.ldio-onmbc07cl2j div:nth-child(1) {
                      transform: rotate(0deg);
                      animation-delay: -0.9166666666666666s;
                      background: #0099e5;
                    }.ldio-onmbc07cl2j div:nth-child(2) {
                      transform: rotate(30deg);
                      animation-delay: -0.8333333333333334s;
                      background: #ff4c4c;
                    }.ldio-onmbc07cl2j div:nth-child(3) {
                      transform: rotate(60deg);
                      animation-delay: -0.75s;
                      background: #34bf49;
                    }.ldio-onmbc07cl2j div:nth-child(4) {
                      transform: rotate(90deg);
                      animation-delay: -0.6666666666666666s;
                      background: #0099e5;
                    }.ldio-onmbc07cl2j div:nth-child(5) {
                      transform: rotate(120deg);
                      animation-delay: -0.5833333333333334s;
                      background: #ff4c4c;
                    }.ldio-onmbc07cl2j div:nth-child(6) {
                      transform: rotate(150deg);
                      animation-delay: -0.5s;
                      background: #34bf49;
                    }.ldio-onmbc07cl2j div:nth-child(7) {
                      transform: rotate(180deg);
                      animation-delay: -0.4166666666666667s;
                      background: #0099e5;
                    }.ldio-onmbc07cl2j div:nth-child(8) {
                      transform: rotate(210deg);
                      animation-delay: -0.3333333333333333s;
                      background: #ff4c4c;
                    }.ldio-onmbc07cl2j div:nth-child(9) {
                      transform: rotate(240deg);
                      animation-delay: -0.25s;
                      background: #34bf49;
                    }.ldio-onmbc07cl2j div:nth-child(10) {
                      transform: rotate(270deg);
                      animation-delay: -0.16666666666666666s;
                      background: #0099e5;
                    }.ldio-onmbc07cl2j div:nth-child(11) {
                      transform: rotate(300deg);
                      animation-delay: -0.08333333333333333s;
                      background: #ff4c4c;
                    }.ldio-onmbc07cl2j div:nth-child(12) {
                      transform: rotate(330deg);
                      animation-delay: 0s;
                      background: #34bf49;
                    }
                    .loadingio-spinner-spinner-i78guwe8ib {
                      width: 80px;
                      height: 80px;
                      /*display: inline-block;*/
                      /*overflow: hidden;*/
                      background: #ffffff;
                    }
                    .ldio-onmbc07cl2j {
                      width: 100%;
                      height: 100%;
                      position: relative;
                      transform: translateZ(0) scale(1);
                      backface-visibility: hidden;
                      
                      transform-origin: 0 0; /* see note above */
                    }
                    .ldio-onmbc07cl2j div { box-sizing: content-box; }
                    /* generated by https://loading.io/ */
                    
                    
                    
                    
                    .view-detail{
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        margin-top: -10px ;
                        padding-right: 15px;
                        
                    }
                    .course-infor{
                        display: grid;
                        grid-template-rows: 45% 10% 45%;
                        
                    
                    }
                    
                    .course-title{
                    
                      text-align: center;
                    
                    }
                    
                    
                    </style>

`

                    }
                }
            }, 800);


        }else{
            const element = document.getElementsByClassName("course-infor");
            for (let i = 0; i < element.length; i++) {

                let check = element[i]?.getElementsByTagName("a")[1].getElementsByClassName("load_icon")

                if (check){

                    element[i]?.getElementsByTagName("a")[1].setAttribute("id", `loadding${i}`)
                    element[i].getElementsByTagName("a")[1].innerHTML = "<div>Done</div>"
                }




            }

        }




    })
        .finally(() => {

        })
}


__main__()


// let everythingLoaded = setInterval(function() {
//     if (/loaded|complete/.test(document.readyState)) {
//         clearInterval(everythingLoaded);
//         alert("all loaded")
//          // this is the function that gets called when everything is loaded
//     }
// }, 10);
















