const elmColors = document.getElementsByName("apply_button");
const colors = ["red", "blue"];
let json_data = {"present_point": 0, "Individual_point": 0, "group_members_grading": true, "presentation_grading": true, "discussion_grading": true}

for (let i = 0; i < elmColors.length; i++) {
    elmColors[i].onclick = () => {
        let present_point = document.getElementById("present_point").value;
        let Individual_point = document.getElementById("individual_point").value;

        json_data.present_point = parseInt(present_point);
        json_data.Individual_point = parseInt(Individual_point);

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
    console.log("some thing")
    localStorage.setItem("setting_value", JSON.stringify(json_data))
    location.reload();
}


document.addEventListener("DOMContentLoaded",function (){

    document.getElementById("present_point").value = JSON.parse(localStorage.getItem("setting_value")).present_point.toString()
    document.getElementById("individual_point").value = JSON.parse(localStorage.getItem("setting_value")).Individual_point.toString()




})

