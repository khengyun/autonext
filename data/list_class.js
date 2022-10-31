function reqListsesson(){
    const data = this.responseText;
    reqLise = JSON.parse(data).data.sessions

    for(j=0;j<reqLise.length;j++){
        // console.log(reqLise[j].sections[0].activities)
        const que = reqLise[j].sections[0].activities
        for (k=0;k<que.length;k++){
            console.log(que[k])
        }
    }
}



let listCourseOfUser = [];
function reqListener() {
    const data = this.responseText;
    listCourseOfUser = JSON.parse(data).data.listCourseOfUser
    for(i = 0; i<listCourseOfUser.length; i++){
        const req = new XMLHttpRequest();
        req.open("GET", "https://fuapi.edunext.vn/learn/v2/classes/get-class-sessions-details?classId="+listCourseOfUser[i].classId+"&courseId="+listCourseOfUser[i].id);
        req.addEventListener("load", reqListsesson);
        req.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
        req.send();
    }
}

function get_data(){
    const req = new XMLHttpRequest();
    req.open("GET", "https://fuapi.edunext.vn/learn/v2/classes/get-course-current-of-user");
    req.addEventListener("load", reqListener);
    req.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
    req.send();
}

get_data()
