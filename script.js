function Load_scripts() {
  var collection = document.getElementsByClassName("course-infor");
}

chrome.action.onClicked.addListener((tab) => {
    
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: Load_scripts,
    });
  }
});
