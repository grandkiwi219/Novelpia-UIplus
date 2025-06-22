// --- initial setup ---    

/**
 * --- header ---
 * 
 * adult: 성인 버튼 헤더로 옮기기
 * 
 * b-w: 북스 | 웹툰 퀵 메뉴 삭제 [normal/books/webtoon/true]
 * 
 * search: 서치바 축소 & 반응형으로 클릭 이벤트 시 확대
 * 
 * search-result: 서치바 밑에 최근 검색 기록
 * 
 * alarm: 알람 위치 변경 [comment/novel/comic/system/event]
 * 
 * --- navigation ---
 * 
 * nav-align: 내비게이션 메뉴 정렬 방식 [left/left-less/center/right-less/right]
 * 
 * nav-mybook: 내서재 다이렉트 위치 [normal/last/alram]
 * 
 * nav: 네비게이션 바 삭제 & 퀵 메뉴 헤더로 옮기기
 * 
 * --- novel page ---
 * 
 * novel-page: 페이지 이동 상단 추가 
 * 
 * --- mobile ---
 * 
 * top-ep: 이어보기 버튼 상단 추가
 * 
 * bottom-heart-alarm: 선호작, 구독알람 아이콘 하단 추가
 * 
 * origin-header: 기본적으로 기존 헤더로 변경
 * 
 * bottom-nav: 하단 내비게이션 삭제 & 기본적으로 기존 헤더로 변경
 * 
 * --- viewer ---
 * 
 * old-icon: 옛 뷰어 아이콘 및 배치
 * 
 * click-alert: 우클릭 알림 삭제
 * 
 * --- other ---
 * 
 * notice: 메인페이지 공지 상단에 노출
 * 
 * web-title: 페이지 이름 커스텀 [normal/short/reverse-short/single/reverse-normal]
 * 
 * last-ep: 마지막으로 읽었던 회차로 이동 알림
 * 
 * last-ep-cooltime: 알림 제거 후 다시 보기
 * 
 * last-ep-home: 메인화면에서만 알림
 * 
 * --- custom css ---
 * 
 * custom-css: 커스텀 css
 */
const l = {
    // header
    adult: 'adult', b_w: 'b-w', search: 'search', s_r: 'search-result', alarm: 'alarm',

    // navigation
    nav_align: 'nav-align', nav_mb: 'nav-mybook', nav: 'nav', 

    // novel page
    no_pa: 'novel-page',

    // mobile
    t_ep: 'top-ep', b_h_a: 'bottom-heart-alarm', o_header: 'origin-header', b_nav: 'bottom-nav',

    // viewer
    old_icon: 'old-icon', click_alert: 'click-alert',

    // other
    notice: 'notice', w_title: 'web-title',
    last_ep: 'last-ep', last_ep_cooltime: 'last-ep-cooltime', last_ep_home: 'last-ep-home',
    //quick_mybook: 'quick-mybook', quick_mybook_blank: 'quick-mybook-blank',

    // custom css
    c_css: 'custom-css'
};






const project_name = 'NPup';
const project_prefix = project_name.toLowerCase() + '-';
const console_project_prefix = project_name.toUpperCase() + ': ';

const sync_key = 'extension-sync', hf = 'high-performance';

const laze_check_time = 100;

const observer_setup = {
    childList: true,
    subtree: true
};

let path = window.location.pathname + window.location.search;   
const html = document.getElementsByTagName('html')[0];

new MutationObserver(() => {
    let current_path = window.location.pathname + window.location.search;

    if (path == current_path) return;
    else path = current_path;

}).observe(html, { ...observer_setup, attributes: true, characterData: true }); 






// Base Functions
/**
 * 현 주소가 적힌 path인지 확인하는 함수
 * @param {any} paths string 혹은 Array 타입의 path(s)를 적어주세요.
 * @returns {boolean}
 */
const pathChecker = (paths) => {
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

/**
 * 현재 도메인 확인 함수
 * @param {string} domain [novel, books, webtoon] || 도메인
 * @returns {boolean}
 */
const domainChecker = (domain) => {
    const domain_type = {
        novel: 'novelpia.com',
        books: 'book.novelpia.com',
        webtoon: 'toptoon.novelpia.com'
    };

    const current_domain = window.location.hostname;

    return current_domain == domain_type[domain] || domain;

}

/**
 * 간단한 try catch 함수
 * @param {function} func 실행할 함수를 작성하는 곳.
 * @param {string} type 이 함수에게 명명하세요.
 * @param {string | boolean} not_engine 콘텐츠 스크립트의 기본적인 함수인 엔진이 아니라면 무엇이라고 할 것 입니까? 만약 아무것도 아니라면 spacing 해주세요. 코멘트만을 원하면 '' 처리를 해주세요. 콘솔 출력을 하고 싶지 않다면 false를 해주세요.
 * @param  {...any} comment 추가 코멘트 작성.
 */
const tryChecker = (func, type, not_engine, ...comment) => {
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
            let log = console_project_prefix + (type ? type + space + `${system_type}(이)가 ` : '') + '실행 중입니다.';
            if (!no_console) return;
            else if (!comment) return console.log(log);
            else return console.log(log, ...comment);
        } catch (err) {
            return console.error(console_project_prefix + (type ? type + space + `${system_type} `: '') + `오류 발생.\n원인: ${err}`);
        }
    } else return console.error(console_project_prefix + '엔진을 실행할 수 없습니다.\n원인: 함수가 아닙니다.');
}
