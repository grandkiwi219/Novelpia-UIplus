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
        let local_storage = this.getAttribute('local');

        center.className = 'center';
        this.appendChild(center);
        center.appendChild(setting_switch);
        setting_switch.className='switch';

        let ss_storage = local_storage == 'true' ? local : storage;

        ss_storage.get([key]).then(r => {
            r[key] ? setting_switch.setAttribute('check', 'true') : setting_switch.setAttribute('check', 'false');
        });
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
        let local_storage = this.getAttribute('local');

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
                                    + `<path d="M0 3 4 7.2 8 3 0 3" fill="currentColor" stroke="rgb(145, 145, 145)" stroke-width=".5px"/>`
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

        let ss_storage = local_storage == 'true' ? local : storage;

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

        const local_storage = this.getAttribute('local'), ss_storage = local_storage == 'true' ? local : storage;
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



// 세팅 매핑 컴포넌트
class SettingMapping extends HTMLElement {
    connectedCallback() {
        let key = this.getAttribute('key');
        let local_storage = this.getAttribute('local');

        let center = document.createElement('div');
        center.classList.add('center');

        let wrap = document.createElement('div');
        wrap.classList.add('mapping-wrap');

        let input = document.createElement('div');
        Object.assign(input, {
            className: 'mapping',
            tabIndex: "0"
        });

        let cancel = document.createElement('div');
        cancel.classList.add('mapping-cancel');
        cancel.innerHTML = ''
        + `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20" height="20" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round">`
            + `<path d="M5 5 L25 25 M5 25 L25 5" />`
        + `</svg>`;

        wrap.appendChild(input);
        wrap.appendChild(cancel);

        center.appendChild(wrap);
        this.appendChild(center);

        let ss_storage = local_storage == 'true' ? local : storage;

        ss_storage.get([key]).then(r => {
            if (r[key] && (r[key].code || r[key].key)) {
                input.textContent = wordMapping(r[key]);
            } else {
                input.innerHTML = `<div class="mapping-nothing">설정 필요</div>`;
            }
        });
    }
}
customElements.define('setting-mapping', SettingMapping);
