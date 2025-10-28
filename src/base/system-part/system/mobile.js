const mobileCa = npup.options.mobile.options;

mobileCa['bottom-nav'].system = function (r) {
    basicUseSystem('origin-header', r);
}




mobileCa['origin-header'].options['scroll-hidden-header'].system = function(r) {
    if (!r['origin-header'] && !r['bottom-nav']) return;

    targetHandler(() => document.getElementById('copyright_bar'), () => scrollHiddenHeader());

    function scrollHiddenHeader() {
        const header = document.querySelector('header.mobile_hidden');
        let header_all_height = null;
        let header_height = null;
        header.style.top = 0;

        let scrollY = window.scrollY;

        let menu_tap = undefined;
        let menu_top_important = false;

        decideMenuTap();

        if (window.innerWidth < 892) {
            header_all_height = getHeaderHeight(header);
            header_height = header.getBoundingClientRect().height; 
        }

        const scrollHeader = () => {
            if (window.innerWidth >= 892) {
                header.style.top = '0px';
                if (menu_tap) menu_tap.style.top = '';
                scrollY = window.scrollY;
                return;
            }

            if (!header_all_height) {
                header_all_height = getHeaderHeight(header);
                header_height = header.getBoundingClientRect().height;
            }

            const scroll_gap = window.scrollY - scrollY;
            scrollY = window.scrollY;

            let header_top = parseFloat(header.style.top) || 0;
            
            const header_calc = header_top - scroll_gap;

            if (scroll_gap > 0 && window.scrollY > 0) { // scroll up
                if (header_top == -header_all_height) return;
                header_top = header_calc < -header_all_height ? -header_all_height : header_calc;
            }
            else if (scroll_gap < 0) { // scroll down
                if (header_top == 0) return;
                header_top = header_calc > 0 ? 0 : header_calc;
            }

            if (menu_tap) {
                if (!document.body.contains(menu_tap)) decideMenuTap();
                const menu_tap_calc = header_height - 1 + header_top;
                if (menu_top_important) menu_tap.style.setProperty('top', `${menu_tap_calc < 0 ? 0 : menu_tap_calc}px`, 'important');
                else menu_tap.style.top = `${menu_tap_calc < 0 ? 0 : menu_tap_calc}px`;
            }

            header.style.top = `${header_top}px`;
        }
        window.addEventListener('scroll', scrollHeader);

        scrollY = window.scrollY;

        const decideMenuRouter = route_event => decideMenuTap(route_event.detail.pCheck);
        window.addEventListener(npup.event.router, decideMenuRouter);


        function decideMenuTap(pCheck = pathChecker) {
            if (pCheck('/novel/')) {
                menu_tap = document.getElementsByClassName('menu_alarm_m')[0];
                menu_top_important = true;
            }
            else if (document.getElementsByClassName('tap-box')[0]) {
                menu_tap = document.querySelector('*:has(> div > .tap-box)');
                menu_top_important = false;
            }
            else if (document.getElementsByClassName('contest_menu')[0]) {
                menu_tap = document.getElementsByClassName('contest_menu')[0];
                menu_top_important = false;
            }
            else if (document.getElementsByClassName('contest-tab')[0]) {
                menu_tap = document.getElementsByClassName('contest-tab')[0];
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

        removeEventForEngine(() => {
            window.removeEventListener('scroll', scrollHeader);
            window.removeEventListener(npup.event.router, decideMenuRouter);
        });
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
        const m_search_icon = document.createElement('a');
        m_search_icon.href = '/search';
        m_search_icon.classList.add('header-mobile-search');

        const m_search_img = document.createElement('img');
        m_search_img.src = '//images.novelpia.com/img/new/navi/sbm_icon_search.svg';
        m_search_img.alt = '모바일 검색';

        m_search_icon.appendChild(m_search_img);

        targetHandler(
            () => document.getElementsByClassName('header-icon-menu')[0],
            (target) => target.esrender("afterbegin", m_search_icon),
            { redetect: 1 }
        );
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
    const target = () => document.querySelector('.btn-view-episode');

    if (pathChecker('/novel/')) {
        targetHandler(
            target,
            (continue_ep) => checkStyleSetup(continue_ep),
            { redetect: 1 }
        );
    }
    else if (pathChecker('/comic_episode/')) {
        targetHandler(
            target,
            (continue_ep) => {
                checkStyleSetup(continue_ep, true);

                let is_changed = false;

                const continueObserver = new MutationObserver((mus2, ob2) => {
                    is_changed = true;

                    ob2.disconnect();

                    checkStyleSetup(target(), true);
                });

                continueObserver.observe(target(), observer_setup);

                const continueInterval = setInterval(() => {
                    if (document.querySelector('.loads').style.display != 'none') return;

                    continueObserver.disconnect();

                    // 인터넷 속도가 느려 로딩 페이지가 오랫동안 보이고 continueObserver가 변화를 감지하기 전에 로딩 페이지를 닫는 버튼을 눌러버린다면
                    // 이어보기에 추가 변화가 없다고 감지할 수 있음.
                    if (!is_changed) npup.log('이어보기에 추가 변화가 없습니다.');
                    else npup.log('이어보기에 변화가 있었습니다.');

                    clearInterval(continueInterval);
                }, 1.5 * 1000);
            },
            { redetect: 1 }
        );
    }
    else
        return;


    const style_id = `${npup.project.prefix.css}${this.key}`;

    const icon = {
        size: 22,
        gap: 10,
    }

    let el_data = {
        size: 0,
        border: 0,
    }

    /**
     * bottom-heart-alarm system 함수 이전 스타일 함수
     * @param {Element} continue_ep 측정할 이어보기 html 요소
     * @param {boolean} comic 웹만화인가
     */
    function checkStyleSetup(continue_ep, comic = false) {
        const ep_width = continue_ep.offsetWidth || 0;

        if (ep_width != 0) {    // display: none;
            setAllSetup(continue_ep);
        }
        else {
            if (!comic)
                widthObserver(continue_ep, style_id);
            else
                widthComicObserver(continue_ep, style_id);
        }
    }

    /**
     * bottom-heart-alarm system 함수
     * @param {Element} continue_ep 측정할 이어보기 html 요소
     */
    function setBottomHeartAlarm(continue_ep) {
        const bottom_button = 'btn-view-episode';
        const inner_size = el_data.size - (2 * el_data.border);
        const inner_style = `width: ${inner_size}px; height: ${inner_size}px; padding: ${(inner_size - icon.size) / 2}px 0;`;

        let like = document.getElementsByClassName('sbm_icon_heart')[0].parentElement.cloneNode(true);
        let alarm = document.getElementsByClassName('sbm_icon_alert')[0].parentElement.cloneNode(true);

        [like, alarm].forEach(el => {
            el.classList.add(bottom_button);
            el.firstElementChild.classList.add('bg-black');
            el.firstElementChild.classList.add('mobile_show');
            el.firstElementChild.classList.remove('s_inv'); // novelpia dark class 없애서 다크모드에서 화이트가 되는 현상 제거
            el.firstElementChild.style = inner_style;

            continue_ep.insertAdjacentElement('afterend', el);
        });
    }

    /**
     * 이어보기 크기 style 값
     * @param {number} ep_width 이어보기 크기
     * @returns {string} style 값
     */
    function epWidth(ep_width) {
        const el_li_al = ep_width + icon.gap + el_data.size + icon.gap + el_data.size;

        return '/* bottom-heart-alarm */'
            + `html[npup-bottom-heart-alarm], html[npup-origin-header], html[npup-bottom-nav] {`
                + `.btn-view-episode {`
                    + `left: calc(50% - ((${el_li_al}px / 2) - (${ep_width}px / 2)));`
                + `}`

                + `.sbm-icon-menu.btn-view-episode:has(.sbm_icon_alert) {`
                    + `left: calc(50% + ((${el_li_al}px / 2) - (${el_data.size / 2}px)));`
                + `}`

                + `.sbm-icon-menu.btn-view-episode:has(.sbm_icon_heart) {`
                    + `left: calc(50% + ((${el_li_al}px / 2) - (${el_data.size / 2}px + ${icon.gap}px + ${el_data.size}px)));`
                + `}`
            + `}`;

        /* ':root {'
            + `--${npup.project.prefix.css}ep-width: ${ep_width}px;`
        + '}'; */
    }

    /**
     * 대형화면에서 시작해서 이어보기 크기가 display: none; 상태에서 width가 0이 되어 불편하게 보이는 것을 방지
     * @param {Element} continue_ep 측정할 이어보기 html 요소
     */
    function widthObserver(continue_ep) {
        const widthOb = new MutationObserver((mus, ob) => {
            if (window.innerWidth > 891) return;

            ob.disconnect();

            setAllSetup(continue_ep);
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
     */
    function widthComicObserver(continue_ep) {
        if (width_comic_observer) {
            window.removeEventListener('resize', width_comic_observer);
            width_comic_observer = undefined;
            window.removeEventListener(npup.event.router, width_comic_remove_observer);
            width_comic_remove_observer = undefined;
        }

        if (window.innerWidth > 891) {
            width_comic_observer = function resizeListener() {
                if (window.innerWidth <= 891) {
                    setAllSetup(continue_ep, style_id);
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
            setWidth(continue_ep, style_id);
    }

    /**
     * 이이보기 크기 style 삽입
     * @param {Element} continue_ep 측정할 이어보기 html 요소
     * @param {HTMLStyleElement} style 미리 생성해놓은 style 노드
     */
    function setAllSetup(continue_ep) {
        setEpData(continue_ep);

        setBottomHeartAlarm(continue_ep);
        
        const ep_width = continue_ep.getBoundingClientRect()?.width || 0;

        return styleInjection(style_id, epWidth(ep_width));
    }

    /**
     * 에피소드 이어보기 버튼 크기 데이터 추출
     */
    function setEpData(el) {
        el_data = {
            size: el.offsetHeight,
            border: (el.offsetHeight - el.clientHeight) / 2
        }
    }
}







mobileCa['top-ep'].system = function(r) {
    if (!pathChecker('/novel/')) return;

    targetHandler(
        () => document.getElementsByClassName('btn-view-run')[0],
        (target) => {
            let top_ep = target.parentElement.cloneNode(true);
            top_ep.style = 'justify-content: center;';
            top_ep.firstElementChild.style = 'max-width: 585px; width: 100%; margin-top: 20px;';
            if (top_ep.children.length > 1) top_ep.lastElementChild.style.display = 'none';

            const final_target = document.querySelector('.epnew-mobile-btn-area-relative');

            final_target.insertAdjacentElement('beforebegin', top_ep);
        },
        { redetect: 1 }
    );
}
