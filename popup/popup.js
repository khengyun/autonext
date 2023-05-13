const version = chrome.runtime.getManifest().version;
const elmColors = document.getElementsByName("apply_button");
document.getElementById("version").innerText = `v${version}`;

var USER_INFOR = {};
// receive mess from background

function localStorageAction(params) {
  if (params.type == "get") {
    return localStorage.getItem(params.key);
  }
  if (params.type == "set") {
    localStorage.setItem(params.key, JSON.stringify(params.value));
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "background") {
    console.log(request.message);
    USER_INFOR = request.message;

    //save to local storage
    localStorageAction({ type: "set", key: "user_infor", value: USER_INFOR });
    loadLocaltoPopup();

  }
});

function loadLocaltoPopup(){
  if (JSON.parse(localStorage.getItem("user_infor"))) {
    USER_INFOR = JSON.parse(
      localStorageAction({
        type: "get",
        key: "user_infor",
      })
    );

    document.getElementById(
      "container"
    ).innerHTML = `<p>Email: ${USER_INFOR.email} </br>
        Name: ${USER_INFOR.name} </br> 
        RollNumber: ${USER_INFOR.rollNumber} </br>
         </p>`;
  } else {
    document.getElementById("container").innerHTML =
      '<div>Please Login To <a  href="https://fu-edunext.fpt.edu.vn"  > EDUNEXT  </a></div>';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadLocaltoPopup();
});
