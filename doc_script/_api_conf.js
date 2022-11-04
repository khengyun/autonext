let evaluate_present_point = 5;
let Individual_grade_point = 5;
let group_members_grading = true;
let presentation_grading = true;
let discussion_grading = true


function get_settings(){
    return new Promise((resolve, reject)=>{
        if (localStorage.getItem("setting_value")){
            evaluate_present_point = JSON.parse(localStorage.getItem("setting_value")).present_point;
            Individual_grade_point = JSON.parse(localStorage.getItem("setting_value")).Individual_point;
            group_members_grading = JSON.parse(localStorage.getItem("setting_value")).group_members_grading;
            presentation_grading = JSON.parse(localStorage.getItem("setting_value")).presentation_grading;
            discussion_grading = JSON.parse(localStorage.getItem("setting_value")).discussion_grading;

            resolve()
        }else{
            const setting_value = {
                "present_point":5,
                "Individual_point":5,
                "group_members_grading":true,
                "presentation_grading" :true,
                "discussion_grading":true,
            }
            console.log(setting_value)
            localStorage.setItem("setting_value",JSON.stringify(setting_value))
            resolve()
        }
    })
}

function post_api(input_get_data) {
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();
        xhr.open("POST", input_get_data.url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
        xhr.onreadystatechange = () => { // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                resolve(1)
            }
        }
        xhr.send(input_get_data.body);
    })

}

function get_api(input_get_data) {
    return new Promise((resolve, reject) => {
        function reqListener_resolve() {
            resolve(this.responseText)
        }

        function reqListener_reject() {
            reject(`Error when load ${input_get_data.url}`)
        }

        const req = new XMLHttpRequest();
        req.open("GET", input_get_data.url);
        req.addEventListener("load", reqListener_resolve);
        req.addEventListener("error", reqListener_reject)
        req.setRequestHeader('Authorization', 'Bearer ' + AccessToken);
        req.send();
    })
}