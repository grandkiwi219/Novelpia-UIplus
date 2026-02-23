const viewerCa = npup.options.viewer.options;


viewerCa['old-icon'].system = function(r) {
    /* if (dom_loaded) iconSetup();
    else */ window.addEventListener('DOMContentLoaded', iconSetup);

    /* nd r-d */
}


function iconSetup() {
    // style: system-content.css => old-icon css 부분

    // home
    const home = document.getElementsByClassName('menu-top-home')[0];

    const old_home = document.createElement('div');
    old_home.classList.add('ion-home');
    old_home.style.fontSize = '25px';

    home.appendChild(old_home);

    // title
    const title = document.getElementsByClassName('menu-title-wrapper')[0];

    const novel_name = document.createElement('b');
    novel_name.classList.add('menu-top-novel-title');
    novel_name.textContent = document.title
        .replace('노벨피아', '')
        .replace('웹소설로 꿈꾸는 세상!', '')
        .replace(/ - /g, '');

    const title_element_wrapper = document.createElement('div');
    title_element_wrapper.classList.add('menu-top-title-element-wrapper');
    title_element_wrapper.textContent = document.getElementsByClassName('menu-top-title')[0].textContent;

    const title_tag = document.getElementsByClassName('menu-top-tag')[0];
    if (title_tag)
        title_element_wrapper.insertAdjacentElement('afterbegin', title_tag);

    const title_nineteen = document.getElementsByClassName('menu-top-adult')[0]
    if (title_nineteen) {
        title_nineteen.remove();

        const old_nineteen = document.createElement('span');
        old_nineteen.classList.add('menu-top-nineteen');
        old_nineteen.textContent = '19';

        title_element_wrapper.insertAdjacentElement('afterbegin', old_nineteen);
    }

    title.insertAdjacentElement('afterbegin', novel_name);
    title.appendChild(title_element_wrapper);

    // list -- 나중 svg, 텍스트로 직접 대체하기 전까지
    /* const list = document.getElementsByTagName('menu-top-list')[0]; */

    // setting -- 나중 svg, 텍스트로 직접 대체하기 전까지
    /* const setting = document.getElementsByTagName('menu-top-setting')[0]; */


    // vote -- 나중 svg, 텍스트로 직접 대체하기 전까지
    /* const vote = document.getElementById('recommend_tap'); */


    // bottom item
    const bt_item = document.getElementsByClassName('menu-bottom-item');

    bt_item[1].classList.add('last-ep'); // last

    // before -- 나중 svg, 텍스트로 직접 대체하기 전까지
    const before = bt_item[0];
    before.classList.add('before-ep');

    // after -- 나중 svg, 텍스트로 직접 대체하기 전까지
    const after = bt_item[4];
    after.classList.add('after-ep');

    // comment -- 나중 svg, 텍스트로 직접 대체하기 전까지
    const comment = bt_item[3];
    comment.classList.add('comment-ep');

    before.insertAdjacentElement('afterend', comment);

    // like -- 나중 svg, 텍스트로 직접 대체하기 전까지
    const like = document.getElementsByClassName('menu-top-like')[0];

    like.classList.add('menu-bottom-item');
    like.classList.add('like-ep');
    like.classList.remove('menu-top-like');

    after.insertAdjacentElement('beforebegin', like);
}



viewerCa['dbl-vote'].system = function(r) {
    // const std_novel_el = 'novel_text';

    const scroll_novel = 'novel_drawing';
    const page_novel = 'novel_drawing_page_c';

    let last = {
        time: 0,
        pos: { x: 0, y: 0 },
        clickTimer: null
    }

    const cooltime = 180;
    const pos_error = 100;


    let enhanced = {
        key: `${this.key}-plus`,
        func: () => {}
    }

    if (r[enhanced.key]) {
        // 둘 다 하는 이유는 novel_drawing_page_c의 height 가 완전히 0이 아니기 때문
        [scroll_novel, page_novel].forEach(nd => {
            targetHandler(
                () => document.getElementById(nd),
                targetFunction,
                {
                    method: 1,
                    redetect: 1
                }
            );
        });

        function targetFunction(target) {
            target.outerHTML = target.outerHTML.replace('onclick', '');

            enhanced.func = (target) => {
                // if (document.getElementById(std_novel_el) == target) return;

                clearTimeout(last.clickTimer);
                last.clickTimer = setTimeout(() => {
                    naviView();
                }, cooltime);
            }
        }
    }

    
    const dblVoteEvent = (e) => {
        /* if (!document.getElementById(std_novel_el)) return;
        
        if (
            document.getElementById('novel_drawing_right') == e.target ||
            document.getElementById('novel_drawing_right')?.contains(e.target) ||
            document.getElementById('novel_drawing_left') == e.target ||
            document.getElementById('novel_drawing_left')?.contains(e.target)
        ) return;

        if (!document.getElementById(std_novel_el).contains(e.target)) return; */

        if (
            !isTarget(scroll_novel)
            && !isTarget(page_novel)
        ) return;

        const now = performance.now();

        const last_time = now - last.time;
        const dist = Math.hypot(e.clientX - last.pos.x, e.clientY - last.pos.y);

        if (last_time < cooltime && dist < pos_error) {
            clearTimeout(last.clickTimer);
            resetLast(-cooltime);
            executeVote();
            return;
        }

        resetLast(now);
        enhanced.func(e.target);

        function resetLast(time) {
            last.time = time;
            last.pos = { x: e.clientX, y: e.clientY };
        }

        function isTarget(id) {
            return document.getElementById(id) == e.target
                || document.getElementById(id)?.contains(e.target);
        }
    }

    document.addEventListener('click', dblVoteEvent);

    /* nd r-d */
}



viewerCa['scroll-close-menu'].system = function(r) {
    targetHandler(
        () => document.getElementById('novel_box'),
        () => scriptInjection(`src/base/file/close-navi-view.js`)
    );  

    /* nd r-d */
}



viewerCa['line-share'].system = function(r) {
    switch (location.hash) {
        case '#comments':
        case '#lists':
            return;
    }

    const lineShareSystem = () => {
        const [header] = document.getElementsByClassName('menu-top-wrapper');

        const share = document.createElement('div');
        share.id = `${npup.project.prefix.css}${this.key}-btn`;
        Object.assign(share.style, {
            boxSizing: 'border-box',

            width: '44px',
            height: '44px',

            borderRadius: '50px',

            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            boxShadow: 'rgba(80, 80, 80, 0.5) 0px 0px 5px',

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            
            position: 'absolute',
            top: '70px',
            right: '20px',

            cursor: 'pointer',

            filter: isViewerDarkMode() ? 'invert(1)' : ''
        });

        const share_icon = document.createElement('img');
        share_icon.src = 'https://images.novelpia.com/img/new/common/ep_b_icon_share.svg';
        share_icon.alt = '공유';
        Object.assign(share_icon.style, {
            width: '24px',
            height: '24px'
        });
        share.appendChild(share_icon);

        header.esrender(share);


        const bar_hide = `${npup.project.prefix.css}${this.key}-bar-hide`;

        const selector_class = `${npup.project.prefix.css}${this.key}-selector`;

        const header_bar = document.getElementById('header_bar');
        const footer_bar = document.getElementById('footer_bar');

        const shareEvent = e => {
            const isDark = isViewerDarkMode();

            const paging = localStorage['viewer_paging'] == '1';
            const ani = localStorage['viewer_animation'] == 'on';

            const viewer = paging ? document.getElementById('novel_drawing_page_c') : document.getElementById('novel_drawing');

            header_bar.classList.add(bar_hide);
            footer_bar.classList.add(bar_hide);

            const cover = document.createElement('div');
            Object.assign(cover.style, {
                width: '100%',
                height: `${viewer.offsetHeight}px`,

                position: 'absolute',
                top: 0,
                left: 0
            });

            const cancel = document.createElement('div');
            cancel.innerHTML = ''
                + `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20" height="20" stroke-width="2" stroke="${isDark ? 'white' : 'black'}" fill="none" stroke-linecap="round">`
                    + '<path d="M5 5 L25 25 M5 25 L25 5"></path>'
                + '</svg>';
            Object.assign(cancel.style, {
                width: 'fit-content',
                height: 'fit-content',

                padding: '8px',

                fontSize: '0',
                lineHeight: '0',

                position: 'sticky',
                top: '15px',
                marginLeft: 'auto',
                marginRight: '15px',

                cursor: 'pointer'
            });

            if (!isTouchDevice()) {
                const cancel_esc = document.createElement('div');
                cancel_esc.textContent = 'Esc';
                Object.assign(cancel_esc.style, {
                    width: '100%',
                    height: '22px',
    
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    boxShadow: 'rgba(80, 80, 80, 0.5) 0px 0px 3px',
    
                    fontSize: '12px',
                    lineHeight: '22px',
                    textAlign: 'center',
    
                    position: 'absolute',
                    bottom: '0px',
                    left: '0px',
    
                    transform: 'translateY(100%)',

                    filter: isDark ? 'invert(1)' : ''
                });
                cancel.appendChild(cancel_esc);
            }

            cover.appendChild(cancel);

            const selector_padding = 5;

            const bgc = isDark ? 219 : 128;
            const bsc = isDark ? 205 : 80;

            const selector = document.createElement('div');
            selector.classList.add(selector_class);
            Object.assign(selector.style, {
                width: `${viewer.clientWidth + (selector_padding * 2)}px`,
                height: 0,
                backgroundColor: `rgba(${bgc}, ${bgc}, ${bgc}, 0.2)`,
                boxShadow: `rgba(${bsc}, ${bsc}, ${bsc}, 0.5) 0px 0px 3px`,
                borderRadius: '8px',

                position: 'absolute',
                top: '0',
                left: `${viewer.getBoundingClientRect().x - selector_padding}px`,

                cursor: 'pointer',

                transition: ani ? 'height .14s' : ''
            });
            cover.appendChild(selector);

            document.getElementById('novel_box').esrender(cover);

            // ---

            const store = {
                height: NaN,
                top: NaN,
                left: NaN
            }
 
            if (paging) {
                pageDocTracking(share, viewer, selector, cancel, moveSelector, idleSelector, exit);
            }
            else {
                scrollDocTracking(share, viewer, selector, cancel, moveSelector, idleSelector, exit);
            }

            showAlert({ msg: '공유하실 문단을 선택 후 클릭해주세요.' });

            function moveSelector({ height, top, left } = {}) {
                if (top && top != store.top) {
                    selector.style.top = `${top - selector_padding}px`;
                    store.top = top;
                }

                if (height && height != store.height) {
                    selector.style.height = `${height + (selector_padding * 2)}px`;
                    store.height = height;
                }

                if (left && left != store.left) {
                    selector.style.left = `${left}px`;
                    store.left = left;
                }
            }

            async function idleSelector() {
                if (!ani) return;
                Object.assign(selector.style, {
                    transition: 'height .14s, top .14s, left .14s'
                });
            }

            function exit() {
                header_bar.classList.remove(bar_hide);
                footer_bar.classList.remove(bar_hide);
                if (header_bar.style.display == 'none') naviView();
                cover.remove();
            }
        }
        share.addEventListener('click', shareEvent);

        removeEvent(() => share.remove());
    }

    // ---

    if (dom_loaded) lineShareSystem();
    else window.addEventListener('DOMContentLoaded', lineShareSystem);

    // ---

    const findAl = el => el.classList.contains('line');

    function scrollDocTracking(share, viewer, selector, cancel, moveSelector, idleSelector, exit) {
        let idle = false;
        let line = null;

        /**
         * @param {Element} target 
         */
        function registerSelectorData(target) {
            if (!idle) {
                idle = true;
                idleSelector();
            }

            moveSelector({
                height: target.offsetHeight,
                top: target.offsetTop,
            });

            line = target.getAttribute('data-line');
        }

        /**
         * @param {PointerEvent} e 
         */
        const pointermoveEv = e => {
            const currentPosEls = document.elementsFromPoint(e.clientX, e.clientY);

            const findAlViewer = el => el == viewer;
            const target_viewer = currentPosEls.find(findAlViewer);

            if (!target_viewer) return;

            const target = document.elementsFromPoint(viewer.getBoundingClientRect().x + 5, e.clientY)
                .find(findAl);

            if (!target) return;

            registerSelectorData(target);
        }
        document.addEventListener('pointermove', pointermoveEv);

        /**
         * @param {PointerEvent} e 
         */
        const clickEv = e => {
            const selected_target = e.target;

            if (share.contains(selected_target) || share == selected_target) {
                return;
            }

            if (selected_target != selector) {
                const findAlViewer = el => el == viewer;
                const viewer_target = document.elementsFromPoint(e.clientX, e.clientY)
                    .find(findAlViewer);

                if (!viewer_target) {
                    // exitAll();
                    return;
                }

                const target = document.elementsFromPoint(viewer.getBoundingClientRect().x + 5, e.clientY)
                    .find(findAl);

                if (!target) return;

                registerSelectorData(target);
                return;
            }

            exitAll();
            copyUrl(location.origin + location.pathname + `?line=${line}`);
        }
        window.addEventListener('click', clickEv);


        /* Exit Event */

        /**
         * @param {KeyboardEvent} e 
         */
        const EscapeEv = e => {
            if (e.key == 'Escape') exitAll();
        }
        window.addEventListener('keydown', EscapeEv);

        
        function exitAll() {
            exit();
            document.removeEventListener('pointermove', pointermoveEv);
            window.removeEventListener('click', clickEv);
            window.removeEventListener('keydown', EscapeEv);
            window.removeEventListener('resize', exitAll);
            window.removeEventListener(npup.event.router, exitAll);
        }
        cancel.addEventListener('click', exitAll);
        window.addEventListener('resize', exitAll);
        window.addEventListener(npup.event.router, exitAll);
    }

    function pageDocTracking(share, viewer, selector, cancel, moveSelector, idleSelector, exit) {
        let idle = false;
        let clientY = NaN;

        /**
         * @param {Element} target 
         */
        function registerSelectorData(target, y = clientY) {
            
            moveSelector({
                height: target.offsetHeight,
                top: target.offsetTop,
            });

            if (!idle) {
                idle = true;
                idleSelector();
            }

            clientY = y;
        }

        /**
         * @param {PointerEvent} e 
         */
        const pointermoveEv = e => {
            const currentPosEls = document.elementsFromPoint(e.clientX, e.clientY);

            const findAlViewer = el => el == viewer;
            const target_viewer = currentPosEls.find(findAlViewer);

            if (!target_viewer) return;

            const target = document.elementsFromPoint(viewer.getBoundingClientRect().x + 5, e.clientY)
                .find(findAl);

            if (!target) return;

            registerSelectorData(target, e.clientY);
        }
        document.addEventListener('pointermove', pointermoveEv);

        /**
         * @param {PointerEvent} e 
         */
        const clickEv = e => {
            const selected_target = e.target;

            if (share.contains(selected_target) || share == selected_target) {
                return;
            }

            if (cancel == selected_target || cancel.contains(selected_target)) {
                exitAll();
                return;
            }

            const currentEls = document.elementsFromPoint(e.clientX, e.clientY);
            const arrowEl = currentEls.find(el => el.id == 'novel_drawing_right' || el.id == 'novel_drawing_left');
            switch (arrowEl?.id) {
                case 'novel_drawing_right': 
                    movePage('next');
                    return;

                case 'novel_drawing_left':
                    movePage('back');
                    return;
            }

            if (selected_target != selector) {
                const findAlViewer = el => el == viewer;
                const viewer_target = currentEls
                    .find(findAlViewer);

                if (!viewer_target) {
                    return;
                }

                const target = document.elementsFromPoint(viewer.getBoundingClientRect().x + 5, e.clientY)
                    .find(findAl);

                if (!target) return;

                registerSelectorData(target, e.clientY);
                return;
            }

            const line = document.elementsFromPoint(viewer.getBoundingClientRect().x + 5, clientY)
                .find(findAl);

            if (!line) {
                showAlert({ msg: '문단이 존재하지 않습니다.', type: 'error' });
                return;
            }

            exitAll();
            copyUrl(location.origin + location.pathname + `?line=${line.getAttribute('data-line')}`);
        }
        window.addEventListener('click', clickEv);


        /* Exit Event */

        /**
         * @param {KeyboardEvent} e 
         */
        const EscapeEv = e => {
            if (e.key == 'Escape') exitAll();
        }
        window.addEventListener('keydown', EscapeEv);

        
        function exitAll() {
            exit();
            document.removeEventListener('pointermove', pointermoveEv);
            window.removeEventListener('click', clickEv);
            window.removeEventListener('keydown', EscapeEv);
            window.removeEventListener('resize', exitAll);
            window.removeEventListener(npup.event.router, exitAll);
        }
        window.addEventListener('resize', exitAll);
        window.addEventListener(npup.event.router, exitAll);
    }
}
