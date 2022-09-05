function Load_scripts() {
  var collection = document.getElementsByClassName("course-infor");

//   for (let i=0; i < collection.length; i++) {
//       collection[i].style.backgroundColor = "red";
   
//  }
// }


chrome.action.onClicked.addListener((tab) => {
    
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: Load_scripts,
    });
  }
});
