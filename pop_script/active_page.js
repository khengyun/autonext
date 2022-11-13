function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}


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
    if (!url.includes('https://fu.edunext.vn/')) {
        document.getElementById('container').innerHTML = '<div>Please Switch To <a href="https://fu.edunext.vn"> EDUNEXT  </a> Tab To Edit Settings</div>'
    }
});

