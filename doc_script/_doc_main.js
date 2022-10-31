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
                        //point starts here ++++++++++++++
                        const req = new XMLHttpRequest();
                        req.open("GET", "https://fuapi.edunext.vn/learn/v2/classes/presentcritical/get-list-present-critical?activityId=" + que[k].id + "&sessionId=" + sessionId + "&classId=" + classId);
                        req.addEventListener("load", function () {
                            const data = JSON.parse(req.responseText).data;
                            if (data && data.length !== 0) {
                                for (let n = 0; n < data.length; n++) {
                                    let point = 5;
                                    //auto point
                                    const xhr = new XMLHttpRequest();
                                    xhr.open("POST", 'https://fuapi.edunext.vn/learn/v2/classes/presentcritical/evaluate-present');
                                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                    xhr.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
                                    xhr.onreadystatechange = () => { // Call a function when the state changes.
                                        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                            console.log(data[n].id + " Done !")
                                        }
                                    }
                                    xhr.send(`{"presentCriticalId":${data[n].id},"beinTimePoint":${point},"focusOnTopicPoint":${point},"presentPoint":${point},"informativePoint":${point}}`);
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
