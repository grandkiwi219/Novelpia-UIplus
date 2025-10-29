const npup = {
    debug: {},

    options: {},

    project: {
        name: 'NPup',
        version: '3.10.2.0',
        get prefix() {
            return {
                css: this.name.toLowerCase() + '-',
                console: this.name.toUpperCase() + `-v${this.version} |`
            }
        },
        get engine() {
            return `${this.name.toLowerCase()}-engine`
        },
        color: '#7632ff',
    },

    keys: {
        sync: 'extension-sync',
        log: 'extension-log',
        debug: 'debug-mode'
    },

    settings: {
        observer: {
            childList: true,
            subtree: true
        },
        console: {
            style: {
                std: `color: black; font-weight: 300;`
            }
        }
    },

    func: {
        resolvePath({ hash = false, search = false } = {}) {
            let current_path = window.location.pathname;
            if (!current_path.endsWith('/')) current_path += '/';
            if (hash) current_path += window.location.hash;
            if (search) current_path += window.location.search;

            return current_path;
        },

        // resolvePath({ hash = false, search = false } = {}) {
        //     let current = {
        //         path: window.location.pathname,
        //         hash: hash ? window.location.hash : undefined,
        //         search: search ? window.location.search : undefined,
        //     }

        //     if (!current.path.endsWith('/')) current_path += '/';

        //     return current;
        // },

        /**
         * 현 주소가 적힌 path인지 확인하는 함수
         * @param {string | array} paths string 혹은 Array 타입의 path(s)를 적어주세요.
         * @param {Object} [options={}]
         * @param {string} [options.target] 비교 대상 변경
         * @param {boolean} [options.strict=false] 동일한 path인지 확인
         * @returns {boolean}
         */
        pathChecker() {},

        /**
         * 현재 도메인 확인 함수
         * @param {string} domain [novel, books, webtoon] || 도메인
         * @returns {boolean}
         */
        domainChecker() {},
        
        /**
         * 간단한 try catch 함수
         * @param {function} func 실행할 함수를 작성하는 곳.
         * @param {string} type 이 함수에게 명명하세요.
         * @param {string | boolean} not_engine 콘텐츠 스크립트의 기본적인 함수인 엔진이 아니라면 무엇이라고 할 것 입니까? 만약 아무것도 아니라면 spacing 해주세요. 코멘트만을 원하면 '' 처리를 해주세요. 콘솔 출력을 하고 싶지 않다면 false를 해주세요.
         * @param  {...any} comment 추가 코멘트 작성.
         */
        tryChecker() {},

        tryFunc() {},

        /**
         * 간단한 현재 시스템 엔진 이름 확인 함수
         * @param {string} name 엔진 이름
         * @returns {boolean}
         */
        engineChecker() {},

        /**
         * 간단한 알림
         * @param {object} [options]
         * @param {string} [options.title] 제목
         * @param {string} [options.msg] 메세지
         * @param {string} [options.type] 알림 타입
         */
        toastAlert() {},
    },

    log(...content) {
        return console.log(this.project.prefix.console, ...content);
    },
    error(...content) {
        return console.error(this.project.prefix.console, ...content);
    },
    warn(...content) {
        return console.warn(this.project.prefix.console, ...content);
    },
    dev(...content) {
        const style = `color: ${this.project.color};`;
        return console.log(`%c${this.project.prefix.console}`, style, ...content);
    },
    trace(content = '노벨피아 UI+ 콘솔 메세지 출력', { titles = [], contents = [] } = {}) {
        const style = `color: ${this.project.color}; font-weight: 300;`;
        console.groupCollapsed(`%c${this.project.prefix.console} %c${content}`, style, this.settings.console.style.std, ...titles );
        console.trace(...contents);
        return console.groupEnd();
    },
    owo(...content) {
        const style = `color: #02c21cff;`;
        return console.log(`%c${this.project.prefix.console}`, style, ...content);
    },
    owu(...content) {
        const style = `color: #ddb500;`;
        return console.log(`%c${this.project.prefix.console}`, style, ...content);
    },
    uwu(...content) {
        const style = `color: #c40000;`;
        return console.log(`%c${this.project.prefix.console}`, style, ...content);
    },

    etc: {
        laze_check_time: 100
    },

    path: null,

    //location: null,
}

npup.event = {
    load: `${npup.project.name}LoadSuccess`,
    router: `${npup.project.name}RouterEnd`,
}










npup.path = npup.func.resolvePath({ hash: true, search: true });

const html = document.documentElement;

window.addEventListener(npup.event.router, () => {
    npup.path = npup.func.resolvePath({ hash: true, search: true });
});











// Base Functions
npup.func.pathChecker = (paths, { target = npup.path, strict = false } = {}) => {
    if (typeof paths == 'string')
        return strict ? target == paths : target.startsWith(paths);
    else if (Array.isArray(paths) && paths.length) {
        let path_check = false;

        for (let i = 0; i < paths.length && !path_check; i++) {
            path_check = strict ? (target == paths[i]) : target.startsWith(paths[i]);
        }
        return path_check;
    } else {
        return false;
    }
}


npup.func.domainChecker = (domain) => {
    const domain_type = {
        base: 'novelpia.com',
        books: 'book.novelpia.com',
        webtoon: 'toptoon.novelpia.com',
        global: 'global.novelpia.com'
    };

    const current_domain = window.location.hostname;

    return current_domain == (domain_type[domain] || domain);
}


npup.func.tryChecker = async (func, type, not_engine, ...comment) => {
    if (typeof func == 'function') {
        let no_console = not_engine === false ? false : true;
        let system_type = '엔진';

        if (not_engine === false) system_type = '함수';
        else if (not_engine) system_type = not_engine;

        let space = ' ';

        if (system_type == ' ') {
            system_type = '', space = '';
        }

        try {
            await func();
            let log = `${type ? type + space + `${system_type}(이)가 ` : ''}실행 중입니다.${npup.debug?.performance ? ` [${performance.now() - performance_standard} ms]` : ''}`;
            if (!no_console) '';
            else if (!comment) npup.log(log);
            else npup.log(log, ...comment);

            return { status: 2, error: '알 수 없음.' };
        } catch (err) {
            npup.error((type ? type + space + `${system_type} `: '') + `오류 발생.\n원인: ${err.stack}`);
            if (npup.debug?.alert) npup.func.toastAlert({
                    title: `오류 발생`,
                    msg: `${type ? type + space + `${system_type} | `: ''}오류 발생\n원인: ${err}`,
                    type: 'error'
                });
            return { status: 3, error: err };
        }
    } else {
        npup.error('엔진을 실행할 수 없습니다.\n원인: 함수가 아닙니다.');
        if (npup.debug?.alert) npup.func.toastAlert({
                    title: `오류 발생`,
                    msg: `${type ? `${type} | `: ''}오류 발생\n원인: 함수가 아닙니다.`,
                    type: 'error'
                });
        return { status: 4, error: '실행할 함수를 찾을 수 없습니다.' };
    }
}


npup.func.tryFunc = (func) => {
    return function(...params) {
        tryChecker(() => {
            func(...params);
        }, '', false);
    }
}


npup.func.engineChecker = (name) => {
    try {
        return STRUCTURE.SYSTEM.ENGINE.name == name ? true: false;
    } catch (e) {
        const engine_el = document.getElementsByTagName(npup.project.engine)[0];

        if (!engine_el) {
            npup.func.toastAlert({ title: '경고', msg: `필수 요소, ${npup.project.engine} 요소가 감지되지 않음`, type: 'error' });
            npup.error(`engineChecker 함수가 ${npup.project.engine} 태그를 지닌 요소를 찾지 못했습니다. 이 경우, 일부 기능이 작동하지 않을 수 있습니다.`);
            return;
        } else if (!engine_el.getAttribute('type')) {
            npup.func.toastAlert({ title: '경고', msg: `필수 요소, ${npup.project.engine} 요소에서 type 속성이 감지되지 않음.`, type: 'error' });
            npup.error(`engineChecker 함수가 ${npup.project.engine} 태그에서 type 속성을 찾지 못했습니다. 이 경우, 일부 기능이 작동하지 않을 수 있습니다.`);
            return;
        }

        const engine_data = engine_el.getAttribute('type').split(' ').filter(r => r);

        if (engine_data?.length)
            return engine_data.includes(name) ? true : false;
        else
            return undefined;
    }
}


npup.func.toastAlert = ({ title = undefined, msg, type = undefined } = {}) => {
    let alert_container = document.getElementById(`${npup.project.prefix.css}alert-container`);

    if (!alert_container) {
        alert_container = document.createElement('div');
        alert_container.id = `${npup.project.prefix.css}alert-container`;
        html.appendChild(alert_container);
    }

    const alert_box = document.createElement('div');
    alert_box.classList.add(`${npup.project.prefix.css}alert-box`);

    if (type) {
        alert_box.classList.add(type);
    }
    else {
        try {
            if (npup.func.domainChecker('base')) {
                if (npup.func.engineChecker('페이지'))
                    alert_box.classList.add('s_inv');
                else
                    if (getCookie('DARKMODE'))
                        alert_box.style.filter = 'invert(1)';
            }
            else if (npup.func.domainChecker('books')) {
                alert_box.classList.add('s_inv');
            }
            else if (npup.func.domainChecker('global')){
                if (document.body?.classList.contains('dark'))
                    Object.assign(alert_box.style, {
                        color: 'white',
                        backgroundColor: 'rgb(23, 23, 23)'
                    });
            }
        }
        catch (e) {
            npup.error('toastAlert 함수의 다크모드 적용이 불가능합니다.', e.stack);
        }
    }

    const alert_countdown = document.createElement('div');
    alert_countdown.classList.add(`${npup.project.prefix.css}alert-countdown`);
    alert_countdown.classList.add('pause');
    alert_countdown.classList.add('once');

    const alert_icon = document.createElement('div');
    alert_icon.classList.add(`${npup.project.prefix.css}alert-icon`);
    
    const alert_icon_head = document.createElement('div');
    alert_icon_head.classList.add(`${npup.project.prefix.css}alert-icon-head`);
    const alert_icon_foot = document.createElement('div');
    alert_icon_foot.classList.add(`${npup.project.prefix.css}alert-icon-foot`);

    alert_icon.appendChild(alert_icon_head);
    alert_icon.appendChild(alert_icon_foot);

    const alert_content = document.createElement('div');
    alert_content.classList.add(`${npup.project.prefix.css}alert-content`);

    if (title) {
        const alert_title = document.createElement('div');
        alert_title.classList.add(`${npup.project.prefix.css}alert-title`);
        alert_title.textContent = title;
        alert_content.appendChild(alert_title);
    }

    if (typeof msg == 'string') msg.split('\n').forEach(m => {
        const alert_msg = document.createElement('div');
        //alert_msg.classList.add(`${npup.project.prefix.css}alert-msg`);
        alert_msg.textContent = m;
        alert_content.appendChild(alert_msg);
    });

    alert_box.appendChild(alert_icon);
    alert_box.appendChild(alert_content);
    alert_box.appendChild(alert_countdown);

    alert_container.insertAdjacentElement('afterbegin', alert_box);

    let alert_time;
    setTimeout(() => {
        alert_box.classList.add(`active`);
        alert_time = setTime(true);

        alert_box.addEventListener('click', () => {
            clearTime(alert_time);
            removeAlert();
        });

        alert_box.addEventListener('mouseover', () => {
            clearTime(alert_time);
        });

        alert_box.addEventListener('mouseout', () => {
            alert_time = setTime();
        });
    }, dom_loaded ? 100 : 400);

    
    function setTime(once = false) {
        if (!once) alert_countdown.classList.remove('once'); 
        alert_countdown.classList.remove('pause');
        return setTimeout(() => {
            removeAlert();
        }, (once ? 4 : 1.6) * 1000 - (once ? 100 : 0));
    }

    function clearTime(func) {
        alert_countdown.classList.add('pause');
        clearTimeout(func);
    }

    function removeAlert() {
        alert_box.classList.remove(`active`);
        setTimeout(() => {
            alert_box.remove();
        }, 0.4 * 1000);
    }
}


function setCookie(name, value, options = {}) {
    const {
        expires = null,
        path = '/',
        domain = '',
        secure = false,
        sameSite = ''
    } = options;

    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
        const date = new Date();
        date.setTime(date.getTime() + (expires * 86400000));
        cookieStr += `; expires=${date.toUTCString()}`;
    }

    if (path) cookieStr += `; path=${path}`;
    if (domain) cookieStr += `; domain=${domain}`;
    if (secure) cookieStr += `; secure`;
    if (sameSite) cookieStr += `; samesite=${sameSite}`;

    document.cookie = cookieStr;
}

function removeCookie(name, options = {}) {
    const {
        path = '/',
        domain = ''
    } = options;

    let cookieStr = `${encodeURIComponent(name)}=null; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    if (path) cookieStr += `; path=${path}`;
    if (domain) cookieStr += `; domain=${domain}`;

    document.cookie = cookieStr;
}

function getCookie(name) {
    const encodedName = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        if (cookie.startsWith(encodedName)) {
            return decodeURIComponent(cookie.slice(encodedName.length));
        }
    }

    return null; // 쿠키가 존재하지 않을 경우
}

function hasCookie(name) {
    const encodedName = encodeURIComponent(name) + "=";
    return document.cookie.split('; ').some(cookie => cookie.startsWith(encodedName));
}

const base_domain = '.novelpia.com';

function toggleCookie(name, domain = base_domain) {
    if (getCookie(name)) {
        removeCookie(name, {path: '/', domain: domain});
        return false;
    } else {
        setCookie(name, 1, { expires: 365, path: '/', domain: domain});
        return true;
    }
}
