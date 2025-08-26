let storage = chrome.storage.sync;
const local = chrome.storage.local;
let storage_type = 'sync';

let extension_load = false;
let performance_standard = performance.now();

let routing = false;

local.get([npup.keys.sync]).then(async r => {
    if (!r[npup.keys.sync] && typeof r[npup.keys.sync] != 'boolean')
        local.set({ [npup.keys.sync]: true });
    else if (!r[npup.keys.sync]) {
        storage = local, storage_type = 'local';
        /* ready(); */
    }

    extension_load = true, window.dispatchEvent(new CustomEvent(npup.event.load));
});

local.get([npup.keys.debug, npup.keys.log]).then(r => {
    npup.debug = r[npup.keys.debug];
    /* 
    {
        alert: true,   
        key: true,
        performance: true
    }
    */

    if (r[npup.keys.log]) { 
        npup.log = function() { return; }
        npup.dev = function() { return; }
    }
});



/* let options = {
    r: {}
} */



const { tryChecker, pathChecker, domainChecker, engineChecker, toastAlert, tryFunc } = npup.func;
const observer_setup = npup.settings.observer;









// Base Functions
/**
 * 불러올 요소가 없을 수도 있을 떄 불러오는 걸 감지해서 핸들을 실행시켜주는 함수
 * @param {function} target 감지할 요소
 * @param {function} handler 실행할 함수
 */
function targetHandler(target, handler) {
    if (target()) {
        tryChecker(handler, 'targetHandler -> handler', false);
    } else {
        new MutationObserver((mus, ob) => {
            if (!target()) return; 
            tryChecker(handler, 'targetHandler -> handler', false);
            ob.disconnect();
        }).observe(html, { childList: true });
    }
}

/**
 * 입력한 파일 위치를 사이트 페이지에 삽입합니다
 * @param {string} path 파일 위치
 */
function scriptInjection(path) {
    if (!path) return;

    const id = `${npup.project.prefix.css}${path.split('/').pop()}`;

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(path);
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

let basic_use_system = {
    base: {},
    router: {}
}

/**
 * basically use system about key
 * @param {string} key system key
 * @param {string} r 
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
 * @param {string} engine engine
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

