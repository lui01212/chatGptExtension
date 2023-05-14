let gobjElm;

window.onload = () => {
    try {
        if (typeof onStartUp != "undefined") {
            onStartUp();
        }
    } catch (ex) { alert(ex); }
};

const onStartUp = () => {
    createGateMessage();
}

const createGateMessage = () => {
    chrome.extension.onMessage.addListener((request, _, sendResponse) => {
        switch (request.type) {
            case "chat":
                chatWithText(request.text, sendResponse);
                break;
            case "get-chat":
                gobjElm = null;
                getChatTimeOunt(sendResponse);
                break;
            default:
                break;
        }
        return true;
    });
}

const chatWithText = (text, sendResponse) => {
    document.getElementsByTagName('textarea')[0].value = text;
    if (document.getElementById("_chatgpt_")) {
        document.getElementById("_chatgpt_").click();
    } else {
        const button = getButtonDisabled();
        button.replaceWith(createElementFromHTML(`<button id="_chatgpt_" class="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>`));
        document.getElementById("_chatgpt_").click();
    }
    gobjElm = null;
    //
    getChatTimeOunt(sendResponse);
}

const getChatTimeOunt = (sendResponse) => {
    let objElm;
    if (gobjElm) {
        objElm = getChat();
        if (gobjElm.content.length == objElm.content.length) {
            console.log(gobjElm);
            sendResponse(gobjElm);
        } else {
            gobjElm = getChat();
            setTimeout(function () {
                getChatTimeOunt(sendResponse);
            }, 1000);
        }
    } else {
        gobjElm = getChat();
        setTimeout(function () {
            getChatTimeOunt(sendResponse);
        }, 10000);
    }
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
}

const getChat = () => {
    const elms = document.querySelectorAll('.group.w-full');
    const intLenght = elms.length;
    if (intLenght > 0) {
        return {
            content: traverse(elms[intLenght - 1])
        };
    } else {
        return {
            content: ""
        };
    }
}

const getButtonDisabled = () => {
    const button = document.querySelectorAll('button');
    for (let index = 0; index < button.length; index++) {
        let element = button[index];
        if (element.hasAttribute('disabled')) {
            return element;
        }
    }
}

function traverse(element) {
    if (element.classList.contains('markdown') && element.classList.contains('prose')) {
        return element.innerHTML;
    }

    for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            let nodeChild = traverse(child);
            if (nodeChild) {
                return nodeChild;
            }
        }
    }
}