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
    const qmm = `${npup.project.prefix.css}qmm`;

    const menu_base = document.createElement('div');
    menu_base.classList.add(`${qmm}-base`);
    menu_base.classList.add(`s_inv`);

    const menu_wrap = document.createElement('div');
    menu_wrap.classList.add(`${qmm}-wrap`);

    const menu_btn = document.createElement('div');
    Object.assign(menu_btn, {
       className: `${qmm} ${qmm}-icon`,
    });
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

    const menu_menu = document.createElement('div');
    menu_menu.classList.add(`${qmm}-menu`);

    const menu_content = document.createElement('div');
    menu_content.classList.add(`${qmm}-menu-content`);

    const menu_cancel = document.createElement('div');
    menu_cancel.classList.add(`${qmm}-menu-cancel`);
    menu_cancel.innerHTML = ''
        + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20" height="20" stroke-width="2" stroke="#000" fill="none" stroke-linecap="round">'
            + '<path d="M5 5 L25 25 M5 25 L25 5" />'
        + '</svg>';

    Object.values(npup.options.mapping.options).forEach(op => {
        if (!op.tag?.quick_mapping_menu) return;

        const menu_touch = document.createElement('div');
        menu_touch.classList.add(`${qmm}-touch`);
        menu_touch.classList.add(`${qmm}-icon`);
        menu_touch.textContent = op.desc;
        menu_touch.setAttribute('key', op.key);
        menu_content.appendChild(menu_touch);
    });

    menu_menu.innerHTML = '' +
`<div class="npup-selector">
    <div class="npup-selector-value">
        <div class="npup-value-name">${npup.options.mapping.options[this.key].values.find(v => v.value == r[this.key])?.name}</div>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2 14 14">
                <path d="M0 3 4 7.2 8 3 0 3" fill="black" stroke="rgb(145, 145, 145)" stroke-width=".5px"></path>
            </svg>
        </div>
    </div>
    <div class="npup-selector-list-wrap">
        <div class="npup-selector-list">
            ${npup.options.mapping.options[this.key].values.map(v => {
                return `<div class="npup-selector-option" value="${v.value}">${v.name}</div>`;
            }).join('')}
        </div>
    </div>
</div>`;

    menu_menu.appendChild(menu_cancel);
    menu_menu.appendChild(menu_content);

    menu_wrap.appendChild(menu_btn);
    menu_base.appendChild(menu_wrap); 
    menu_base.appendChild(menu_menu);
    
    if (engineChecker('뷰어') || pathChecker('/viewer_collect/'))
        window.addEventListener('DOMContentLoaded', () => document.getElementById('header_bar').appendChild(menu_base));
    else if (pathChecker('/comic_viewer/'))
        window.addEventListener('DOMContentLoaded', () => document.getElementsByClassName('viewer_top')[0].appendChild(menu_base));
    else
        document.body.appendChild(menu_base);


    document.addEventListener('click', e => {
        if ((!menu_btn.contains(e.target) && !menu_menu.contains(e.target)) || menu_cancel.contains(e.target))
            return menu_base.classList.remove(`focus`);

        menu_base.classList.add(`focus`);
    });

    document.addEventListener('click', e => {
        const menu_touches = document.getElementsByClassName(`${qmm}-touch`);
        for (let i = 0; i < menu_touches.length; i++) {
            if (menu_touches[i].contains(e.target)) 
                return searchSystem(menu_touches[i].getAttribute('key'), 'common').system(r, true);
        }
    });


    // 세팅 셀렉터 스크립트
    // 세팅 셀럭터 창 열림
    document.addEventListener('click', (event) => {
        document.querySelectorAll('.npup-selector-value').forEach(r => {
            let is_click = r.contains(event.target);

            if (!is_click) return r.parentElement.classList.remove('npup-selector-active');

            r.parentElement.classList.toggle('npup-selector-active');
        });
    });

    // 세팅 셀렉처 창 닫힘
    document.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            document.querySelectorAll('.npup-selector-value').forEach(r => {
                r.parentElement.classList.remove('npup-selector-active')
            });
        }
    });

    // 세팅 셀럭터 크롬 스토리지 상호작용
    document.addEventListener('click', e => {
        document.querySelectorAll('.npup-selector-option').forEach(r => {
            if (!r.contains(e.target)) return;

            let local_storage = this.settings?.local;
            let value = r.getAttribute('value');

            if (value == this.options[0]) menu_base.remove();

            let value_name = r.innerHTML;

            let ss_storage = local_storage == true ? local : storage;

            ss_storage.get([this.key]).then(() => {
                ss_storage.set({ [this.key]: value });
                menu_menu.style.display = 'none';
                html.setAttribute(`${npup.project.prefix.css}${this.key}`, value);
                setTimeout(() => {
                    menu_menu.style.display = '';
                }, 100);
                menu_base.querySelector('.npup-value-name').innerHTML = value_name;
            });
        });
    });
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

    if (engineChecker('뷰어') || pathChecker(['/comic_viewer/', '/viewer_collect/'])) 
        location.reload();
    else 
        toastAlert({ title: '뷰어 다크모드', msg: `뷰어 다크모드가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
});

npup.options.mapping.options['secret'].system = keyMappingBase(r => {
    const result = toggleCookie('secret_mode');
    location.reload();
    if (result) localStorage.secret_alert = true;
}); 
