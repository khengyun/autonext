function init(data) {
    var s = document.createElement("script");
    s.src = chrome.runtime.getURL(data);
    document.head.appendChild(s);
    s.onload = function () {
        s.remove();
    };
}
init("doc_script/_api_conf.js")
init("doc_script/_doc_script.js");


