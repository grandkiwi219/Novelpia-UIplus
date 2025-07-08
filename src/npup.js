const npup = {
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
        tryChecker() {}
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
    }
    
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
    } else
        return false;
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
            if (!no_console) return;
            else if (!comment) return npup.log(log);
            else return npup.log(log, ...comment);
        } catch (err) {
            return npup.error((type ? type + space + `${system_type} `: '') + `오류 발생.\n원인: ${err}`);
        }
    } else return npup.error('엔진을 실행할 수 없습니다.\n원인: 함수가 아닙니다.');
}
