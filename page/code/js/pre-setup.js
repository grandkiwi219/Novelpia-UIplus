// 기본 값
let storage = chrome.storage.sync;
const local = chrome.storage.local;

let prevDark = true;

const moon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -2.5 24 19">'
           + '<path d="M 3.223 0.36 A 1 1 0 0 0 12.91 12.475 Q 13.232 11.994 12.666 11.924 Q 3.008 10.089 3.681 0.655 Q 3.719 0.109 3.223 0.36" fill="#000000"/>'
           + '</svg>';

const sun = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2.5 22 19">'
          + '<path d="M8 3A1 1 0 008 11 1 1 0 008 3M8 0Q8.46.002 8.46.481L8.453 1.496Q8.453 1.997 8 2 7.514 1.992 7.508 1.53L7.503.459Q7.502.002 8 0zM3 7Q2.991 6.51 2.488 6.512L1.514 6.51Q1 6.517 1 7 1.007 7.502 1.481 7.502L2.506 7.502Q3.01 7.498 3 7M13 7Q13.006 6.488 13.487 6.483L14.477 6.483Q15 6.488 15 7 15.005 7.497 14.5 7.497L13.496 7.497Q13.006 7.492 13 7M8 12Q8.47 12.001 8.48 12.477L8.48 13.481Q8.48 13.991 8 14 7.513 13.995 7.494 13.495L7.485 12.505Q7.48 12.005 8 12" fill="#ffffff"/>'
          + '</svg>'
          + '<svg xmlns="http://www.w3.org/2000/svg" class="sun-deg" viewBox="-2.2 -2.2 22 19" transform="rotate(45, 50, 50)">'
          + '<path d="M8 3A1 1 0 008 11 1 1 0 008 3M8 0Q8.46.002 8.46.481L8.453 1.496Q8.453 1.997 8 2 7.514 1.992 7.508 1.53L7.503.459Q7.502.002 8 0zM3 7Q2.991 6.51 2.488 6.512L1.514 6.51Q1 6.517 1 7 1.007 7.502 1.481 7.502L2.506 7.502Q3.01 7.498 3 7M13 7Q13.006 6.488 13.487 6.483L14.477 6.483Q15 6.488 15 7 15.005 7.497 14.5 7.497L13.496 7.497Q13.006 7.492 13 7M8 12Q8.47 12.001 8.48 12.477L8.48 13.481Q8.48 13.991 8 14 7.513 13.995 7.494 13.495L7.485 12.505Q7.48 12.005 8 12" fill="#ffffff"/>'
          + '</svg>';


// 로딩 전 다크모드 여부 확인
try {
    let dark = JSON.parse(localStorage.dark);

    if (!dark) {
        document.getElementsByTagName('html')[0]
            .setAttribute('dark', 'false');
        prevDark = 0;
    } 
} catch (error) {
    localStorage.dark = 1;
}

// 로딩 전 로컬 스토리지의 싱크 키 존재 유무 확인
local.get([sync_key]).then(r => {
    if (!r[sync_key] && r[sync_key] != undefined)
        storage = local;
    else if (!r[sync_key])
        local.set({ [sync_key]: 1 });
});



let setting_data = [];
window.addEventListener('DOMContentLoaded', () => {
    setting_data.forEach(d => {
        customElements.define(`setting-${d.name}`, d.element);
    });
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
