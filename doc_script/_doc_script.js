function push_user_ingroup(push_data) {
    let activityId = push_data.activityId
    let classId = push_data.classId
    let groupId = push_data.groupId

    console.log(push_data)

    const post_point_to_server = post_api({
        "url": `https://fuapi.edunext.vn/learn/v2/classes/presentcritical/evaluate-inside-group?activityId=${activityId}&classId=${classId}&groupid=${groupId}`,
        "body": `[${push_data.body}]`
    })
    post_point_to_server.then((e) => {
        // console.log(e)
        //log some thing here
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


                if (presentation_grading){
                    evaluate_present({
                        "present_id": present_id,
                        "title": title,
                        "url": 'https://fuapi.edunext.vn/learn/v2/classes/presentcritical/evaluate-present',
                    })
                }

                if (group_members_grading){
                    Individual_grade({
                        "sessionId": sessionId,
                        "activityId": activityId,
                        "classId": classId,
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

            let sessionId = list_sessions_in_course[session].sessionId;
            let isOnGoing = list_sessions_in_course[session].isOnGoing;
            let list_activities = list_sessions_in_course[session].sections[0].activities
            let courseId = list_sessions_in_course[session].sections[0].courseId

            // console.log(list_sessions_in_course[session])
            if (list_activities && list_activities.length !== 0) {
                for (let activitie = 0; activitie < list_activities.length; activitie++) {

                    let activityId = list_activities[activitie].id;
                    let sectionId = list_activities[activitie].sectionId;
                    let title = list_activities[activitie].title;
                    let endTime = list_activities[activitie].endTime;
                    let startTime = list_activities[activitie].startTime;
                    let currentUTC = list_activities[activitie].currentUTC;
                    let permalink = list_activities[activitie].permalink;

                    get_list_present_critical({
                        "activityId": activityId,
                        "sessionId": sessionId,
                        "classId": input_get_class_sessions.classId,
                        "title": input_get_class_sessions.title,

                    })


                    console.log(`${input_get_class_sessions.title} ${activitie}/${list_activities.length - 1}`)
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
    _setting_.then(()=>{
        //code something here
        get_course_current_of_user()
    })
        .finally(()=>{
        console.log("done update local")
    })
}


__main__()