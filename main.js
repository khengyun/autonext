function run_kk(data) {
    return new Promise((resolve, reject) => {
        let s = document.createElement("script");
        s.src = chrome.runtime.getURL(data);
        document.head.appendChild(s);
        s.onload = function () {
            s.remove();
            resolve()
        };
    })
}

let _init_ = run_kk("doc_script/_api_conf.js")
_init_.then(() => {
    let init = run_kk("doc_script/_doc_script.js")
    init.then(() => {





    })
})



