function init(data) {
    var s = document.createElement("script");
    s.src = chrome.runtime.getURL(data);
    document.head.appendChild(s);
    s.onload = function () {
        s.remove();
    };
}
init("data/list_class.js");
init("dev.js");

class Manager {
    Token;
    UserName;
    UserID;
    Detail;
    permalink = "/en/course/";
    listCourseOfUser

    constructor(Token, UserName, UserID) {
        this.Token = Token;
        this.UserName = UserName;
        this.UserID = UserID;
    }

    getClass_List(){
        console.log(this.listCourseOfUser)
    }

}








// Event listener
document.addEventListener("RW759_connectExtension", function (e) {

    const manager = new Manager(e.detail.AccessToken, e.detail.UserName, e.detail.UserID)

    // console.log(manager.Token)

});
