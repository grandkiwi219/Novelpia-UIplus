const mobileCa = npup.options.mobile.options;

mobileCa['bottom-nav'].system = function (r) {
    basicUseSystem('origin-header', r);
}




mobileCa['origin-header'].options['scroll-hidden-header'].system = function(r) {
    if (!r['origin-header'] && !r['bottom-nav']) return;

    targetHandler(() => document.querySelector('header.mobile_hidden'), scrollHiddenHeader);

    function scrollHiddenHeader() {
        const header = document.querySelector('header.mobile_hidden');
        header.style.top = 0;

        let scrollY = window.scrollY;

        let menu_tap = undefined;
        let menu_top_important = false;

        decideMenuTap();

        window.addEventListener('scroll', () => {
            if (window.innerWidth >= 892) {
                header.style.top = '0px';
                if (menu_tap) menu_tap.style.top = '';
                scrollY = window.scrollY;
                return;
            }

            const scroll_gap = window.scrollY - scrollY;
            scrollY = window.scrollY;

            let header_top = parseFloat(header.style.top) || 0;
            const header_height = getHeaderHeight(header);
            const header_calc = header_top - scroll_gap;

            if (scroll_gap > 0 && window.scrollY > 0) { // scroll up
                if (header_top == -header_height) return;
                header_top = header_calc < -header_height ? -header_height : header_calc;
            }
            else if (scroll_gap < 0) { // scroll down
                if (header_top == 0) return;
                header_top = header_calc > 0 ? 0 : header_calc;
            }

            if (menu_tap) {
                const menu_tap_calc = header.getBoundingClientRect().height - 1 + header_top;
                if (menu_top_important) menu_tap.style.setProperty('top', `${menu_tap_calc < 0 ? 0 : menu_tap_calc}px`, 'important');
                else menu_tap.style.top = `${menu_tap_calc < 0 ? 0 : menu_tap_calc}px`;
            }

            header.style.top = `${header_top}px`;
        });
        scrollY = window.scrollY;

        window.addEventListener(npup.event.router, route_event => decideMenuTap(route_event.detail.pCheck));


        function decideMenuTap(pCheck = pathChecker) {
            if (pCheck('/novel/')) {
                menu_tap = document.getElementsByClassName('menu_alarm_m')[0];
                menu_top_important = true;
            }
            else if (document.getElementsByClassName('tap-box')[0]) {
                menu_tap = document.querySelector('*:has(> div > .tap-box)');
                menu_top_important = false;
            }
            else if (pCheck('/comic_main/')) {
                menu_tap = document.getElementsByClassName('comic-new-header-wp')[0];
                menu_top_important = false;
            }
            else {
                menu_tap = undefined;
            }
        }
    }
}

function getHeaderHeight(el) {
    const shadow = getComputedStyle(el).boxShadow;

    if (!shadow || shadow == 'none')
        return el.getBoundingClientRect().height;

    const match = shadow.match(/(-?\d+px)/g) || [];
    const height =  parseFloat(match[1]), blur = parseFloat(match[2]), spread = parseFloat(match[3]);

    return el.getBoundingClientRect().height + height + (blur + spread) * 2;
}




mobileCa['origin-header'].system = function(r) {
    basicUseSystem('bottom-heart-alarm', r);

    if (!r['search']) {
        let m_search_icon = ``
            + `<a href="/search" class="header-mobile-search">`
                + `<img src="//images.novelpia.com/img/new/navi/sbm_icon_search.svg" alt="모바일 검색">`
            + `</a>`;

        new MutationObserver((mus, ob) => {
            const main = document.getElementsByClassName('header-icon-menu')[0];

            if (!main) return;

            main.insertAdjacentHTML("afterbegin", m_search_icon);
            
            ob.disconnect();
        }).observe(document.body, observer_setup);
    }

    document.querySelectorAll('#toggle-menu').forEach(b => {
        b.addEventListener('click', () => {
            if (window.innerWidth > 891) return;

            document.getElementById('pc-sidemenu').style.display = 'none';

            document.getElementById('m-sidemenu').classList.add('show');

            let side_bgc = `<div class="sidemenu-background"></div>`;

            document.querySelector('#m-sidemenu > .currency-tooltip').insertAdjacentHTML('afterend', side_bgc);

            document.getElementsByTagName('body')[0].classList.add('modal-open');
        });
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 891) return;

        document.querySelectorAll('.sidemenu-background').forEach(el => {
            let is_click = el.contains(event.target);

            if (!is_click) return;

            document.getElementsByTagName('body')[0].classList.remove('modal-open');

            document.getElementsByClassName('sidemenu-background')[0].remove();
            document.getElementById('m-sidemenu').classList.remove('show');
        });

        document.querySelectorAll('.sidemenu-control > img:last-child').forEach(el => {
            let is_click = el.contains(event.target);

            if (!is_click) return;

            document.getElementsByClassName('sidemenu-background')[0].remove();
            document.getElementById('m-sidemenu').classList.remove('show');
        });
    });

    /* 메인 페이지 border 속성 스크롤시 설정 고려 중 */
}





mobileCa['bottom-heart-alarm'].system = function(r) {
    if (pathChecker('/novel/'))
        new MutationObserver((mus, ob) => {
            const continue_ep = document.querySelector('.btn-view-episode');
        
            if (!continue_ep) return;

            ob.disconnect();

            setBottomHeartAlarm(continue_ep);
        }).observe(document.body, observer_setup);
    else if (pathChecker('/comic_episode/'))
        new MutationObserver((mus, ob) => {
            const continue_ep = document.querySelector('.btn-view-episode');

            if (!continue_ep) return;

            ob.disconnect();
            
            setBottomHeartAlarm(continue_ep, true);

            let is_changed = false;

            const continueObserver = new MutationObserver((mus2, ob2) => {
                is_changed = true;

                ob2.disconnect();

                setBottomHeartAlarm(document.querySelector('.btn-view-episode'), true);
            });
            
            continueObserver.observe(document.querySelector('.btn-view-episode'), observer_setup);

            const continueInterval = setInterval(() => {
                if (document.querySelector('.loads').style.display != 'none') return;

                continueObserver.disconnect();
                
                // 인터넷 속도가 느려 로딩 페이지가 오랫동안 보이고 continueObserver가 변화를 감지하기 전에 로딩 페이지를 닫는 버튼을 눌러버린다면
                // 이어보기에 추가 변화가 없다고 감지할 수 있음.
                if (!is_changed) npup.log('이어보기에 추가 변화가 없습니다.');
                else npup.log('이어보기에 변화가 있었습니다.');

                clearInterval(continueInterval);
            }, 1.5 * 1000);
        }).observe(document.body, observer_setup);
    else
        return;

    /* 위치 속성은 css에서 / bottom-like-alarm 참고 */

    /**
     * bottom-heart-alarm system 함수
     * @param {Element} continue_ep 측정할 이어보기 html 요소
     * @param {boolean} comic 웹만화인가
     */
    const setBottomHeartAlarm = (continue_ep, comic = false) => {
        const bottom_button = 'btn-view-episode';
        const inner_style = 'width: 40px; height: 44px; padding: 11px 0;';

        let like = document.getElementsByClassName('sbm_icon_heart')[0].parentElement.cloneNode(true);
        let alarm = document.getElementsByClassName('sbm_icon_alert')[0].parentElement.cloneNode(true);

        const ep_width = continue_ep.offsetWidth/* getBoundingClientRect().width */;
        let style = document.createElement('style');
        style.id = `${npup.project.prefix.css}${this.key}`

        if (ep_width != 0) {    // display: none;
            style.insertAdjacentHTML('afterbegin', epWidth(ep_width));
            document.head.appendChild(style);
        }
        else {
            if (!comic)
                widthObserver(continue_ep, style);
            else
                widthComicObserver(continue_ep, style);
        }

        [like, alarm].forEach(el => {
            el.classList.add(bottom_button);
            el.firstElementChild.classList.add('bg-black');
            el.firstElementChild.classList.add('mobile_show');
            el.firstElementChild.classList.remove('s_inv'); // novelpia dark class 없애서 다크모드에서 화이트가 되는 현상 제거
            el.firstElementChild.style = inner_style;

            continue_ep.insertAdjacentElement('afterend', el);
        });
    }
}



/**
 * 이어보기 크기 style 값
 * @param {number} ep_width 이어보기 크기
 * @returns {string} style 값
 */
function epWidth(ep_width) {
    return ':root {'
        + `--${npup.project.prefix.css}ep-width: ${ep_width}px;`
    + '}';
}

/**
 * 대형화면에서 시작해서 이어보기 크기가 display: none; 상태에서 width가 0이 되어 불편하게 보이는 것을 방지
 * @param {Element} continue_ep 측정할 이어보기 html 요소
 * @param {HTMLStyleElement} style 미리 생성해놓은 style 노드
 */
function widthObserver(continue_ep, style) {
    const widthOb = new MutationObserver((mus, ob) => {
        if (window.innerWidth > 891) return;

        ob.disconnect();

        setWidth(continue_ep, style)
    });
    widthOb.observe(document.body, { ...observer_setup, attributes: true });

    removeEvent(() => {
        widthOb.disconnect();
    });
}

let width_comic_observer = undefined;
let width_comic_remove_observer = undefined;

/**
 * 대형화면에서 시작해서 이어보기 크기가 display: none; 상태에서 width가 0이 되어 불편하게 보이는 것을 방지
 * @param {Element} continue_ep 측정할 이어보기 html 요소
 * @param {HTMLStyleElement} style 미리 생성해놓은 style 노드
 */
function widthComicObserver(continue_ep, style) {
    if (width_comic_observer) {
        window.removeEventListener('resize', width_comic_observer);
        width_comic_observer = undefined;
        window.removeEventListener(npup.event.router, width_comic_remove_observer);
        width_comic_remove_observer = undefined;
    }

    if (window.innerWidth > 891) {
        width_comic_observer = function resizeListener() {
            if (window.innerWidth <= 891) {
                setWidth(continue_ep, style);
                window.removeEventListener('resize', width_comic_observer);
                width_comic_observer = undefined;
            }
        }

        window.addEventListener('resize', width_comic_observer);

        width_comic_remove_observer = function routerResizeRemove() {
            window.removeEventListener('resize', width_comic_observer);
            window.removeEventListener(npup.event.router, width_comic_remove_observer);
        }

        window.addEventListener(npup.event.router, width_comic_remove_observer);
    }
    else
        setWidth(continue_ep, style);
}

/**
 * 이이보기 크기 style 삽입
 * @param {Element} continue_ep 측정할 이어보기 html 요소
 * @param {HTMLStyleElement} style 미리 생성해놓은 style 노드
 */
function setWidth(continue_ep, style) {
    const ep_width = continue_ep.getBoundingClientRect().width;

    style.insertAdjacentHTML('afterbegin', epWidth(ep_width)), document.head.appendChild(style);
}




mobileCa['top-ep'].system = function(r) {
    if (!pathChecker('/novel/')) return;

    targetHandler(() => document.getElementsByClassName('btn-view-run')[0], setTopEp);

    function setTopEp() {
        let top_ep = document.getElementsByClassName('btn-view-run')[0].parentElement.cloneNode(true);
        top_ep.style = 'justify-content: center;';
        top_ep.firstElementChild.style = 'max-width: 585px; width: 100%; margin-top: 20px;';
        if (top_ep.children.length > 1) top_ep.lastElementChild.style.display = 'none';

        const target = document.querySelector('.epnew-mobile-btn-area-relative');

        target.insertAdjacentElement('beforebegin', top_ep);
    }
}
