
function check_version(data) {
    let local_version = version
    let github_version = data.tag_name.replace('v', '')

    if (local_version !== github_version) {
        let download_link = `https://github.com/khengyun/autonext/archive/refs/tags/${data.tag_name}.zip`

        let text = '<div style="color: crimson">  version is no longer supported, click <a target="_blank" href=!!!> here</a> to download the new_version </div>'
            .replace('!!!', `${download_link}`)
            .replace('new_version',`v${github_version}`)
            .replace('version',`v${local_version}`)


        document.getElementById("version").innerHTML = text;
        document.getElementById("version").style.position = 'static';
    }
}


chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

    //call api check version
    let repo_api = "https://api.github.com/repos/khengyun/autonext/releases/latest";
    fetch(repo_api).then(res => res.json()).then(jsonData => {

        check_version(jsonData)

    })

    let url = tabs[0].url;
    console.log(tabs)
    if (url == 'https://fu-edunext.fpt.edu.vn/login') {
        localStorageAction({type: "set", key: "user_infor", value: null});
        document.getElementById('container').innerHTML = '<div>Please Login To <a href="https://fu-edunext.fpt.edu.vn"  > EDUNEXT  </a></div>'
    }

    else {
        
        chrome.runtime.sendMessage({
            type: "popup_to_background"
          })

        
    //     if (JSON.parse(localStorage.getItem("user_infor"))) {
    //     USER_INFOR = JSON.parse(localStorageAction({
    //       type: "get",
    //       key: "user_infor",
    //     }))
          
    //     document.getElementById(
    //       "container"
    //     ).innerHTML = `<p>Email: ${USER_INFOR.email} </br>
    //         Name: ${USER_INFOR.name} </br> 
    //         RollNumber: ${USER_INFOR.rollNumber} </br>
    //          </p>`;
    //   } else {
    //     document.getElementById("container").innerHTML = '<div>Please Login To <a  href="https://fu-edunext.fpt.edu.vn"  > EDUNEXT  </a></div>'
    //     ;
    //   }
}


});

