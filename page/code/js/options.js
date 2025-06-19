// 옵션 페이지 다크 모드
const headerThemeButton = document.getElementById('theme');
const html = document.querySelector('html');
//const prevDark = html.getAttribute('dark');

const moon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -2.5 24 19">'
           + '<path d="M 3.223 0.36 A 1 1 0 0 0 12.91 12.475 Q 13.232 11.994 12.666 11.924 Q 3.008 10.089 3.681 0.655 Q 3.719 0.109 3.223 0.36" fill="#000000"/>'
           + '</svg>';

const sun = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2.5 22 19">'
          + '<path d="M8 3A1 1 0 008 11 1 1 0 008 3M8 0Q8.46.002 8.46.481L8.453 1.496Q8.453 1.997 8 2 7.514 1.992 7.508 1.53L7.503.459Q7.502.002 8 0zM3 7Q2.991 6.51 2.488 6.512L1.514 6.51Q1 6.517 1 7 1.007 7.502 1.481 7.502L2.506 7.502Q3.01 7.498 3 7M13 7Q13.006 6.488 13.487 6.483L14.477 6.483Q15 6.488 15 7 15.005 7.497 14.5 7.497L13.496 7.497Q13.006 7.492 13 7M8 12Q8.47 12.001 8.48 12.477L8.48 13.481Q8.48 13.991 8 14 7.513 13.995 7.494 13.495L7.485 12.505Q7.48 12.005 8 12" fill="#ffffff"/>'
          + '</svg>'
          + '<svg xmlns="http://www.w3.org/2000/svg" class="sun-deg" viewBox="-2.2 -2.2 22 19" transform="rotate(45, 50, 50)">'
          + '<path d="M8 3A1 1 0 008 11 1 1 0 008 3M8 0Q8.46.002 8.46.481L8.453 1.496Q8.453 1.997 8 2 7.514 1.992 7.508 1.53L7.503.459Q7.502.002 8 0zM3 7Q2.991 6.51 2.488 6.512L1.514 6.51Q1 6.517 1 7 1.007 7.502 1.481 7.502L2.506 7.502Q3.01 7.498 3 7M13 7Q13.006 6.488 13.487 6.483L14.477 6.483Q15 6.488 15 7 15.005 7.497 14.5 7.497L13.496 7.497Q13.006 7.492 13 7M8 12Q8.47 12.001 8.48 12.477L8.48 13.481Q8.48 13.991 8 14 7.513 13.995 7.494 13.495L7.485 12.505Q7.48 12.005 8 12" fill="#ffffff"/>'
          + '</svg>';


if (!prevDark) headerThemeButton.innerHTML = moon;

headerThemeButton.addEventListener('click', function () {
    const currentDark = html.getAttribute('dark');

    if (currentDark == 'true') {
        html.setAttribute('dark', 'false');
        headerThemeButton.innerHTML = moon;
        local.set({ dark: false });
    } else {
        html.setAttribute('dark', 'true');
        headerThemeButton.innerHTML = sun;
        local.set({ dark: true });
    }
})





//----------------------------------------------------





// 추천
/* class ChuCheon extends HTMLElement {
    connectedCallback() {
        let chu = document.createElement('span');
        chu.classList.add('chucheon')
        chu.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;(추천)';

        this.appendChild(chu);
    }
}
customElements.define('chu-', ChuCheon); */



// 세팅 스위치 컴포넌트
class SettingSwitch extends HTMLElement {
    connectedCallback() {
        let center = document.createElement('div');
        let setting_switch = document.createElement('button');
        let key = this.getAttribute('key');
        let storage_type = this.getAttribute('storage');

        center.className = 'center';
        this.appendChild(center);
        center.appendChild(setting_switch);
        setting_switch.className='switch';

        let ss_storage = storage_type == 'local' ? local : storage;

        ss_storage.get([key]).then(r => {
            r[key] ? setting_switch.setAttribute('check', 'true') : setting_switch.setAttribute('check', 'false');
        })
    }
}
customElements.define('setting-switch', SettingSwitch);



// 세팅 셀렉트 컴포넌트
class SettingSelect extends HTMLElement {
    connectedCallback() {
        let contents = this.innerHTML.split('|').filter(r => r.trim() != "").map(r => {
            let splitContent = r.replace('}', '').split('{');
            return { value: splitContent[1].trim(), value_name: splitContent[0].trim() };
        });
        this.innerHTML = '';

        let key = this.getAttribute('key');
        let storage_type = this.getAttribute('storage');

        let selector = document.createElement('div');
        selector.classList.add('selector');
        if (this.getAttribute('type')?.trim() == 'long') selector.classList.add('long-form');

        this.appendChild(selector);

        let selector_value = document.createElement('button');
        selector_value.classList.add('selector-value');

        let value_name = document.createElement('div');
        value_name.classList.add('value-name');

        let arrow_pointer = document.createElement('div');
        arrow_pointer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2 14 14">`
                                    + `<path d="M0 3 4 7.2 8 3 0 3" fill="#ffffff" stroke="rgb(145, 145, 145)" stroke-width=".5px"/>`
                                + `</svg>`

        selector_value.appendChild(value_name), selector_value.appendChild(arrow_pointer);
        selector.appendChild(selector_value);

        let selector_list_wrap = document.createElement('div');
        selector_list_wrap.classList.add('selector-list-wrap');

        let selector_list = document.createElement('div');
        selector_list.classList.add('selector-list');

        for (var i = 0; i < contents.length; i++) {
            let option = document.createElement('button');
            option.classList.add('selector-option');
            option.setAttribute('value', contents[i].value);
            option.innerHTML = contents[i].value_name;

            selector_list.appendChild(option);
        }

        selector_list_wrap.appendChild(selector_list);
        selector.appendChild(selector_list_wrap);

        let ss_storage = storage_type == 'local' ? local : storage;

        ss_storage.get([key]).then(r => {
            if (r[key]) {
                //selector.setAttribute('value', r[key]);
                value_name.innerHTML = contents.find(v => v.value == r[key])?.value_name ? contents.find(v => v.value == r[key]).value_name : value_name.innerHTML = contents[0].value_name;
            } else {
                //selector.setAttribute('value', contents[0].value);
                value_name.innerHTML = contents[0].value_name;
            }
        });
    }
}
customElements.define('setting-selector', SettingSelect);



// 세팅 텍스트아레아 컴포넌트
class SettingTextarea extends HTMLElement {
    connectedCallback() {
        var value = this.innerHTML;
        this.innerHTML = '';

        const key = this.getAttribute('key');
        const placeholder = this.getAttribute('placeholder');

        let center = document.createElement('div');
        center.classList.add('text-area');

        this.appendChild(center);

        let ta_wrap = document.createElement('div');
        ta_wrap.classList.add('text-area-wrap');

        let ta = document.createElement('textarea');
        ta.placeholder = placeholder;
        ta.name = key;

        const storage_type = this.getAttribute('storage'), ss_storage = storage_type == 'local' ? local : storage;
        ss_storage.get([key]).then(r => typeof r[key] == 'string' ? ta.value = r[key] : (ta.value = value, ss_storage.set({ [key]: value })));

        ta_wrap.appendChild(ta);
        center.appendChild(ta_wrap);

        let tas_wrap = document.createElement('div');
        tas_wrap.classList.add('text-area-submit-wrap');

        let tas = document.createElement('button');
        tas.classList.add('text-area-submit');

        tas_wrap.appendChild(tas);
        center.appendChild(tas_wrap);
    }
}
customElements.define('setting-textarea', SettingTextarea);





//----------------------------------------------------





// 세팅 스위치 크롬 스토리지 상호작용
document.querySelectorAll('.switch').forEach(r => {
    r.addEventListener('click', () => {
        let key = r.parentElement.parentElement.getAttribute('key');

        let storage_type = r.parentElement.parentElement.getAttribute('storage');

        let ss_storage = storage_type == 'local' ? local : storage;

        ss_storage.get([key]).then(s => {
            if (s[key] == true) {
                r.setAttribute('check', 'false');
                ss_storage.set({ [key]: false });
            } else {
                r.setAttribute('check', 'true');
                ss_storage.set({ [key]: true });
            }
        });

        if (key == sync_key) return location.reload();
    });
});



// 세팅 셀렉터 스크립트
    // 세팅 셀럭터 창 열림
document.addEventListener('click', (event) => {
    document.querySelectorAll('.selector-value').forEach(r => {
        let is_click = r.contains(event.target);

        if (!is_click) return r.parentElement.classList.remove('selector-active');

        r.parentElement.classList.toggle('selector-active');
    }); 
});

    // 세팅 셀렉처 창 닫힘
document.addEventListener('keydown', (e) => {
    if (e.key == 'Escape') {
        document.querySelectorAll('.selector-value').forEach(r => {
            r.parentElement.classList.remove('selector-active')
        });
    }
});


    // 세팅 셀럭터 크롬 스토리지 상호작용
document.querySelectorAll('.selector-option').forEach(r => {
    r.addEventListener('click', () => {
        let selector = r.parentElement.parentElement.parentElement;
        let key = selector.parentElement.getAttribute('key');
        let storage_type = selector.parentElement.getAttribute('storage');
        let value = r.getAttribute('value');
        let value_name = r.innerHTML;

        let ss_storage = storage_type == 'local' ? local : storage;

        ss_storage.get([key]).then(() => {
            ss_storage.set({ [key]: value });
            //selector.setAttribute('value', value);
            selector.querySelector('.value-name').innerHTML = value_name;
        });
    });
});



// 세팅 텍스트아레아
document.querySelectorAll('.text-area-submit').forEach(r => {
    r.addEventListener('click', () => {
        const black = 'tas-black', active = 'tas-active';
        if (r.className.includes(black) || r.className.includes(active)) return;

        const setting = r.closest('setting-textarea');
        const key = setting.getAttribute('key');

        const textarea = setting.querySelector('textarea');
        const value = textarea.value;

        const storage_type = setting.getAttribute('storage');
        const ss_storage = storage_type == 'local' ? local : storage;

        ss_storage.get([key]).then(() => {
            ss_storage.set({ [key]: value });
            saveSuccess(r, black, active);
        });
    });
});

function saveSuccess(r, black, active) {
    r.classList.add(black);
    setTimeout(() => {
        r.classList.add(active);
        r.classList.remove(black);
        setTimeout(() => {
            r.classList.add(black);
            setTimeout(() => {
                r.classList.remove(active);
                r.classList.remove(black);
            }, 600);
        }, 1200);
    }, 600);
}





//----------------------------------------------------





(async () => {
    // 버전 기입
    let version;

    await fetch('../manifest.json')
        .then(r => r.json())
        .then(manifest => {
            version = manifest.version;
            document.getElementById('version').textContent = manifest.version;
        });

    // 버전 업데이트 알림
    chrome.storage.local.get([update_key]).then(r => {
        if (!r[update_key]) return;

        /* const banner_wrap = document.createElement('div');
        banner_wrap.id = 'update-banner';
        banner_wrap.classList.add('cleaner');

        const banner = document.createElement('div');
        banner.classList.add('container');

        const what_version = document.createElement('span');
        what_version.textContent = `${version} 버전으로 업데이트 되었습니다!`;

        const what_patch = document.createElement('a');
        what_patch.classList.add('update-button');
        what_patch.href = document.getElementById('patch').href;
        what_patch.target = '_blank';
        what_patch.textContent = '패치노트';

        banner.appendChild(what_version);
        banner.appendChild(what_patch);

        banner_wrap.appendChild(banner);

        document.getElementsByTagName('header')[0].insertAdjacentElement('afterend', banner_wrap);

        setTimeout(() => {
            banner_wrap.classList.add('active');
        }, 10); */
        
        chrome.storage.local.set({ [update_key]: false });
    });
})();
