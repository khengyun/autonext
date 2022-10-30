class Manager {
    Token;
    UserName;
    UserID;
    constructor(Token,UserName,UserID){
        this.Token = Token;
        this.UserName = UserName;
        this.UserID = UserID;
    }
    
}
function init() {
  var s = document.createElement("script");
  s.src = chrome.runtime.getURL("dev.js");
  document.head.appendChild(s);

  s.onload = function () {
    s.remove();
  };
}
init();

// Event listener
document.addEventListener("RW759_connectExtension", function (e) {

  console.log(e.detail);

});
