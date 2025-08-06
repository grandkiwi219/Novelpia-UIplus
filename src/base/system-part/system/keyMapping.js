function keyMappingBase(key, callback) {
    return function(r) {
        document.addEventListener('keydown', e => {
            const active = document.activeElement;

            if (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable
            ) return;

            if (e.code != r[key].code) 
                if (e.key != r[key].key) return;

            e.preventDefault();

            tryChecker(() => {
                callback(r);
            }, `<keyMappingBase> ${key}`, false);
        });
    }
}

npup.options.mapping.options['after-ep'].system = keyMappingBase('after-ep', r => {
    document.getElementsByClassName('menu-next-item')[0].click();
});

npup.options.mapping.options['before-ep'].system = keyMappingBase('before-ep', r => {
    document.getElementsByClassName('menu-bottom-item')[0].click();
});

npup.options.mapping.options['ep-home'].system = keyMappingBase('ep-home', r => {
    document.getElementsByClassName('menu-top-home')[0].click();
});

npup.options.mapping.options['move-mb'].system = keyMappingBase('move-mb', async r => {
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
        days = null,
        path = '/',
        domain = '',
        secure = false,
        sameSite = ''
    } = options;

    let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 86400000));
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

function hasCookie(name) {
    const encodedName = encodeURIComponent(name) + "=";
    return document.cookie.split('; ').some(cookie => cookie.startsWith(encodedName));
}

const base_domain = '.novelpia.com';

function toggleCookie(name, domain = base_domain) {
    if (hasCookie(name)) {
        removeCookie(name, { path: '/', domain: domain });
        return false;
    } else {
        setCookie(name, 1, { expires: 365, path: '/' ,domain: domain});
        return true;
    }
}

npup.options.mapping.options['page-dark'].system = keyMappingBase('page-dark', r => {
    const result = toggleCookie('DARKMODE_S');

    if (STRUCTURE.SYSTEM.ENGINE.name == '페이지') 
        location.reload();
    else 
        npup.func.toastAlert({ title: '다크모드', msg: `다크모드가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
});

npup.options.mapping.options['viewer-dark'].system = keyMappingBase('viewer-dark', r => {
    const result = toggleCookie('DARKMODE');

    if (STRUCTURE.SYSTEM.ENGINE.name == '뷰어') 
        location.reload();
    else 
        npup.func.toastAlert({ title: '뷰어 다크모드', msg: `뷰어 다크모드가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
});
