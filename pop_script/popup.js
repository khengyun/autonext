const version = chrome.runtime.getManifest().version
const elmColors = document.getElementsByName("apply_button");
document.getElementById('version').innerText = `v${version}`

const colors = ["red", "blue"];

let json_data = {
    "present_point": 0,
    "Individual_point": 0,
    "group_members_grading": true,
    "presentation_grading": true,
    "discussion_grading": true,
    "work": true
}

async function handleAlarm() {
    try {
        await chrome.action.setIcon({
            path: {
                '128': '../assets/image.png'
            },
        });
    } catch (err) {
        console.error(err);
    }
}


function post_on_off(data) {
    localStorage.setItem("setting_value", JSON.stringify(data))
    location.reload();
}


const on_off_icon = document.getElementById("button_on_off");

function set_on_off_tooltip() {
    let dt = JSON.parse(localStorage.getItem("setting_value"))
    let set_on_off = document.getElementById("button_on_off_id");
    console.log(chrome.runtime.getManifest().version);
    if (dt.work){
        set_on_off.setAttribute("data-c-tooltip", `on`.toUpperCase())
    }else{
        set_on_off.setAttribute("data-c-tooltip", `off`.toUpperCase())
    }
}


function check_on_off() {
    let on_off = JSON.parse(localStorage.getItem("setting_value")).work;
    if (on_off) {
        on_off_icon.style.fill = '#adadad'
        // on_off_icon.setAttribute("fill", "#1db128 !important;")
        let set_off = JSON.parse(localStorage.getItem("setting_value"))
        set_off.work = false;
        json_data.work = false;
        localStorage.setItem("setting_value", JSON.stringify(set_off))


        handleAlarm()


        // chrome.action.setIcon({
        //     path: {
        //         '128': '../assets/image.png'
        //     }
        // });


        set_on_off_tooltip()
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: post_on_off,
                args: [json_data]
            });
        });


    } else if (!on_off) {
        on_off_icon.style.fill = '#1db128'
        // on_off_icon.setAttribute("fill", "#f67412 !important;");
        let set_on = JSON.parse(localStorage.getItem("setting_value"))
        set_on.work = true;
        json_data.work = true;
        localStorage.setItem("setting_value", JSON.stringify(set_on))




        chrome.action.setIcon({
            path: {
                '128': '../assets/logoauto.png'
            }
        });

        set_on_off_tooltip()
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: post_on_off,
                args: [json_data]
            });
        });


    }
}

//detec on off button
on_off_icon.addEventListener('click', function () {
    check_on_off()
})


for (let i = 0; i < elmColors.length; i++) {
    elmColors[i].onclick = () => {
        let change_things = document.getElementById('setting_button_block');
        let new_change = document.createElement("h5")
        new_change.setAttribute("class", "name_setting_block  done_setting_bloc");
        new_change.value = 'Updated settings!';
        document.getElementById("setting_button_block").innerHTML = `<div></div><h5 class="name_setting_block  done_setting_block">Updated settings!</h5>`


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
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: setBackGroundColor,
                args: [json_data]
            });
        });

    }
}

function setBackGroundColor(json_data) {

    localStorage.setItem("setting_value", JSON.stringify(json_data))
    location.reload();
}


document.addEventListener("DOMContentLoaded", function () {

    let load_on_off = JSON.parse(localStorage.getItem("setting_value")).work;

    document.getElementById("present_point").value = JSON.parse(localStorage.getItem("setting_value")).present_point.toString()
    document.getElementById("individual_point").value = JSON.parse(localStorage.getItem("setting_value")).Individual_point.toString()
    document.getElementById("presentation_grading_checkbox").checked = JSON.parse(localStorage.getItem("setting_value")).presentation_grading
    document.getElementById("members_grading_checkbox").checked = JSON.parse(localStorage.getItem("setting_value")).group_members_grading

    if (load_on_off) {
        on_off_icon.style.fill = '#1db128'
        json_data.work = load_on_off;
        set_on_off_tooltip()
    } else if (!load_on_off) {
        on_off_icon.style.fill = '#adadad'
        set_on_off_tooltip()
        json_data.work = load_on_off;
    }

})

