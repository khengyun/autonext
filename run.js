class Manager {
    Token;
    UserName;
    UserID;
    constructor(Token, UserName, UserID) {
        this.Token = Token;
        this.UserName = UserName;
        this.UserID = UserID;
    }
}


function init(data) {
    var s = document.createElement("script");
    s.src = chrome.runtime.getURL(data);
    document.head.appendChild(s);
    s.onload = function () {
        s.remove();
    };
}
init("dev.js");
init("data/list_class.js");



// Event listener
document.addEventListener("RW759_connectExtension", function (e) {

    const manager = new Manager(e.detail.AccessToken, e.detail.UserName, e.detail.UserID)
    console.log(manager.Token)

});
