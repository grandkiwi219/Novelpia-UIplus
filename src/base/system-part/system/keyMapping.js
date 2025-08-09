function keyMappingBase(callback) {
    return function(r, quick_mapping_menu = false) {
        if (quick_mapping_menu) {
            const result = tryChecker(() => {
                callback(r);
            }, `<keyMappingBase - quick-mapping-menu> ${this.key}`, false);
            if (result.status != 2) toastAlert({
                    title: `오류 발생 | ${this.key}`,
                    msg: `'${this.description}' 기능 오류\n원인: ${result.error}`,
                    type: 'error'
                });
            return;
        }
        
        document.addEventListener('keydown', e => {
            const active = document.activeElement;

            if (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable
            ) return;

            const key_match = e.code != r[this.key].code && e.key != r[this.key].key;
            if (
                (key_match) ||
                (!key_match && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey))
            ) return

            e.preventDefault();

            const result = tryChecker(() => {
                callback(r);
            }, `<keyMappingBase> ${this.key}`, false);

            if (result.status != 2) toastAlert({
                    title: `오류 발생 | ${this.key}`,
                    msg: `'${this.description}' 기능 오류\n원인: ${result.error}`,
                    type: 'error'
                });
        });
    }
}

npup.options.mapping.options['quick-mapping-menu'].system = function(r) {
    const menu_wrap = document.createElement('div');
    menu_wrap.classList.add(`${npup.project.prefix.css}qmm-wrap`);
    menu_wrap.classList.add(`s_inv`);

    const menu_btn = document.createElement('div');
    menu_btn.classList.add(`${npup.project.prefix.css}qmm`); 
    const list_color = 'black';
    menu_btn.innerHTML = ``
        + `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">`
            + `<circle cx="4" cy="6" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="5" width="13" height="2" rx="1" fill="${list_color}" />`

            + `<circle cx="4" cy="12" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="11" width="13" height="2" rx="1" fill="${list_color}" />`

            + `<circle cx="4" cy="18" r="1.5" fill="${list_color}" />`
            + `<rect x="7" y="17" width="13" height="2" rx="1" fill="${list_color}" />`
        + `</svg>`;

    menu_wrap.appendChild(menu_btn);    
    document.body.appendChild(menu_wrap);
}

npup.options.mapping.options['after-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-next-item')[0].click();
});

npup.options.mapping.options['before-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-bottom-item')[0].click();
});

npup.options.mapping.options['ep-home'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-top-home')[0].click();
});

npup.options.mapping.options['ep-comment'].system = keyMappingBase(r => {
/*     if (document.getElementById('header_bar').style.display != 'block')
        document.getElementById('novel_drawing').click();

    let comment_display = false;
    if (document.getElementById('comment_box').style.display != 'none')
        comment_display = true; */

    if (r['old-icon']) 
        document.getElementsByClassName('comment-ep')[0].click();
    else 
        document.getElementsByClassName('menu-bottom-item')[3].click();
/* 
    if (comment_display)
        setTimeout(() => document.getElementById('novel_drawing').click(), 100); */
});

npup.options.mapping.options['move-mb'].system = keyMappingBase(async r => {
    let where_href;

    if (STRUCTURE.SYSTEM.ENGINE.name == '페이지')
        where_href = npup.options.nav.options['nav-mybook'].system(r, true).href;
    else {
        await storage.get(['nav-mybook']).then(r1 => {
            where_href = npup.options.nav.options['nav-mybook'].system(r1, true).href;
        });
    }

    location.href ='https://novelpia.com/mybook' + where_href;
});


function setCookie(name, value, options = {}) {
    const {
        expires = null,
        path = '/',
        domain = '',
        secure = false,
        sameSite = ''
    } = options;

    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
        const date = new Date();
        date.setTime(date.getTime() + (expires * 86400000));
        cookieStr += `; expires=${date.toUTCString()}`;
    }

    if (path) cookieStr += `; path=${path}`;
    if (domain) cookieStr += `; domain=${domain}`;
    if (secure) cookieStr += `; secure`;
    if (sameSite) cookieStr += `; samesite=${sameSite}`;

    document.cookie = cookieStr;
}

function removeCookie(name, options = {}) {
    const {
        path = '/',
        domain = ''
    } = options;

    let cookieStr = `${encodeURIComponent(name)}=null; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    if (path) cookieStr += `; path=${path}`;
    if (domain) cookieStr += `; domain=${domain}`;

    document.cookie = cookieStr;
}

function getCookie(name) {
    const encodedName = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        if (cookie.startsWith(encodedName)) {
            return decodeURIComponent(cookie.slice(encodedName.length));
        }
    }

    return null; // 쿠키가 존재하지 않을 경우
}

function hasCookie(name) {
    const encodedName = encodeURIComponent(name) + "=";
    return document.cookie.split('; ').some(cookie => cookie.startsWith(encodedName));
}

const base_domain = '.novelpia.com';

function toggleCookie(name, domain = base_domain) {
    if (getCookie(name)) {
        removeCookie(name, {path: '/', domain: domain});
        return false;
    } else {
        setCookie(name, 1, { expires: 365, path: '/', domain: domain});
        return true;
    }
}

npup.options.mapping.options['page-dark'].system = keyMappingBase(r => {
    const result = toggleCookie('DARKMODE_S');

    if (engineChecker('페이지')) 
        location.reload();
    else 
        toastAlert({ title: '다크모드', msg: `다크모드가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
});

npup.options.mapping.options['viewer-dark'].system = keyMappingBase(r => {
    const result = toggleCookie('DARKMODE');

    if (engineChecker('뷰어')) 
        location.reload();
    else 
        toastAlert({ title: '뷰어 다크모드', msg: `뷰어 다크모드가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
});

npup.options.mapping.options['secret'].system = keyMappingBase(r => {
    const result = toggleCookie('secret_mode');
    location.reload();
    if (result) localStorage.secret_alert = true;
});
