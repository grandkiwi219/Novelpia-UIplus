// 기본 토대
class SettingBase extends HTMLElement {
    key = this.getAttribute('key');
    get storage() {
        switch (this.getAttribute('storage')) {
            case 'local':
                return { cache: local, type: 'local' };
            default:
                return { cache: storage, type: 'sync' };
        }
    }
    
    connectedCallback() {
        this.appendChild(this.generateElement());
        this.useStorage();
        this.setEvent();
    }

    generateElement() {
        return document.createElement('div');
    }

    useStorage() {
        return;
    }

    setEvent() {
        return;
    }
}



// 세팅 스위치 컴포넌트
class SettingSwitch extends SettingBase {
    remove_data = true;

    center = document.createElement('div');
    setting_switch = document.createElement('button');

    generateElement() {
        this.center.className = 'center';
        this.center.appendChild(this.setting_switch);
        this.setting_switch.className = 'switch';

        return this.center;
    }

    useStorage() {
        this.storage.cache.get([this.key]).then(r => {
            r[this.key] ? this.setting_switch.setAttribute('check', 'true') : this.setting_switch.setAttribute('check', 'false');
        });
    }

    setEvent() {
        this.addEventListener('click', async () => {
            const data = await this.storage.cache.get([this.key]);

            if (data[this.key]) {
                this.setting_switch.setAttribute('check', 'false');

                if (this.remove_data)
                    await this.storage.cache.remove([this.key]);
                else
                    await this.storage.cache.set({ [this.key]: 0 });
            } else {
                this.setting_switch.setAttribute('check', 'true');
                await this.storage.cache.set({ [this.key]: 1 });
            }

            try {
                this.addEvent();
            } catch (e) {
                console.error(e.stack);
            }
        });
    }

    addEvent() {
        return;
    }
}
insertSettingData('switch', SettingSwitch);



class SettingSwitchSync extends SettingSwitch {
    remove_data = false;

    addEvent() {
        location.reload()
    }
}
insertSettingData('switch-sync', SettingSwitchSync);



// 세팅 셀렉트 컴포넌트
class SettingSelector extends SettingBase {
    remove_data = true;

    contents = this.innerHTML.split('|').filter(r => r.trim() != "").map(r => {
            let splitContent = r.replace('}', '').split('{');
            return { value: splitContent[1].trim(), value_name: splitContent[0].trim() };
        });

    selector = document.createElement('div');
    selector_value = document.createElement('button');
    value_name = document.createElement('div');
    arrow_pointer = document.createElement('div');
    selector_list_wrap = document.createElement('div');
    selector_list = document.createElement('div');

    generateElement() {
        this.innerHTML = '';

        this.selector.classList.add('selector');
        if (this.getAttribute('type')?.trim() == 'long') this.selector.classList.add('long-form');

        this.selector_value.classList.add('selector-value');

        this.value_name.classList.add('value-name');

        this.arrow_pointer.innerHTML = ''
            +`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2 14 14">`
                + `<path d="M0 3 4 7.2 8 3 0 3" fill="currentColor" stroke="rgb(145, 145, 145)" stroke-width=".5px"/>`
            + `</svg>`;

        this.selector_value.appendChild(this.value_name)
        this.selector_value.appendChild(this.arrow_pointer);

        this.selector.appendChild(this.selector_value);

        this.selector_list_wrap.classList.add('selector-list-wrap');
 
        this.selector_list.classList.add('selector-list');

        this.contents.forEach((v) => {
            let option = document.createElement('button');
            option.classList.add('selector-option');
            option.setAttribute('value', v.value);
            option.innerHTML = v.value_name;

            this.selector_list.appendChild(option);
        });

        this.selector_list_wrap.appendChild(this.selector_list);
        this.selector.appendChild(this.selector_list_wrap);

        return this.selector;
    }

    useStorage() {
        this.storage.cache.get([this.key]).then(r => {
            if (r[this.key]) {
                //selector.setAttribute('value', r[this.key]);
                this.value_name.innerHTML = this.contents.find(v => v.value == r[this.key])?.value_name ? this.contents.find(v => v.value == r[this.key]).value_name : this.value_name.innerHTML = this.contents[0].value_name;
            } else {
                //selector.setAttribute('value', this.contents[0].value);
                this.value_name.innerHTML = this.contents[0].value_name;
            }
        });
    }

    setEvent() {
        // 세팅 셀렉터 창 열림은 event-binding.js 에서

        // 세팅 셀렉터 창 닫힘
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') {
                this.selector.classList.remove('selector-active');
            }
        });


        // 세팅 셀럭터 크롬 스토리지 상호작용
        this.querySelectorAll('.selector-option').forEach(r => {
            r.addEventListener('click', () => {
                let value = r.getAttribute('value');
                let value_name = r.innerHTML;

                this.storage.cache.get([this.key]).then(() => {
                    if (value == this.contents[0].value && this.remove_data) 
                        this.storage.cache.remove([this.key]);
                    else
                        this.storage.cache.set({ [this.key]: value });
                    //selector.setAttribute('value', value);
                    this.selector.querySelector('.value-name').innerHTML = value_name;
                });
            });
        });
    }
}
insertSettingData('selector', SettingSelector);



// 세팅 텍스트아레아 컴포넌트
class SettingTextarea extends SettingBase {
    value = this.innerHTML;
    placeholder = this.getAttribute('placeholder');

    center = document.createElement('div');
    ta_wrap = document.createElement('div');
    ta = document.createElement('textarea');

    tas_wrap = document.createElement('div');
    tas = document.createElement('button');

    black = 'tas-black';
    active = 'tas-active';

    generateElement() {
        this.innerHTML = '';

        this.center.classList.add('text-area');

        this.ta_wrap.classList.add('text-area-wrap');

        this.ta.placeholder = this.placeholder;
        this.ta.name = this.key;

        this.ta_wrap.appendChild(this.ta);
        this.center.appendChild(this.ta_wrap);
        
        this.tas_wrap.classList.add('text-area-submit-wrap');
        
        this.tas.classList.add('text-area-submit');
        
        this.tas_wrap.appendChild(this.tas);
        this.center.appendChild(this.tas_wrap);
        
        return this.center;
    }

    useStorage() {
        this.storage.cache.get([this.key])
        .then(r =>
            typeof r[this.key] == 'string' ?
            this.ta.value = r[this.key] : ( this.ta.value = this.value, this.storage.cache.set({ [this.key]: this.value }) )
        );
    }

    setEvent() {
        this.tas.addEventListener('click', () => {
            if (this.tas.className.includes(this.black) || this.tas.className.includes(this.active)) return;

            const value = this.ta.value;

            this.storage.cache.get([this.key]).then(() => {
                this.storage.cache.set({ [this.key]: value });
                saveSuccess();
            });
        });

        const saveSuccess = () => {
            this.tas.classList.add(this.black);
            setTimeout(() => {
                this.tas.classList.add(this.active);
                this.tas.classList.remove(this.black);
                setTimeout(() => {
                    this.tas.classList.add(this.black);
                    setTimeout(() => {
                        this.tas.classList.remove(this.active);
                        this.tas.classList.remove(this.black);
                    }, 600);
                }, 1200);
            }, 600);
        }
    }
}
insertSettingData('textarea', SettingTextarea);



// 세팅 매핑 컴포넌트
class SettingMapping extends SettingBase {
    center = document.createElement('div');
    wrap = document.createElement('div');
    input = document.createElement('div');
    cancel = document.createElement('div');

    nothing = 'mapping-nothing';

    generateElement() {
        this.center.classList.add('center');

        this.wrap.classList.add('mapping-wrap');

        Object.assign(this.input, {
            className: 'mapping',
            tabIndex: "0"
        });

        this.cancel.classList.add('mapping-cancel');
        this.cancel.innerHTML = ''
            + `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20" height="20" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round">`
                + `<path d="M5 5 L25 25 M5 25 L25 5" />`
            + `</svg>`;

        this.wrap.appendChild(this.input);
        this.wrap.appendChild(this.cancel);

        this.center.appendChild(this.wrap);

        return this.center;
    }

    useStorage() {
        this.storage.cache.get([this.key]).then(r => {
            if (r[this.key] && (r[this.key].code || r[this.key].key)) {
                this.setMapping(r[this.key]);
            } else {
                this.setNothing();
            }
        });
    }

    setEvent() {
        document.addEventListener('keydown', async e => {
            if (!this.contains(e.target)) return;

            e.preventDefault();

            await this.storage.cache.get([this.key]).then(() => {
                this.storage.cache.set({ [this.key]: { code: e.code, key: e.key } });
            });

            this.setMapping(e);
        });

        this.cancel.addEventListener('click', async e => {
            await this.storage.cache.get([this.key]).then(() => {
                this.storage.cache.remove([this.key]);
            });

            this.setNothing();
        });
    }

    setMapping(text = null) {
        this.input.classList.remove(this.nothing);
        this.input.textContent = wordMapping(text);
    }

    setNothing() {
        this.input.classList.add(this.nothing);
        this.input.textContent = '설정 필요';
    }
}
insertSettingData('mapping', SettingMapping);
