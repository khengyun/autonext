const point = 5

function push_user_ingroup(data,activities_id,classId,groupId){

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://fuapi.edunext.vn/learn/v2/classes/presentcritical/evaluate-inside-group?activityId=${activities_id}&classId=${classId}&groupid=${groupId}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
    xhr.onreadystatechange = () => { // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log("done")
        }
    }
    xhr.send(`[${data}]`);
}
function Individual_grade(activities_id, sessionId, classId) {
    const req = new XMLHttpRequest();
    req.open("GET", `https://fuapi.edunext.vn/learn/v2/course/get-session-activity-detail?activityId=${activities_id}&sessionid=${sessionId}`);
    req.addEventListener("load", function () {
        const data = JSON.parse(req.responseText).data;
        let groupId = data.groupId
        if (groupId){
            req.open("GET", `https://fuapi.edunext.vn/learn/v2/classes/presentcritical/get-evaluate-inside-group-score?groupid=${groupId}&activityId=${activities_id}&classId=${classId}`);
            req.addEventListener("load", function () {
                const data = JSON.parse(req.responseText).data;

                // console.log(data)
                js_data = {'userId':0,'hardWorkingPoint':0,'goodPoint':0,'cooperativePoint':0}
                const list_user_point = []
                for (let member = 0 ; member < data.length ; member++){
                    js_data.userId = data[member].userId;
                    js_data.hardWorkingPoint = point;
                    js_data.goodPoint = point;
                    js_data.cooperativePoint = point;
                    list_user_point.push(JSON.stringify(js_data))
                    if (list_user_point.length === data.length){
                        push_user_ingroup(list_user_point, activities_id, classId, groupId)
                        console.log(list_user_point)
                    }
                }
            });
            req.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
            req.send();
        }

    });
    req.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
    req.send();
}

function post_presentation_evaluate(point, presentCriticalId) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://fuapi.edunext.vn/learn/v2/classes/presentcritical/evaluate-present');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
    xhr.onreadystatechange = () => { // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            // console.log(data[n].id+ " Done !")
        }
    }
    xhr.send(`{"presentCriticalId":${presentCriticalId},"beinTimePoint":${point},"focusOnTopicPoint":${point},"presentPoint":${point},"informativePoint":${point}}`);
}

let listCourseOfUser = [];

function reqListener() {
    const data = this.responseText;
    listCourseOfUser = JSON.parse(data).data.listCourseOfUser
    for (let i = 0; i < listCourseOfUser.length; i++) {
        const req = new XMLHttpRequest();
        req.open("GET", "https://fuapi.edunext.vn/learn/v2/classes/get-class-sessions-details?classId=" + listCourseOfUser[i].classId + "&courseId=" + listCourseOfUser[i].id);
        req.addEventListener("load", function () {
            let classId = listCourseOfUser[i].classId
            const data = req.responseText;
            let reqLise = JSON.parse(data).data.sessions

            for (let j = 0; j < reqLise.length; j++) {
                // console.log(reqLise[j].sections[0].activities)
                const que = reqLise[j].sections[0].activities
                let sessionId = reqLise[j].sessionId
                if (que && que.length !== 0) {
                    for (let k = 0; k < que.length; k++) {
                        let activities_id = que[k].id
                        let sectionId = que[k].sectionId
                        //point starts here ++++++++++++++
                        const req = new XMLHttpRequest();
                        req.open("GET", "https://fuapi.edunext.vn/learn/v2/classes/presentcritical/get-list-present-critical?activityId=" + que[k].id + "&sessionId=" + sessionId + "&classId=" + classId);
                        req.addEventListener("load", function () {
                            const data = JSON.parse(req.responseText).data;

                            Individual_grade(activities_id, sessionId, classId)

                            if (data && data.length !== 0) {
                                for (let n = 0; n < data.length; n++) {

                                    let present_id = data[n].id;
                                    post_presentation_evaluate(point, present_id)

                                }
                            }
                        });
                        req.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
                        req.send();
                        // console.log(que[k])
                    }
                }
            }
        });
        req.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
        req.send();
    }
}

function get_data() {
    const req = new XMLHttpRequest();
    req.open("GET", "https://fuapi.edunext.vn/learn/v2/classes/get-course-current-of-user");
    req.addEventListener("load", reqListener);
    req.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
    req.send();
}

get_data()
