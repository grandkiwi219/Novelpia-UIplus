const sync_key = 'extension-sync';
const update_key = 'extension-update';


/**
 * 확장프로그램 설치 감지
 * 옵션 페이지 열림
 */
chrome.runtime.onInstalled.addListener(async d => {
    if (d.reason === 'install') {
        await chrome.storage.local.set({ [sync_key]: true });
        chrome.runtime.openOptionsPage();
    }
    else if (d.reason === "update") {
        chrome.storage.local.set({ [update_key]: true });
    }
});

/**
 * 확장프로그램 아이콘 클릭 감지
 * 옵션 페이지 열림
 */
chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});
