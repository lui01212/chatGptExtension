let gobjElm;

window.onload = () => {
    try {
        if (typeof onStartUp != "undefined") {
            onStartUp();
        }
    } catch (ex) {
        alert(ex);
    }
};

const onStartUp = () => {
    createGateMessage();
}

const createGateMessage = () => {
    chrome.extension.onMessage.addListener((request, _, sendResponse) => {
        console.log(request);
        switch (request.type) {
            case "chat":
                chatWithText(request.text, sendResponse);
                break;
            case "get-chat":
                sendResponse(getChat());
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
        button.replaceWith(createElementFromHTML(`<button id="_chatgpt_" class="absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 disabled:text-gray-400 enabled:bg-brand-purple text-white bottom-1.5 transition-colors disabled:opacity-40" style="background-color: rgb(25, 195, 125);"><span class="" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" class="h-4 w-4 m-1 md:m-0" stroke-width="2"><path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"></path></svg></span></button>`));
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
        }, 3000);
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