


chrome.action.onClicked.addListener((tab) => {

    console.log("some thign")
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        if (!url.includes('https://fu.edunext.vn/')) {
            document.getElementById('container').innerHTML = '<div>Please Switch To <a href="https://fu.edunext.vn/"> EDUNEXT  </a> Tab To Edit Settings</div>'
        }
    });
});
