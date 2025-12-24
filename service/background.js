const sync_key = 'extension-sync';
const update_key = 'extension-update';

const route_detect = 'route-detect';

const novelpia = 'https://novelpia.com';


/**
 * 노벨피아 url 변경 감지
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {
            message: route_detect
        })
        .catch(() => {});
    }
});



/**
 * 확장프로그램 설치 감지
 * 옵션 페이지 열림
 */
chrome.runtime.onInstalled.addListener(async d => {
    if (d.reason === 'install') {
        await chrome.storage.local.set({ [sync_key]: 1 });
        chrome.runtime.openOptionsPage();
        qm = checkQuickMybook();
    }
    else if (d.reason === "update") {
        chrome.storage.local.set({ [update_key]: 1 });
    }
});




/**
 * 확장프로그램 아이콘 클릭 감지
 * 옵션 페이지 열림
 */
chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage(); 
});

/**
 * 옵션 페이지 열림 커맨드
 */
chrome.commands.onCommand.addListener(async (command) => {
    switch(command) {
        case 'run-options':
            chrome.runtime.openOptionsPage();
            break;
        
        case 'run-novelpia':
            chrome.tabs.create({ url: novelpia });
            break;

        case 'run-novelpia-mybook':
            const mybook_data = await chrome.storage.sync.get([mybook_data_key]);
            const mybook_matches = {
                like: 'like',
                alarm: 'alarm',
                collect: 'collect',
                last: 'last_view',
            };
            const mybook_result = novelpia + '/mybook/' + (mybook_matches[mybook_data[mybook_data_key]] ?? '');
            chrome.tabs.create({ url: mybook_result });
            break;

        default:
            console.warn(`Command: '${command}' isn't defined`);
            break;
    }
});
