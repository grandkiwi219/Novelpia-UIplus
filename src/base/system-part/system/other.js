/** system: other */
npup.options.other.options['notice'].system = function(r) {
    if (!r[this.key]) return;
    if (window.location.pathname != "/") return;

    window.addEventListener("DOMContentLoaded", () => {
        let notice_bar = document.getElementById('copyright_bar').cloneNode(true);
        notice_bar.id = `${npup.project.prefix.css}${notice_bar.id}`;
        let main = document.getElementById('vue_main_wrapper');

        // system-content.css => notice css
        notice_bar.classList.add(`${npup.project.prefix.css}notice`);
        notice_bar.style = "";

        notice_bar.firstElementChild.firstElementChild.classList.remove('justify-content-start');
        notice_bar.firstElementChild.firstElementChild.classList.add('justify-content-between');

        let notice_list_btn = document.createElement('a');
        notice_list_btn.classList.add('d-flex');
        notice_list_btn.classList.add('align-items-center');
        notice_list_btn.classList.add('s_inv');
        notice_list_btn.href = `/notice/list/1`;

        const list_color = '#000';
        notice_list_btn.innerHTML = ``
        + `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">`
            + `<circle cx="4" cy="6" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="5" width="13" height="2" rx="1" fill="${list_color}" />`

            + `<circle cx="4" cy="12" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="11" width="13" height="2" rx="1" fill="${list_color}" />`

            + `<circle cx="4" cy="18" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="17" width="13" height="2" rx="1" fill="${list_color}" />`
        + `</svg>`;

        notice_bar.firstElementChild.firstElementChild.appendChild(notice_list_btn);
    
        main.insertAdjacentElement("beforebegin", notice_bar);
    });
}





npup.options.other.options['last-ep'].system = async function(r) {
    if (!r[this.key]) return;
    if (r['last-ep-home'] && window.location.pathname != "/") return;

    const last_ep_timestamp = 'last-ep-timestamp';

    let cooltime = false;

    await local.get([last_ep_timestamp]).then(rt => {
        cooltime = rt[last_ep_timestamp];
    });

    const current = new Date().getTime()

    if (cooltime > current) {
        const remaining = cooltime - current; 

        const seconds = Math.floor(remaining / 1000) % 60;
        const minutes = Math.floor(remaining / (1000 * 60)) % 60;
        const hours = Math.floor(remaining / (1000 * 60 * 60));

        return npup.log(`알림 쿨타임 남은 시간: ${hours}시간 ${minutes}분 ${seconds}초`);
    }

    const data = JSON.parse(localStorage.last_episode); 
    
    // system-content.css => last episode alarm

    const last_ep_alarm = document.createElement('div');
    last_ep_alarm.classList.add('last-ep-alarm'); 
    if (pathChecker('/novel/')) last_ep_alarm.classList.add('novel-page');
    last_ep_alarm.classList.add('s_inv'); // novelpia dark class

    const off = document.createElement('div');
    off.classList.add('last-ep-off');
    off.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20" height="20" stroke-width="2" stroke="#000" fill="none" stroke-linecap="round">'
            + '<path d="M5 5 L25 25 M5 25 L25 5" />'
        + '</svg>';

    const content = document.createElement('div');
    content.classList.add('last-ep-content');
    
    const content_text = document.createElement('div');
    content_text.innerHTML = `<p><b>${data?.novel || '소설 제목'}</b></p>`
        + `<p><b>${data?.ep || 'EP.?'}</b> <span style="font-weight: 400;">${data?.title || '회차 제목'}</span></p>`
        + `(을)를 이어보시겠습니까?`;

    const redirect_wrap = document.createElement('div');
    redirect_wrap.classList.add('last-ep-redirect-wrap');

    const redirect = document.createElement('a');
    redirect.classList.add('last-ep-redirect');
    redirect.href = data?.href?.novel || '#';

    const list_color = '#fff';

    const redirect_list = document.createElement('a');
    ['last-ep-redirect', 'last-ep-list'].forEach(cl => redirect_list.classList.add(cl));
    redirect_list.innerHTML = ``
        + `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">`
            + `<circle cx="4" cy="6" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="5" width="13" height="2" rx="1" fill="${list_color}" />`

            + `<circle cx="4" cy="12" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="11" width="13" height="2" rx="1" fill="${list_color}" />`

            + `<circle cx="4" cy="18" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="17" width="13" height="2" rx="1" fill="${list_color}" />`
        + `</svg>`;
    redirect_list.href = data?.href?.list || '#';
    
    const redirect_content = document.createElement('div');
    redirect_content.innerHTML = `<b>${data?.ep || 'EP.?'}</b>&nbsp;이어보기`;

    content.appendChild(off);
    content.appendChild(content_text);

    redirect.appendChild(redirect_content);
    redirect_wrap.appendChild(redirect_list);
    redirect_wrap.appendChild(redirect);

    [content, redirect_wrap].forEach(el => {
        last_ep_alarm.appendChild(el);
    });

    document.body.appendChild(last_ep_alarm);

    if (data?.adult) last_ep_alarm.classList.add('adult');

    setTimeout(() => {
        last_ep_alarm.classList.add('active');
    }, 0.01);
    
    off.addEventListener('click', () => {
        last_ep_alarm.classList.remove('active');
        setTimeout(() => {
            last_ep_alarm.style.display = 'none';
        }, 500);

        const timestamp = new Date();

        const add_time = Number(r['last-ep-cooltime'] ?? 30);

        timestamp.setMinutes(timestamp.getMinutes() + add_time);

        local.set({ [last_ep_timestamp]: timestamp.getTime() });
    });
}
