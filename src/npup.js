const npup = {
    debug: undefined,

    options: {},

    project: {
        name: 'NPup',
        version: '3',
        get prefix() {
            return {
                css: this.name.toLowerCase() + '-',
                console: this.name.toUpperCase() + `-v${this.version} |`
            }
        },
        color: '#7632ff'
    },

    keys: {
        sync: 'extension-sync'
    },

    settings: {
        observer: {
            childList: true,
            subtree: true
        }
    },

    func: {
        /**
         * 현 주소가 적힌 path인지 확인하는 함수
         * @param {any} paths string 혹은 Array 타입의 path(s)를 적어주세요.
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
         * @param {*} name 엔진 이름
         * @returns {boolean}
         */
        engineChecker() {},

        /**
         * 간단한 알림
         * @param {string} title 제목
         * @param {string} msg 메세지
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

    etc: {
        hf: 'high-performance',
        laze_check_time: 100
    },
    
}










let path = window.location.pathname + window.location.search;
const html = document.getElementsByTagName('html')[0];

new MutationObserver(() => {
    let current_path = window.location.pathname + window.location.search;

    if (path == current_path) return;
    else path = current_path;

}).observe(html, { ...npup.settings.observer_setup, attributes: true, characterData: true }); 










// Base Functions
npup.func.pathChecker = (paths) => {
    if (typeof paths == 'string')
        return path.startsWith(paths);
    else if (Array.isArray(paths)) {
        var path_check = false;

        for (var i = 0; i < paths.length && !path_check; i++) {
            path_check = path.startsWith(paths[i]);
        }
        return path_check;
    } else {
        npup.warn('경로 형식을 알 수 없습니다.')
        return false;
    }
}


npup.func.domainChecker = (domain) => {
    const domain_type = {
        novel: 'novelpia.com',
        books: 'book.novelpia.com',
        webtoon: 'toptoon.novelpia.com'
    };

    const current_domain = window.location.hostname;

    return current_domain == domain_type[domain] || domain;
}


npup.func.tryChecker = (func, type, not_engine, ...comment) => {
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
            func();
            let log = (type ? type + space + `${system_type}(이)가 ` : '') + '실행 중입니다.';
            if (!no_console) '';
            else if (!comment) npup.log(log);
            else npup.log(log, ...comment);

            return { status: 2, error: undefined };
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
                    msg: `${type ? type + space + `${system_type} | `: ''}오류 발생\n원인: ${err}`,
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
    if (!STRUCTURE) return undefined;
    return STRUCTURE.SYSTEM.ENGINE.name == name ? true: false;
}


npup.func.toastAlert = ({ title = undefined, msg, type = undefined }) => {
    let alert_container = document.getElementById(`${npup.project.prefix.css}alert-container`);

    if (!alert_container) {
        alert_container = document.createElement('div');
        alert_container.id = `${npup.project.prefix.css}alert-container`;
        alert_container.className = 's_inv';
        document.body.appendChild(alert_container);
    }

    const alert_box = document.createElement('div');
    alert_box.classList.add(`${npup.project.prefix.css}alert-box`);

    if (type) {
        alert_box.classList.add(type);
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

    msg.split('\n').forEach(m => {
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
    }, 100);

    
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
