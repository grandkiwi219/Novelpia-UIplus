// comfortable asset



/**
 * 불러올 요소가 없을 수도 있을 떄 불러오는 걸 감지해서 핸들을 실행시켜주는 함수
 * @param {function} target 감지할 요소
 * @param {function} handler 실행할 함수
 * @param {Object} [setup={}] 
 * @param {number} setup.redetect 재탐지할 횟수
 * @param {number} setup.duration 탐지할 시간, 이때 재탐지 횟수가 1회 이하일시 standard_duration[=8*1000]으로 고정
 * @param {*} setup.method 0 = 기본적으로 작동, * = 기본적으로 탐지함
 */
function targetHandler(targetFinder, handler, {
    redetect = 0,
    duration = NaN,
    method = 0
} = {}) {
    const standard_duration = 8 * 1000;

    if (!duration && duration !== 0)
        duration = standard_duration;

    let target = targetFinder();
    if (target && method == 0) {
        tryChecker(() => handler(target), 'targetHandler -> handler', false);
    }
    else {
        let target_found = false;

        const targetOb = new MutationObserver((mus, ob) => {
            let target = targetFinder();
            if (!target) return; 
            target_found = true;
            tryChecker(() => handler(target), 'targetHandler -> handler', false);
            ob.disconnect();
        });
        targetOb.observe(document.documentElement, { childList: true, subtree: true });

        setTimeout(() => {
            if (!target_found) {
                targetOb.disconnect();
                if (redetect > 0) {
                    targetHandler(targetFinder, handler, {
                        redetect: redetect - 1,
                        duration: redetect < 2 ? standard_duration : Math.min(duration + 1 * 1000, standard_duration)
                    });
                    npup.trace(`타겟을 찾지 못하였습니다. 재탐지를 시작합니다.`);
                }
                else {
                    npup.trace(`타겟을 찾는 데에 시간이 오래 걸려 함수 실행을 취소했습니다.`);
                }
            }
        }, duration);
    }
}



/**
 * 입력한 파일 위치를 사이트 페이지에 삽입합니다
 * @param {string} path 파일 위치
 */
async function scriptInjection(path) {
    if (!path) return;

    const id = `${npup.project.prefix.css}${path.split('/').pop()}`;

    const script = document.createElement('script');
    try {
        script.src = chrome.runtime.getURL(path);
    } catch (error) {
        toastAlert({ title: '새로고침 필요', msg: '확장프로그램과의 연결이 끊겼습니다.\n새로고침이 필요합니다.', type: 'error' });
    }
    script.id = id;

    if (document.getElementById(id))
        document.getElementById(id).remove();

    document.head.appendChild(script);

    return script;
}



/**
 * 헤드에 스타일 태그를 삽입합니다.
 * @param {string} id 스타일 태그르 정의할 아이디
 * @param {string} content css 입력
 * @returns 
 */
function styleInjection(id, content) {
    if (!id) return;

    const style = document.createElement('style');
    style.id = id;
    if (content) style.textContent = content;

    if (document.getElementById(id))
        document.getElementById(id).remove();

    document.head.appendChild(style);

    return style;
}



/**
 * Element Substitution Render
 * @param {InsertPosition | HTMLElement} where 
 * @param {HTMLElement | string} [element] 
 * @param {object} [options]
 * @param {string[]} [options.exclude_class]
 */
HTMLElement.prototype.esrender = function(where, element, { exclude_class = [] } = {}) {
    if (where instanceof HTMLElement) {
        element = where;
        where = 'beforeend';
    }
    else if (typeof where != 'string') {
        throw new Error('지명할 방식은 문자열 타입이여야 합니다.');
    }
    else if (!['beforebegin', 'afterbegin', 'beforeend', 'afterend'].includes(where)) {
        throw new Error('지명할 방식이 알맞지 않습니다.');
    }
    else if (!element) {
        throw new Error('위치 지정시 요소가 존재하여야 합니다.');
    }

    const is_HTMLElement = (element instanceof HTMLElement);
    const is_string = (typeof element == 'string');

    if (!is_HTMLElement && !is_string) 
        throw new Error('요소는 HTMLElement 혹은 문자열이여야 합니다.');

    let early_exist_el = null;

    if (is_HTMLElement) {
        early_exist_el = document.getElementById(element.id);
        if (!early_exist_el && element.classList.length > 0) {
            const doc = (where == 'beforeend' || where == 'afterbegin')
                ? this
                : this.parentElement;
            if (doc) {
                if (!Array.isArray(exclude_class)) {
                    exclude_class = typeof exclude_class == 'string'
                        ? [exclude_class]
                        : [];
                }

                const exclude_class_set = new Set(exclude_class);

                const filtered_class = [...element.classList].filter(cl => !exclude_class_set.has(cl));

                if (filtered_class.length > 0) {
                    early_exist_el = doc.querySelector('.' + filtered_class.join('.'));
                }
            }
        }
    }

    if (early_exist_el && early_exist_el !== element) {
        early_exist_el.replaceWith(element);
    }
    else {
        if (is_HTMLElement) {
            this.insertAdjacentElement(where, element);
        }
        else {
            this.insertAdjacentHTML(where, element);
        }
    }
}



/**
 * 함수 내에서 지연하기 위한 간단한 함수
 * @param {number} time 지연 시간
 */
async function setDelay(time) {
    return await new Promise(r => setTimeout(r, time));
}



/**
 * 상단에서부터 살짝 내려온 뒤 위로 튕기는 애니메이션을 지닌 아이콘을 보이는 함수
 * @param {function(on: boolean)} iconFunc 꺼져 있는 아이콘과 켜져 있는 아이콘을 출력시킬 수 있는 함수
 * @param {boolean} already 아이콘의 상태가 켜져있어야 하는가
 */
async function showIcon(
    iconFunc = (on = false) => '//images.novelpia.com/img/new/header/icon_alert.svg',
    already = false
) {
    const vote = document.createElement('div');
    //vote.classList.add('content_memo');

    const vote_icon = document.createElement('img');
    vote_icon.src = already ? iconFunc(true) : iconFunc();
    vote_icon.classList.add('npup-show-icon');

    vote.appendChild(vote_icon);
    document.body.appendChild(vote);

    await setDelay(100);
    vote_icon.classList.add('show');
    vote_icon.classList.add('down');
    await setDelay(400);
    if (!already) vote_icon.src = iconFunc(true);
    vote_icon.classList.add('up');
    await setDelay(400);
    vote_icon.classList.remove('show');
    await setDelay(200);
    vote.remove();

    return true;
}



/**
 * 
 * @param {HTMLElement} el 목록 아이콘을 삽입할 HTML 요소
 * @param {Object} [options] 
 * @param {string} [options.width] 길이 
 * @param {string} [options.height] 높이
 * @param {string} [options.viewBox] 뷰박스 
 * @param {string} [options.color] 색상
 */
function setListIcon(el, {
    width = '24',
    height = '24',
    viewBox = '0 0 24 24',
    color = 'currentColor'
} = {}) {
    el.innerHTML = ``
        + `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0${viewBox}">`
            + `<circle cx="4" cy="6" r="1.5" fill="${color}" />`
            + `<rect x="7" y="5" width="13" height="2" rx="1" fill="${color}" />`

            + `<circle cx="4" cy="12" r="1.5" fill="${color}" />`
            + `<rect x="7" y="11" width="13" height="2" rx="1" fill="${color}" />`

            + `<circle cx="4" cy="18" r="1.5" fill="${color}" />`
            + `<rect x="7" y="17" width="13" height="2" rx="1" fill="${color}" />`
        + `</svg>`;
}



// system duple usage asset



let basic_use_system = {
    base: {},
    router: {}
}

/**
 * basically use system about key
 * @param {string} key system key
 * @param {string} r chrome storage result
 */
function basicUseSystem(key, r, ...settings) {
    if (!r[key] && !basic_use_system.base[key] && !basic_use_system.router[key]) {
        const system = searchSystem(key);
        if (system.router) basic_use_system.router[key] = true;
        else basic_use_system.base[key] = true;
        system.system(r, ...settings);
    }
}

/**
 * search system about key
 * @param {string} key system key
 * @param {string} [engine] engine
 */
function searchSystem(key, engine = 'system') {
    if (!key || typeof key != 'string') {
        const msg = '키 값이 없거나 문자열 형식이 아닙니다.';
        toastAlert({
            title: `오류 발생`,
            msg: msg,
            type: 'error'
        })
        return npup.error(msg);
    }
    const data = STRUCTURE[engine.toUpperCase().replace('-', '_')].ENGINE.getSystemStructure(key);
    if (!data.key) {
        const msg = '옵션을 찾을 수 없는 키 값 입니다.';
        toastAlert({
            title: `오류 발생`,
            msg: msg,
            type: 'error'
        })
        return npup.error(msg);
    }
    return data;
}



// system asset



/**
 * keyMappingBase의 뷰어 조건
 */
const isViewer = { condition: () => engineChecker('뷰어') }



/**
 * '키 맵핑을 위한 기본적인 토대가 되는 함수'를 뱉어내는 함수
 * @param {function} callback 특정 키 입력시 작동되게 하는 함수
 * @param {Object} [options]
 * @param {function} [options.condition] 설정한 조건에 만족해야만 작동
 * @param {function} [options.execution] 함수가 로드될 때 실행될 함수
 * @returns {function} 키 맵핑을 위한 기본적인 토대가 되는 함수
 */
function keyMappingBase(callback, { condition = () => true, execution = () => undefined } = {}) {
    return async function(r, settings = { quick_mapping_menu: false }) {
        if (settings.quick_mapping_menu) {
            if (!condition()) return;

            const result = await Promise.all([
                tryChecker(() => {
                    callback(r);
                }, `<keyMappingBase - quick-mapping-menu> ${this.key}`, false)
            ]);

            if (result[0].status > 2) toastAlert({
                    title: `오류 발생 | ${this.key}`,
                    msg: `'${this.description}' 기능 오류\n원인: ${result.error}`,
                    type: 'error'
                });
            return;
        }

        const keydownEvent = async (e) => {
            if (!condition()) return;

            const active = document.activeElement;

            if (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable
            ) return;

            const key_match = e.code != r[this.key].code && e.key != r[this.key].key;
            if (
                (key_match) ||
                (!key_match && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey))
            ) return

            e.preventDefault();

            const result = await Promise.all([
                tryChecker(() => {
                    callback(r);
                }, `<keyMappingBase> ${this.key}`, false)
            ]);

            if (result[0].status > 2) toastAlert({
                    title: `오류 발생 | ${this.key}`,
                    msg: `'${this.description}' 기능 오류\n원인: ${result.error}`,
                    type: 'error'
                });
        }
        
        document.addEventListener('keydown', keydownEvent);

        removeEventForEngine(() => {
            document.removeEventListener('keydown', keydownEvent);
        });

        execution();
    }
}



/* !keyMappingCa! */
/**
 * quick mapping menu system 함수를 출력
 * @param {function} engineCallback 각 엔진 별 취할 액션
 * @returns quickMappingMenuSystem
 */
function quickMappingMenuAsset(engineCallback = () => false) {
    return async function (r) {
        const qmm = `${npup.project.prefix.css}qmm`;

        const menu_base = document.createElement('div');
        menu_base.classList.add(`${qmm}-base`);

        const menu_wrap = document.createElement('div');
        menu_wrap.classList.add(`${qmm}-wrap`);

        const menu_btn = document.createElement('div');
        Object.assign(menu_btn, {
            className: `${qmm} ${qmm}-icon`,
        });
        const list_color = 'black';
        menu_btn.innerHTML = ``
            + `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">`
            + `<circle cx="4" cy="6" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="5" width="13" height="2" rx="1" fill="${list_color}" />`

            + `<circle cx="4" cy="12" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="11" width="13" height="2" rx="1" fill="${list_color}" />`

            + `<circle cx="4" cy="18" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="17" width="13" height="2" rx="1" fill="${list_color}" />`
            + `</svg>`;

        const menu_menu = document.createElement('div');
        menu_menu.classList.add(`${qmm}-menu`);

        const menu_content = document.createElement('div');
        menu_content.classList.add(`${qmm}-menu-content`);

        const menu_cancel = document.createElement('div');
        menu_cancel.classList.add(`${qmm}-menu-cancel`);
        menu_cancel.innerHTML = ''
            + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20" height="20" stroke-width="2" stroke="#000" fill="none" stroke-linecap="round">'
            + '<path d="M5 5 L25 25 M5 25 L25 5" />'
            + '</svg>';

        Object.values(keyMappingCa).forEach(async op => {
            if (!op.tag?.quick_mapping_menu) return;

            /* if (op.key == 'move-mb' && engineChecker('페이지')) {
                if (storage_type = 'sync') {
                    const ob = await storage.get(['origin-header', 'bottom-nav']);
                    if (ob['origin-header'] || ob['bottom-nav'])
                        return;
                }
                else if (r['origin-header'] || r['bottom-nav'])
                    return;
            } */

            const menu_touch = document.createElement('div');
            menu_touch.classList.add(`${qmm}-touch`);
            menu_touch.classList.add(`${qmm}-icon`);
            menu_touch.textContent = op.desc;
            menu_touch.setAttribute('value', op.key);
            menu_content.appendChild(menu_touch);
        });

        menu_menu.innerHTML = '' +
            `<div class="npup-selector">
    <div class="npup-selector-value">
        <div class="npup-value-name">${keyMappingCa[this.key].values.find(v => v.value == r[this.key])?.name}</div>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2 14 14">
                <path d="M0 3 4 7.2 8 3 0 3" fill="black" stroke="rgb(145, 145, 145)" stroke-width=".5px" />
            </svg>
        </div>
    </div>
    <div class="npup-selector-list-wrap">
        <div class="npup-selector-list">
            ${keyMappingCa[this.key].values.map(v => {
                return `<div class="npup-selector-option" value="${v.value}">${v.name}</div>`;
            }).join('')}
        </div>
    </div>
</div>`;

        menu_menu.appendChild(menu_cancel);
        menu_menu.appendChild(menu_content);

        menu_wrap.appendChild(menu_btn);
        menu_base.appendChild(menu_wrap);
        menu_base.appendChild(menu_menu);

        const comic_viewer = pathChecker('/comic_viewer/') && domainChecker('base');

        const result = await Promise.all([
                tryChecker(async () => {
                    await engineCallback(r, menu_base, comic_viewer);
                }, `<keyMappingBase - quick-mapping-menu> ${this.key}`, false)
            ]);
        
        if (!result[0]?.status > 2) return;


        // 열림 닫힘
        let click_el_data = undefined;
        let click_el_cancel_data = undefined;

        const menuControl = (e) => {
            if (comic_viewer) {
                const base = document.getElementsByClassName(`${qmm}-base`)[0];

                if (!base) return;

                if (!click_el_data)
                    click_el_data = [...document.getElementsByClassName(`${qmm}-menu`), ...document.getElementsByClassName(`${qmm}`)];

                if (base.classList.contains('focus')) {
                    if (!click_el_cancel_data)
                        click_el_cancel_data = document.getElementsByClassName(`${qmm}-menu-cancel`);

                    let cancel = false;
                    for (let i = 0; i < click_el_cancel_data.length; i++)
                        if (click_el_cancel_data[i].contains(e.target)) {
                            base.classList.remove(`focus`);
                            cancel = true;
                            break;
                        }

                    if (!cancel) {
                        let check = false;
                        for (let i = 0; i < click_el_data.length; i++)
                            if (click_el_data[i].contains(e.target)) {
                                check = true;
                                break;
                            }

                        if (!check) base.classList.remove(`focus`);
                    }
                }
                else {
                    for (let i = 0; i < click_el_data.length; i++)
                        if (click_el_data[i].contains(e.target)) {
                            base.classList.add(`focus`);
                            break;
                        }
                }

                return;
            }

            if ((!menu_btn.contains(e.target) && !menu_menu.contains(e.target)) || menu_cancel.contains(e.target))
                return menu_base.classList.remove(`focus`);

            menu_base.classList.add(`focus`);
        }

        // 이벤트 실행
        const executeEvent = (e) => {
            const menu_touches = document.getElementsByClassName(`${qmm}-touch`);
            for (let i = 0; i < menu_touches.length; i++) {
                if (menu_touches[i].contains(e.target))
                    return searchSystem(menu_touches[i].getAttribute('value'), 'common').system(r, { quick_mapping_menu: true });
            }
        }

        // 닫음
        const menuEsc = (e) => {
            if (e.key == 'Escape') {
                if (!comic_viewer) menu_base.classList.remove(`focus`);
                else document.getElementsByClassName(`${qmm}-base`)[0].classList.remove('focus');

                document.querySelectorAll(`.${npup.project.prefix.css}selector-value`).forEach(r => {
                    r.parentElement.classList.remove(`${npup.project.prefix.css}selector-active`);
                });
            }
        }

        // 세팅 셀럭터 창 열림
        const openSelector = (e) => {
            document.querySelectorAll(`.${npup.project.prefix.css}selector-value`).forEach(r => {
                let is_click = r.contains(e.target);

                if (!is_click) return r.parentElement.classList.remove(`${npup.project.prefix.css}selector-active`);

                r.parentElement.classList.toggle(`${npup.project.prefix.css}selector-active`);
            });
        }

        // 세팅 셀럭터 크롬 스토리지 상호작용
        const interactionSelector = (e) => {
            document.querySelectorAll(`.${npup.project.prefix.css}selector-option`).forEach(r => {
                if (!r.contains(e.target)) return;

                let this_storage = this.settings?.storage;
                let value = r.getAttribute('value');

                if (value == this.options[0]) {
                    if (!comic_viewer) menu_base.remove();
                    else document.getElementsByClassName(`${qmm}-base`)[0].remove();
                }

                let value_name = r.innerHTML;

                let cache;

                switch (this_storage) {
                    case 'local':
                        cache = local;
                        break;
                    default: 
                        cache = storage;
                        break;
                }

                cache.get([this.key]).then(() => {
                    cache.set({ [this.key]: value });
                    html.setAttribute(`${npup.project.prefix.css}${this.key}`, value);
                    menu_base.querySelector(`.${npup.project.prefix.css}value-name`).innerHTML = value_name;
                });
            });
        }

        const clickEvent = (e) => {
            menuControl(e);
            executeEvent(e);
            openSelector(e);
            interactionSelector(e);
        }

        document.addEventListener('click', clickEvent);
        document.addEventListener('keydown', menuEsc);

        removeEventForEngine(() => {
            menu_base.remove();
            document.removeEventListener('click', clickEvent);
            document.removeEventListener('keydown', menuEsc);
        });
    }
}



/**
 * custom css system 함수를 출력
 * @returns customCssSystem
 */
function customCssAsset() {
    return function (r) {
        const id = `${npup.project.prefix.css}${this.key}`;

        const style = document.createElement('style');
        style.id = id;
        style.textContent = r[this.key];

        if (document.getElementById(id))
            document.getElementById(id).remove();

        tryChecker(() => {
            document.head.appendChild(style);
        }, '커스텀', 'css', style);
    }
}



/**
 * 페이지 제목 가공
 * @param {*} result chrome storage 결과값에 키 값을 대입한 결과
 * @returns {string} 페이지 제목 가공값
 */
function webTitleAsset(result) {
    //노벨피아 - 웹소설로 꿈꾸는 세상! - PAGE
    let title_result = document.title;
    let tc = document.title.split('-').map(t => t);
    let tc2af = tc.slice(2).join('-').trim();

    //normal/short/reverse-short/single/reverse-normal
    switch (result) {
        case 'short':
            title_result = tc[0].trim() + (tc2af ? ` - ${tc2af}` : '');
            break;
        case 'reverse-short':
            title_result = (tc2af ? `${tc2af} - ` : '') + tc[0].trim();
            break;
        case 'single':
            title_result = tc2af ? tc2af : tc[0].trim();
            break;
        case 'reverse-normal':
            title_result = (tc2af ? `${tc2af} - ` : '') + tc[0].trim() + ' - ' + tc[1].trim();
            break;
    }

    return title_result;
}
