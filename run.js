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
  // e.detail contains the transferred data (can be anything, ranging
  // from JavaScript objects to strings).
  // Do something, for example:
  console.log(e.detail);
  chrome.storage.sync.set({auth_token: e.detail.AccessToken},function(){
    //save token to loval host
    console.log("saved token!! " + e.detail.AccessToken)
  })
});
