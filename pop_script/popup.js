const elmColors = document.getElementsByName("apply_button");
const colors = ["red", "blue"];
let json_data = {"present_point": 0, "Individual_point": 0, "group_members_grading": true, "presentation_grading": true, "discussion_grading": true}

for (let i = 0; i < elmColors.length; i++) {
    elmColors[i].onclick = () => {

        let present_point = document.getElementById("present_point").value;
        let Individual_point = document.getElementById("individual_point").value;
        let group_members_grading = document.querySelector('#members_grading_checkbox').checked;
        let presentation_grading = document.querySelector('#presentation_grading_checkbox').checked;

        json_data.present_point = parseInt(present_point);
        json_data.Individual_point = parseInt(Individual_point);
        json_data.group_members_grading = group_members_grading;
        json_data.presentation_grading = presentation_grading

        localStorage.setItem("setting_value", JSON.stringify(json_data))
        // const element = document.getElementById('setting_table');
        // element.remove();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: setBackGroundColor,
                args: [json_data]
            });
        });

    }
}

function setBackGroundColor(json_data) {

    localStorage.setItem("setting_value", JSON.stringify(json_data))
    // location.reload();
}


document.addEventListener("DOMContentLoaded",function (){

    document.getElementById("present_point").value = JSON.parse(localStorage.getItem("setting_value")).present_point.toString()
    document.getElementById("individual_point").value = JSON.parse(localStorage.getItem("setting_value")).Individual_point.toString()
    document.getElementById("presentation_grading_checkbox").checked = JSON.parse(localStorage.getItem("setting_value")).presentation_grading
    document.getElementById("members_grading_checkbox").checked = JSON.parse(localStorage.getItem("setting_value")).group_members_grading


})

