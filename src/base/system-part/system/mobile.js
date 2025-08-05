npup.options.mobile.options['bottom-nav'].system = function (r) {
    basicUseSystem('origin-header', r);
    basicUseSystem('bottom-heart-alarm', r);
}





npup.options.mobile.options['origin-header'].system = function(r) {
    basicUseSystem('bottom-heart-alarm', r);

    if (!r['search']) {
        let m_search_icon = ``
            + `<a href="/search" class="header-mobile-search">`
                + `<img src="//images.novelpia.com/img/new/navi/sbm_icon_search.svg" alt="모바일 검색">`
            + `</a>`;

        new MutationObserver((mus, ob) => {
            const main = document.getElementsByClassName('header-icon-menu')[0];

            if (!main) return;

            ob.disconnect();

            main.insertAdjacentHTML("afterbegin", m_search_icon);
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





npup.options.mobile.options['bottom-heart-alarm'].system = function(r) {
    if (!pathChecker('/novel')) return;

    new MutationObserver((mus, ob) => {
        const continue_ep = document.querySelector('.epnew-mobile-btn-area-relative + .btn-view-episode');
    
        if (!continue_ep) return;

        ob.disconnect();

        const bottom_button = 'btn-view-episode';
        const inner_style = 'width: 40px; height: 44px; padding: 11px 0;';

        let like = document.getElementsByClassName('sbm_icon_heart')[0].parentElement.cloneNode(true);
        let alarm = document.getElementsByClassName('sbm_icon_alert')[0].parentElement.cloneNode(true);

        const ep_width = continue_ep.getBoundingClientRect().width;
        let style = document.createElement('style');

        if (ep_width != 0) style.insertAdjacentHTML('afterbegin', epWidth(ep_width)), document.head.appendChild(style);
        else widthObserver(continue_ep, style);

        [like, alarm].forEach(el => {
            el.classList.add(bottom_button);
            el.firstElementChild.classList.add('bg-black');
            el.firstElementChild.classList.remove('s_inv'); // novelpia dark class 없애서 다크모드에서 화이트가 되는 현상 제거
            el.firstElementChild.style = inner_style;

            continue_ep.insertAdjacentElement('afterend', el);
        });
    }).observe(document.body, observer_setup);

    /* 위치 속성은 css에서 / bottom-like-alarm 참고 */
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
 * @param {HTMLStyleElement} style 미리 생성해놓은 style 노드
 */
function widthObserver(continue_ep, style) {
    new MutationObserver((mus, ob) => {
        if (window.innerWidth > 891) return;

        ob.disconnect();

        const ep_width = continue_ep.getBoundingClientRect().width;

        style.insertAdjacentHTML('afterbegin', epWidth(ep_width)), document.head.appendChild(style);
    }).observe(document.body, { ...observer_setup, attributes: true });
}




npup.options.mobile.options['top-ep'].system = function(r) {
    if (!pathChecker('/novel')) return;

    new MutationObserver((mus, ob) => {
        const continue_ep_mobile = document.getElementsByClassName('btn-view-run')[0];

        if (!continue_ep_mobile) return;

        ob.disconnect();

        let top_ep = continue_ep_mobile.parentElement.cloneNode(true);
        top_ep.style = 'justify-content: center;';
        top_ep.firstElementChild.style = 'max-width: 585px; width: 100%; margin-top: 20px;';
        if (top_ep.children.length > 1) top_ep.lastElementChild.style.display = 'none';

        const info_box = document.querySelector('.novel-info-mobile-wrapper > .info-graybox');

        info_box.insertAdjacentElement('afterend', top_ep);
    }).observe(document.body, observer_setup);
}
