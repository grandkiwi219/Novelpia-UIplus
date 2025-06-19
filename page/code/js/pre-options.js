// 기본 값
var storage = chrome.storage.sync;
const local = chrome.storage.local;

var prevDark = true;


// 로딩 전 다크모드 여부 확인
local.get(['dark']).then(r => {
    if (!r.dark && typeof r.dark == 'boolean') {
        document.getElementsByTagName('html')[0].setAttribute('dark', 'false');
        prevDark = false;
    }
});

// 로딩 전 로컬 스토리지의 싱크 키 존재 유무 확인
local.get([sync_key]).then(r => {
    if (!r[sync_key] && typeof r[sync_key] == 'boolean')
        storage = local;
    else if (!r[sync_key] && typeof r[sync_key] != 'boolean')
        local.set({ [sync_key]: true });
});

console.log(`   
%c███╗   ██╗  ██████╗  ██╗   ██╗  ██████╗ 
%c████╗  ██║  ██╔══██╗ ██║   ██║  ██╔══██╗
%c██╔██╗ ██║  ██████╔╝ ██║   ██║  ██████╔╝
%c██║╚██╗██║  ██╔═══╝  ██║   ██║  ██╔═══╝ 
%c██║ ╚████║  ██║      ╚██████╔╝  ██║     
%c╚═╝  ╚═══╝  ╚═╝       ╚═════╝   ╚═╝     
`,
"color: #ff33eb;",
"color: #f448fa;",
"color: #dc48fa;",
"color: #ce48fa;",
"color: #b648fa;",
"color: #a148fa;");
