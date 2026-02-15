const headerCa = npup.options.header.options;

headerCa['adult'].system = function(r) {
    targetHandler(
        () => document.querySelector('.switch-adult'),
        (target) => {
            document.querySelectorAll('.s-logo').forEach(re => {
                let adult_button = target.cloneNode(true);
                adult_button.style = 'cursor: pointer;';

                re.esrender('afterend', adult_button);
            });
        },
        { redetect: 1 }
    );
}





headerCa['search'].system = function(r) {
    
    document.getElementsByClassName('header-search')[0]?.remove();

    const search_icon = document.createElement('div');
    search_icon.classList.add(`${npup.project.prefix.css}search-base`);

    search_icon.innerHTML = ''
        + `<form id="${npup.project.prefix.css}search-form" class="${npup.project.prefix.css}search-header" autocomplete="off">`
                + `<input id="search_input" class="${npup.project.prefix.css}search-box" type="text" name="search_box" placeholder="제목, 작가를 입력하세요." maxlength="50" autocomplete="off" value form="${npup.project.prefix.css}search-form">`
        + '</form>'
        + `<button type="button" class="${npup.project.prefix.css}search-align" onclick="javascript:npupPcSearch()">`
            +`<img src="//images.novelpia.com/img/new/header/icon_in_search.svg" alt="검색" class="${npup.project.prefix.css}search-icon">`
        + '</button>';

    targetHandler(
        () => document.getElementById('btn_alram'),
        (target) => target.esrender("beforebegin", search_icon),
        { redetect: 1 }
    );
}





headerCa['search-result'].system = function(r, generate) {
    if (pathChecker('/comic_search/')) return;

    const presr = npup.project.prefix.css + this.key;

    const result_box_wrap_key = `${presr}-wrap`;


    if (routing && !generate) { // 뒤로가기시 바로 업데이트가 되지 않는 문제 => 는 어쩔 수 없음
        return tryChecker(() => {
            // 혹시 모를 중복 생성으로 인한 검색 결과 미반영 해결책
            const result_box_wrap = document.getElementsByClassName(result_box_wrap_key)[0];

            if (!result_box_wrap/* [0] */ && !document.getElementsByClassName(presr)[0]) {
                /* l.nav, 다른 것들도 반영하는 것은 각 시스템별로 바디 부분에 npup- 를 삽입함으로써 이미 존재함을 증명시키게 할 것 */
                /* 그렇다해도 searchResultSystem 내부에 resultBoxContent가 삽입되어 있으니 이 부분은 삭제하지 말 것 */
                this.system(r, true);
            }
            else {
                searchResultBoxContent(result_box_wrap/* [result_box_wrap.length - 1] */);
            }
        }, '동적 검색 결과', '파츠'/* , mus */);
    }


    const result_box = document.createElement('div');
    result_box.classList.add(presr);

    const result_box_wrap = document.createElement('div');
    result_box_wrap.classList.add(result_box_wrap_key);

    searchResultBoxContent(result_box_wrap);

    result_box.appendChild(result_box_wrap);

    // 검색바 최소화 선택이 '안'되어 있을 시
    if (!r['nav'] && !r['search']) {
        const searcher = document.querySelector('div.header-top-wrapper > div.header-top > div:has(div.header-search)');
        // css 로 위치 변경
        //searcher.style = 'position: relative; width: 420px; height: 50px;';

        searcher.esrender(result_box);

        document.addEventListener('click', (e) => {
            let is_click = false;

            const header_search = document.getElementsByClassName('header-search');
            for (let i = 0; i < header_search.length; i++)
                if (header_search[i].contains(e.target)) is_click = true;

            const search_result = document.getElementsByClassName(presr);
            for (let i = 0; i < search_result.length; i++)
                if (search_result[i].contains(e.target)) is_click = true;

            if (!is_click) return document.getElementsByClassName(presr)[0].classList.remove(`${presr}-active`);

            document.getElementsByClassName(presr)[0].classList.add(`${presr}-active`);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') document.getElementsByClassName(presr)[0].classList.remove(`${presr}-active`);
        });

        // 검색바 최소화 선택이 되어 있을 시
    } else if (r['nav'] || r['search']) {
        targetHandler(
            () => document.getElementById(`${npup.project.prefix.css}search-form`),
            (target) => {
                target.classList.add(`${presr}-form`);
            
                result_box.classList.add(`${presr}-newtype`);
                target.esrender(result_box);
            },
            { redetect: 1 }
        );
    }

    searchResultRedirect();
    searchResultRemove();



    /**
     * 검색 결과 클릭 시 리다이렉트 함수
     * 동적 처리
     */
    function searchResultRedirect() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest(`.${presr}-word-wrap`);
            if (!target) return;

            let search_type = 'all';
            if (pathChecker('/search/novel_name/')) search_type = 'novel_name';
            else if (pathChecker('/search/writer_nick/')) search_type = 'writer_nick';
            else if (pathChecker('/search/novel_genre/')) search_type = 'novel_genre';

            location.href = '/search/' + search_type + '//1/' + target.firstChild.innerHTML.replace(/[\/%?,]/g, '') + '?page=1&rows=30&novel_type=&start_count_book=&end_count_book=&novel_age=&start_days=&sort_col=last_viewdate&novel_genre=&block_out=0&block_stop=0&is_contest=0&list_display=list';
        });
    }

    /**
     * result box wrap에 값을 넣는 함수
     * @param {HTMLElement} result_box_wrap 값이 들어갈 result box wrap
     */
    function searchResultBoxContent(result_box_wrap) {
        let words = JSON.parse(localStorage.search_novel_word || `[]`);

        const header = document.createElement('div');
        header.classList.add(`${presr}-header`);

        const header_title = document.createElement('div');
        Object.assign(header_title.style, {
            fontWeight: 'bold',
            fontSize: '18px',
            color: 'black'
        });
        header_title.textContent = '최근검색';

        header.appendChild(header_title);


        const items_wrap = document.createElement('div');
        items_wrap.classList.add(`${presr}-items`);

        if (words[0]) {
            const delete_all = document.createElement('div');
            delete_all.innerHTML = '잔체삭제';
            delete_all.id = `${presr}-delete-all`;

            header.appendChild(delete_all);


            words.forEach(b => {
                let word_wrap = document.createElement('div');
                word_wrap.classList.add(`${presr}-item`);

                let word = document.createElement('div');
                word.classList.add(`${presr}-word-wrap`);

                let word_p = document.createElement('p');
                word_p.classList.add(`${presr}-word`)
                word_p.innerHTML = b;

                word.appendChild(word_p);

                let delete_one = document.createElement('div');
                delete_one.classList.add(`${presr}-delete`);
                delete_one.innerHTML = '<img src="//images.novelpia.com/img/new/menu/novel/btn_remove_tag_3.svg">';

                word_wrap.appendChild(word);
                word_wrap.appendChild(delete_one);

                items_wrap.appendChild(word_wrap);
            });
        }
        else {
            const nothing = document.createElement('div');
            Object.assign(nothing.style, {
                padding: '20px 0',
                width: '100%',
                textAlign: 'center'
            });
            nothing.textContent = '최근 검색어가 없습니다.';
            items_wrap.appendChild(nothing);
        }

        result_box_wrap.esrender(header);
        result_box_wrap.esrender(items_wrap);
    }

    /**
     * 검색 결과 창에서 검색 결과 제거
     */
    function searchResultRemove() {
        const nothing = document.createElement('div');
        nothing.style = 'padding: 20px 0; width: 100%; text-align: center;';
        nothing.textContent = '최근 검색어가 없습니다.';

        const deleteBtn = (e) => {
            let target;

            document.querySelectorAll(`.${presr}-delete`).forEach(r => {
                if (r.contains(e.target))
                    target = r;
            });

            if (!target) return;

            localStorage.search_novel_word = JSON.stringify(JSON.parse(localStorage.search_novel_word)
                .filter(k => k != target.parentElement.firstChild.textContent));

            if (!JSON.parse(localStorage.search_novel_word)[0]) {
                const items = target.parentElement.parentElement;
                const wrap = items.parentElement;

                searchResultBoxContent(wrap);

                items.remove();
                return;
            }

            target.parentElement.remove();
        }

        const deleteAllBtn = (e) => {
            let target = document.getElementById(`${presr}-delete-all`);

            if (!target || !target.contains(e.target)) return;

            localStorage.search_novel_word = JSON.stringify([]);

            const wrap = target.parentElement.parentElement;

            searchResultBoxContent(wrap);

            target.remove();
        }

        document.addEventListener('click', deleteBtn);
        document.addEventListener('click', deleteAllBtn);

        removeEventForEngine(() => {
            document.removeEventListener('click', deleteBtn);
            document.removeEventListener('click', deleteAllBtn);
        });
    }
}





headerCa['alarm'].system = function(r, get_data = false) {

    let where_href = '/';

    switch (r[this.key]) {
        case 'novel': 
            where_href += 'novel';
            break;
        case 'comic':
            where_href += 'comic';
            break;
        case 'system': 
            where_href += 'system';
            break;
        case 'event':
            where_href += 'event';
            break;
        default:
            where_href = '';
    }

    if (get_data) return { href: where_href };

    targetHandler(
        () => document.getElementsByClassName('header-alert')[0],
        (target) => target.href += where_href
    );

    // mobile area
    targetHandler(
        () => document.getElementById('btn_m_alram'),
        () => {
            const m_alarm = document.querySelector('.bt-nv-menu:has(#btn_m_alram)');
            m_alarm.outerHTML = m_alarm.outerHTML.replace(/div/g, 'a').replace('a', `a href="/alarm${where_href}" style="color: black;"`);
        },
        { redetect: 1 }
    );
} 





headerCa['writer-room'].system = async function(r) {

    const generateWriterIcon = () => {
        const writer_wrap = document.createElement('a');
        writer_wrap.href = '/writer_room';
        writer_wrap.classList.add(`${npup.project.prefix.css}${this.key}`);
    
        const writer_icon = document.createElement('img');
        writer_icon.src = '//image.novelpia.com/img/new/menu/w/write.png';
        writer_icon.alt = '내작품';
    
        writer_wrap.appendChild(writer_icon);

        return writer_wrap;
    }

    targetHandler(
        () => document.getElementsByClassName('header-gift')[0],
        () => {
            const target = document.getElementsByClassName('header-gift');
            for (let i = 0; i < target.length; i++)
                target[i].esrender("afterend", generateWriterIcon());
        }
    );
}





headerCa['renew-alarm'].system = function(r) {
    const this_key = this.key;

    const pc_alarm_id = 'btn_alram';
    const m_alarm_id = 'btn_m_alram';

    const pc_alarm_dot_id = 'pc_alarm_dot';
    const m_alarm_dot_id = 'alarm_dot';

    const dot_class = 'red-dot';

    const loading_style = {
        width: '0%',
        height: '4px',
        borderRadius: '20px',

        backgroundColor: 'var(--novelpia-color)',

        position: 'absolute',
        left: '0',

        opacity: 1,
        transform: 'translateY(100%)',

        transition: 'width 2s'
    }

    const pc_loading_bottom = '-5px';
    const m_loading_bottom = '-19px';

    const loaded_width_transition = 110;
    const loaded_opacity_transition = 200;
    const loaded_opacity_transition_delay = loaded_width_transition + 380;
    const loaded_transition = `width ${loaded_width_transition}ms linear, opacity ${loaded_opacity_transition}ms ${loaded_opacity_transition_delay}ms, background-color .12s`;

    const path = '/proc/alarm';
    const data = {
        mode: 'getAlarmCnt'
    }

    let loading_elements = new Map();
    let num_key = 0;

    const period = 12;
    let cooltime = NaN;

    setCooltime();

    // ---

    let stack = 0;

    targetHandler(
        () => document.getElementById(pc_alarm_id),
        (target) => {
            target.style.position = 'relative';
            reloading({ bottom: pc_loading_bottom, el: target });
            renewAlarmSystem();
        }
    );

    targetHandler(
        () => document.getElementById(m_alarm_id),
        (target) => {
            reloading({ bottom: m_loading_bottom, el: target });
            renewAlarmSystem();
        }
    );

    function renewAlarmSystem() {
        stack++;
        if (stack == 2) {
            window.addEventListener('visibilitychange', visibilitychangeEvent);
            window.addEventListener('focus', focusEvent);
            window.addEventListener('pageshow', pageshowEvent);
        }
    }

    function reloading(loading_target) {
        if (isRestored())
            renewAlarm({
                confirm_cooltime: false,
                loading_targets: [loading_target]
            });
    }

    function cleanupFunction() {
        window.removeEventListener('visibilitychange', visibilitychangeEvent);
        window.removeEventListener('focus', focusEvent);
        window.removeEventListener('pageshow', pageshowEvent);
    }

    // ---

    function visibilitychangeEvent() {
        if (document.visibilityState != "visible") return;

        renewAlarm();
    }

    function focusEvent() {
        renewAlarm();
    }

    function pageshowEvent(event) {
        if (event.persisted) {
            renewAlarm({ confirm_cooltime: false });
        }
    }

    removeEventForEngine(cleanupFunction);

    // ---

    async function renewAlarm({ confirm_cooltime = true, loading_targets } = {}) {
        // 쿠키 존재 확인 대신 로그인되어 있으면 존재할 요소 확인
        if (!document.querySelector('.sidemenu-wrapper .sidemenu-profile'))
            return;

        if (confirm_cooltime && confirmCooltime()) return;

        setCooltime();

        removeExisting();

        const key = num_key++;

        await loading(key,
            loading_targets
            ? loading_targets
            : [
                { bottom: pc_loading_bottom, el: document.getElementById(pc_alarm_id) },
                { bottom: m_loading_bottom, el: document.getElementById(m_alarm_id) }
            ]
        );

        let response = {}

        try {
            response = await fetch(path, {
                method: 'post',
                headers: {},
                body: new URLSearchParams(data),
                cache: 'no-store',
            }).then(r => r.json());
        } catch (error) {
            npup.error(this_key + ':fetch-> ' + error);
            loadingFailed(key);
            await loaded(key);
            return;
        }

        if (Number(response?.status) != 200) {
            if (response?.errmsg)
                npup.error(response.errmsg);
            else
                npup.error(this_key + ':status-> ' + response?.status);
            loadingFailed(key);
            await loaded(key);
            return;
        }

        const { cnt = 0 } = response?.result;

        if (cnt !== 0) {
            generateDot();
        }

        loadingSuccess(key);
        await loaded(key);
    }

    function generateDot() {
        const pc_alarm = document.getElementById(pc_alarm_id);
        if (pc_alarm) {
            const dot = document.createElement('div');
            dot.id = pc_alarm_dot_id;
            dot.className = dot_class;

            pc_alarm.esrender(dot);
        }

        const m_alarm = document.getElementById(m_alarm_id);
        if (m_alarm) {
            const dot = document.createElement('span');
            dot.id = m_alarm_dot_id;
            dot.className = dot_class;

            m_alarm.esrender(dot);
        }
    }

    function removeExisting() {
        const pc_dot = document.getElementById(pc_alarm_dot_id);
        if (pc_dot) pc_dot.remove();
        const m_dot = document.getElementById(m_alarm_dot_id);
        if (m_dot) m_dot.remove();
    }

    // ---

    async function loading(key, targets) {

        const temp_loading_els = [];

        targets.forEach((target, i) => {
            const loading_el = document.createElement('div');
            loading_el.className = `${npup.project.prefix.css}${this.key}-loading`;

            temp_loading_els.push(loading_el);

            target.el.esrender(loading_el);

            Object.assign(loading_el.style, {
                ...loading_style,
                bottom: target.bottom
            });
        });

        loading_elements.set(key, temp_loading_els);

        return new Promise(resolve => {
            setTimeout(() => {
                loadStyle(key, {
                    width: '75%'
                });

                resolve();
            }, 50);
        });
    }
    
    function loadingSuccess(key) {
        loadStyle(key, {
            transition: loaded_transition
        });
    }
    
    function loadingFailed(key) {
        loadStyle(key, {
            backgroundColor: isDarkMode() ? '#00ffff' : '#ff0000',
            transition: loaded_transition
        });
    }

    function loadStyle(key, css_properties) {
        loading_elements.get(key).forEach(loading_el => {
            if (loading_el?.isConnected)
                Object.assign(loading_el.style, css_properties);
        });
    }

    async function loaded(key, delay = true) {

        if (delay) {
            loadStyle(key, {
                width: '100%',
                opacity: 0
            });
    
            await setDelay(loaded_opacity_transition + loaded_opacity_transition_delay);
        }

        (loading_elements.get(key) || []).forEach(loading_el => {
            if (loading_el?.isConnected)
                loading_el.remove();
        });

        loading_elements.delete(key);
    }

    // ---

    function confirmCooltime() {
        return cooltime > new Date().getTime();
    }

    function setCooltime() {
        const timestamp = new Date();

        timestamp.setMinutes(timestamp.getMinutes() + period);

        cooltime = timestamp.getTime();
    }
}
