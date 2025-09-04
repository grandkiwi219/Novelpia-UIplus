/**
 * 불러올 요소가 없을 수도 있을 떄 불러오는 걸 감지해서 핸들을 실행시켜주는 함수
 * @param {function} target 감지할 요소
 * @param {function} handler 실행할 함수
 */
function targetHandler(target, handler) {
    if (target()) {
        tryChecker(() => handler(), 'targetHandler -> handler', false);
    } else {
        let target_found = false;

        const targetOb = new MutationObserver((mus, ob) => {
            if (!target()) return; 
            target_found = true;
            tryChecker(() => handler(), 'targetHandler -> handler', false);
            ob.disconnect();
        });
        targetOb.observe(html, { childList: true });

        setTimeout(() => {
            if (!target_found) {
                targetOb.disconnect();
                npup.warn(`타겟을 찾는 데에 시간이 오래 걸려 함수 실행을 취소했습니다.`);
            }
        }, 8 * 1000);
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

/**
 * '키 맵핑을 위한 기본적인 토대가 되는 함수'를 뱉어내는 함수
 * @param {function} callback 특정 키 입력시 작동되게 하는 함수
 * @param {Object} param1 { condition, execution }
 * @returns {function} 키 맵핑을 위한 기본적인 토대가 되는 함수
 */
function keyMappingBase(callback, { condition = () => { return true; }, execution = () => {} } = {}) {
    return async function(r, settings = { quick_mapping_menu: false }) {
        if (settings.quick_mapping_menu) {
            if (!condition()) return;

            const result = await Promise.all([
                tryChecker(() => {
                    callback(r);
                }, `<keyMappingBase - quick-mapping-menu> ${this.key}`, false)
            ]);

            if (result[0].status != 2) toastAlert({
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

            if (result[0].status != 2) toastAlert({
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
