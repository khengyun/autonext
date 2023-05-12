console.log("some thing here")
// Listen for messages from the content script
TOKEN = "123";

function logMessage(message) {
    console.log(message)

}   




chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        logMessage(request)
    }
);