
const CONST_SCREEN = {
    LIST: "LIST",
    DETAIL: "DETAIL"
}

const chromeTabsQuery = (objDataSend, callBack) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, objDataSend, callBack);
    });
}
//
const chatChatGpt = (text, callBack) => {
    chromeTabsQuery({ type: "chat", text: text }, function ({ content }) {
        callBack(content);
    });
}
//
const getContentChatGpt = (callBack) => {
    chromeTabsQuery({ type: "get-chat" }, function ({ content }) {
        callBack(content);
    });
}