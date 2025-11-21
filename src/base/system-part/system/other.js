const otherCa = npup.options.other.options;

otherCa['notice'].system = function(r) {
    if (window.location.pathname != "/") return;
    
    targetHandler(() => document.getElementById('copyright_bar'), () => setNotice(), { redetect: 1 });

    function setNotice() {
        const notice_bar = document.getElementById('copyright_bar').cloneNode(true);
        notice_bar.id = `${npup.project.prefix.css}${notice_bar.id}`;
        const main = document.getElementById('vue_main_wrapper');

        // system-content.css => notice css
        notice_bar.classList.add(`${npup.project.prefix.css}notice`);
        notice_bar.style = "";

        notice_bar.firstElementChild.firstElementChild.classList.remove('justify-content-start');
        notice_bar.firstElementChild.firstElementChild.classList.add('justify-content-between');

        const notice_list_btn = document.createElement('a');
        notice_list_btn.classList.add('d-flex');
        notice_list_btn.classList.add('align-items-center');
        notice_list_btn.classList.add('s_inv');
        notice_list_btn.href = `/notice/list/1`;
        setListIcon(notice_list_btn, { color: '#000' });

        notice_bar.firstElementChild.firstElementChild.appendChild(notice_list_btn);
    
        main.esrender("beforebegin", notice_bar);
    }
}





otherCa['new-alarm'].system = function(r) {
    if (!pathChecker('/alarm/')) return;

    const newAlarmSystem = (target) => {
        const active_counter = Number(target?.textContent);

        npup.dev('active_counter:', active_counter);

        if (!active_counter) return;

        const active_alarm = '' +
`
.note-editor > .alarm_box:nth-child(-n + ${active_counter}) {
    border: 1px solid var(--novelpia-color);
}
`;

        const new_alarm_style = styleInjection(npup.project.prefix.css + this.key, active_alarm);

        npup.dev(new_alarm_style);

        removeEvent(() => {
            new_alarm_style.remove();
        });
    }

    targetHandler(
        () => document.querySelector('.menu_alarm td.active .menu-counter'),
        (target) => newAlarmSystem(target)
    );
}





otherCa['last-ep'].system = async function(r) {
    let cooltime = null;
    let freeze = false;
    let data = undefined;

    updateCooltime();
    updateData();
    
    // system-content.css => last episode alarm

    const last_ep_alarm = document.createElement('last-ep-alarm');
    // last_ep_alarm.classList.add('last-ep-alarm');
    last_ep_alarm.classList.add('s_inv'); // novelpia dark class
    last_ep_alarm.style.display = 'none';
    setAlarmState(pathChecker);

    const off = document.createElement('div');
    off.classList.add('last-ep-off');
    off.innerHTML = ''
        + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20" height="20" stroke-width="2" stroke="#000" fill="none" stroke-linecap="round">'
            + '<path d="M5 5 L25 25 M5 25 L25 5" />'
        + '</svg>';

    const content = document.createElement('div');
    content.classList.add('last-ep-content');
    
    const content_text = document.createElement('div');
    setContinueContent();

    const redirect_wrap = document.createElement('div');
    redirect_wrap.classList.add('last-ep-redirect-wrap');

    const redirect = document.createElement('a');
    redirect.classList.add('last-ep-redirect');
    setRedirectEp();

    const redirect_content = document.createElement('div');
    setRedirectEpContent();

    const redirect_list = document.createElement('a');
    redirect_list.classList.add('last-ep-redirect');
    redirect_list.classList.add('last-ep-list');
    setListIcon(redirect_list);
    setRedirectNovel();


    content.appendChild(off);
    content.appendChild(content_text);

    redirect.appendChild(redirect_content);
    redirect_wrap.appendChild(redirect_list);
    redirect_wrap.appendChild(redirect);

    last_ep_alarm.appendChild(content);
    last_ep_alarm.appendChild(redirect_wrap);

    lastEpEsrender();

    if (data && !freeze) {
        if (r['last-ep-home']) {
            if (location.pathname == '/' || document.getElementsByClassName('new-top-header2')[0]) onEvent();
        } else onEvent();
    }
    
    off.addEventListener('click', offClickEvent);

    const routerEvent = (e) => {
        if (e.detail?.engine_is_changed) return;

        if (!document.documentElement.contains(last_ep_alarm))
            lastEpEsrender();

        if (updateData()) {
            setAlarmState(e.detail?.pathChecker || pathChecker);
            setContinueContent();
            setRedirectEp();
            setRedirectEpContent();
            setRedirectNovel();
        }
        updateCooltime();

        if (data && !freeze) {
            if (r[`last-ep-home`]) {
                if (location.pathname == '/' || document.getElementsByClassName('new-top-header2')[0]) onEvent();
                else offEvent();
            } else onEvent();
        } else offEvent();
    }
    window.addEventListener(npup.event.router, routerEvent);

    removeEventForEngine(() => {
        offEvent(true);
        off.removeEventListener('click', offClickEvent);
        window.removeEventListener(npup.event.router, routerEvent);
    });


    function lastEpEsrender() {
        document.documentElement.esrender(last_ep_alarm, { ignore_class: 'active' });
    }

    function updateData() {
        let current_data = data;
        try {
            data = JSON.parse(localStorage.last_episode);
            if (data?.href?.novel == current_data?.href?.novel)
                return true;
            else 
                return false;
        } catch (e) {
            data = undefined;
            npup.log('알림을 사용할 최근 본 화 기록이 존재하지 않습니다.');
            return true;
        }
    }

    function updateCooltime() {
        try {
            cooltime = JSON.parse(localStorage.last_episode_timestamp);
        } catch (error) {
            cooltime = null;
        }

        const current = new Date().getTime();

        if (cooltime > current) {
            freeze = true;

            const remaining = cooltime - current;
            const seconds = Math.floor(remaining / 1000) % 60;
            const minutes = Math.floor(remaining / (1000 * 60)) % 60;
            const hours = Math.floor(remaining / (1000 * 60 * 60));

            npup.log(`알림 쿨타임 남은 시간: ${hours ? `${hours}시간 ` : ''}${minutes ? `${minutes}분 ` : ''}${seconds}초`);
        }
        else {
            localStorage.removeItem('last_episode_timestamp');
        }
    }


    function setAlarmState(getPathChecker) {
        if (getPathChecker('/novel/')) last_ep_alarm.classList.add('novel-page');
        else last_ep_alarm.classList.remove('novel-page');

        if (data?.adult) last_ep_alarm.classList.add('adult');
        else last_ep_alarm.classList.remove('adult');
    }

    function setContinueContent() {
        content_text.innerHTML = `<p><b>${data?.novel || '소설 제목'}</b></p>`
            + `<p><b>${data?.ep ?? 'EP.?'}</b> <span style="font-weight: 400;">${data?.title || '회차 제목'}</span></p>`
            + `(을)를 이어보시겠습니까?`;
    }

    function setRedirectEp() {
        redirect.href = data?.href?.novel ?? '#';
    }

    function setRedirectEpContent() {
        redirect_content.innerHTML = `<b>${data?.ep || 'EP.?'}</b>&nbsp;이어보기`;
    }

    function setRedirectNovel() {
        redirect_list.href = data?.href?.list ?? '#';
    }


    function onEvent() {
        last_ep_alarm.style.display = '';
        setTimeout(() => {
            last_ep_alarm.classList.add('active');
        }, 0.1);
    }

    function offEvent(remove = false) {
        last_ep_alarm.classList.remove('active');
        setTimeout(() => {
            if (remove) last_ep_alarm.remove();
            else last_ep_alarm.style.display = 'none';
        }, 500); 
    }

    function offClickEvent() {
        offEvent();

        const timestamp = new Date();

        const add_time = Number(r['last-ep-cooltime'] || 30);

        timestamp.setMinutes(timestamp.getMinutes() + add_time);

        localStorage.last_episode_timestamp = JSON.stringify(timestamp.getTime());
    }
}
