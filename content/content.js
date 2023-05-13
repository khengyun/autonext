console.log("content script is running")
// Listen for messages from the content script

function sendmess(params) {
    console.log(params)
    chrome.runtime.sendMessage(
        params     
)} 



function logMessage(message) {
    console.log(message)
    token = localStorage.getItem("token")
    console.log(`this is token: ${token}`)
    sendmess({type: "content_to_background", data: token})
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        logMessage(request)
    }
);