const sync_key = 'extension-sync';
const update_key = 'extension-update';
const mybook_key = 'quick-mybook';
const popup_location = '/page/popup.html';

let qm = true;


/**
 * 확장프로그램 설치 감지
 * 옵션 페이지 열림
 */
chrome.runtime.onInstalled.addListener(async d => {
    if (d.reason === 'install') {
        await chrome.storage.local.set({ [sync_key]: 1 });
        chrome.runtime.openOptionsPage();
    }
    else if (d.reason === "update") {
        chrome.storage.local.set({ [update_key]: 1 });
        qm = checkQuickMybook();
    }
});



/**
 * 브라우저 첫 실행 시 빠른 내서재 옵션 켜짐 감지 후 팝업 생성
 */
chrome.runtime.onStartup.addListener(() => {
    qm = checkQuickMybook();
});

function checkQuickMybook() {
    let bool = false;
    chrome.storage.local.get([sync_key, mybook_key]).then(r => {
        if (r[sync_key]) 
            chrome.storage.sync.get([mybook_key]).then(r1 => {
                bool = setPopup(r1);
            });
        else 
            bool = setPopup(r);
    })

    return bool;
}

function setPopup(r) {
    if (r[mybook_key]) {
        chrome.action.setPopup({
            popup: popup_location
        });
        return true;
    }
    else return false;
}

/**
 * 확장프로그램 아이콘 클릭 감지
 * 옵션 페이지 열림
 */
chrome.action.onClicked.addListener(() => {
    if (!qm) {
        qm = checkQuickMybook();
        chrome.runtime.openOptionsPage(); 
    }
});

/**
 * 옵션 페이지 열림 커맨드
 */
chrome.commands.onCommand.addListener((command) => {
    if (command == 'run-options')
        chrome.runtime.openOptionsPage();
});
