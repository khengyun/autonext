const version = chrome.runtime.getManifest().version
const elmColors = document.getElementsByName("apply_button");
document.getElementById('version').innerText = `v${version}`



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'popup') {
      // Handle the message from the popup script here
      console.log('Received message from popup:', message);
      
      // Send a response back to the popup script
      sendResponse({type: 'background', message: USER_INFOR});
    }
  });