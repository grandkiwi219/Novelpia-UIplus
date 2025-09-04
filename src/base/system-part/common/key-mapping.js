const keyMappingCa = npup.options.mapping.options;


keyMappingCa['quick-mapping-menu'].system = async function(r) {
    const qmm = `${npup.project.prefix.css}qmm`;

    const menu_base = document.createElement('div');
    menu_base.classList.add(`${qmm}-base`);

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

    Object.values(keyMappingCa).forEach(async op => {
        if (!op.tag?.quick_mapping_menu) return;

        /* if (op.key == 'move-mb' && engineChecker('페이지')) {
            if (storage_type = 'sync') {
                const ob = await storage.get(['origin-header', 'bottom-nav']);
                if (ob['origin-header'] || ob['bottom-nav'])
                    return;
            }
            else if (r['origin-header'] || r['bottom-nav'])
                return;
        } */

        const menu_touch = document.createElement('div');
        menu_touch.classList.add(`${qmm}-touch`);
        menu_touch.classList.add(`${qmm}-icon`);
        menu_touch.textContent = op.desc;
        menu_touch.setAttribute('value', op.key);
        menu_content.appendChild(menu_touch);
    });

    menu_menu.innerHTML = '' +
`<div class="npup-selector">
    <div class="npup-selector-value">
        <div class="npup-value-name">${keyMappingCa[this.key].values.find(v => v.value == r[this.key])?.name}</div>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2 14 14">
                <path d="M0 3 4 7.2 8 3 0 3" fill="black" stroke="rgb(145, 145, 145)" stroke-width=".5px" />
            </svg>
        </div>
    </div>
    <div class="npup-selector-list-wrap">
        <div class="npup-selector-list">
            ${keyMappingCa[this.key].values.map(v => {
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

    const comic_viewer = pathChecker('/comic_viewer/');
    
    if ((engineChecker('뷰어') || pathChecker('/viewer_collect/')) && !r[`${this.key}-viewer`])
        window.addEventListener('DOMContentLoaded', () => document.getElementById('footer_bar').appendChild(menu_base)),
        getCookie('DARKMODE') ? menu_base.style.filter = 'invert(1)' : 0;
    else if (comic_viewer && !r[`${this.key}-viewer`])
        window.addEventListener('DOMContentLoaded', () => document.getElementsByClassName('viewer_bottom')[0].appendChild(menu_base));
    else if (!r[`${this.key}-page`])
        menu_base.classList.add(`s_inv`), document.body.appendChild(menu_base);
    else 
        return;


    // 열림 닫힘
    let click_el_data = undefined;
    let click_el_cancel_data = undefined;

    const menuControl = (e) => {
        if (comic_viewer) { 
            const base = document.getElementsByClassName(`${qmm}-base`)[0];

            if (!base) return;

            if (!click_el_data)
                click_el_data = [...document.getElementsByClassName(`${qmm}-menu`), ...document.getElementsByClassName(`${qmm}`)];

            if (base.classList.contains('focus')) {
                if (!click_el_cancel_data) 
                    click_el_cancel_data = document.getElementsByClassName(`${qmm}-menu-cancel`);

                let cancel = false;
                for (let i = 0; i < click_el_cancel_data.length; i++)
                    if (click_el_cancel_data[i].contains(e.target)) {
                        base.classList.remove(`focus`);
                        cancel = true;
                        break;
                    }

                if (!cancel) {
                    let check = false;
                    for (let i = 0; i < click_el_data.length; i++)
                        if (click_el_data[i].contains(e.target)) {
                            check = true;
                            break;
                        }

                    if (!check) base.classList.remove(`focus`);
                }
            }
            else {
                for (let i = 0; i < click_el_data.length; i++) 
                    if (click_el_data[i].contains(e.target)) {
                        base.classList.add(`focus`);
                        break;
                    }
            }

            return;
        }

        if ((!menu_btn.contains(e.target) && !menu_menu.contains(e.target)) || menu_cancel.contains(e.target))
            return menu_base.classList.remove(`focus`);

        menu_base.classList.add(`focus`);
    }

    // 이벤트 실행
    const executeEvent = (e) => {
        const menu_touches = document.getElementsByClassName(`${qmm}-touch`);
        for (let i = 0; i < menu_touches.length; i++) {
            if (menu_touches[i].contains(e.target)) 
                return searchSystem(menu_touches[i].getAttribute('value'), 'common').system(r, { quick_mapping_menu: true });
        }
    }

    // 닫음
    const menuEsc = (e) => {
        if (e.key == 'Escape') {
            if (!comic_viewer) menu_base.classList.remove(`focus`);
            else document.getElementsByClassName(`${qmm}-base`)[0].classList.remove('focus');

            document.querySelectorAll(`.${npup.project.prefix.css}selector-value`).forEach(r => {
                r.parentElement.classList.remove(`${npup.project.prefix.css}selector-active`);
            });
        }
    }
    
    // 세팅 셀럭터 창 열림
    const openSelector = (e) => {
        document.querySelectorAll(`.${npup.project.prefix.css}selector-value`).forEach(r => {
            let is_click = r.contains(e.target);

            if (!is_click) return r.parentElement.classList.remove(`${npup.project.prefix.css}selector-active`);

            r.parentElement.classList.toggle(`${npup.project.prefix.css}selector-active`);
        });
    }

    // 세팅 셀럭터 크롬 스토리지 상호작용
    const interactionSelector = (e) => {
        document.querySelectorAll(`.${npup.project.prefix.css}selector-option`).forEach(r => {
            if (!r.contains(e.target)) return;

            let local_storage = this.settings?.local;
            let value = r.getAttribute('value');

            if (value == this.options[0]) {
                if (!comic_viewer) menu_base.remove();
                else document.getElementsByClassName(`${qmm}-base`)[0].remove();
            }

            let value_name = r.innerHTML;

            let ss_storage = local_storage == true ? local : storage;

            ss_storage.get([this.key]).then(() => {
                ss_storage.set({ [this.key]: value });
                html.setAttribute(`${npup.project.prefix.css}${this.key}`, value);
                menu_base.querySelector(`.${npup.project.prefix.css}value-name`).innerHTML = value_name;
            });
        });
    }

    const clickEvent = (e) => {
        menuControl(e);
        executeEvent(e);
        openSelector(e);
        interactionSelector(e);
    }

    document.addEventListener('click', clickEvent);
    document.addEventListener('keydown', menuEsc);

    removeEventForEngine(() => {
        menu_base.remove();
        document.removeEventListener('click', clickEvent);
        document.removeEventListener('keydown', menuEsc);
    });
}


keyMappingCa['after-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-next-item')[0].click();
},
{
    condition: () => { return engineChecker('뷰어'); }
});

keyMappingCa['before-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-bottom-item')[0].click();
},
{
    condition: () => { return engineChecker('뷰어'); }
});

keyMappingCa['ep-home'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-top-home')[0].click();
},
{
    condition: () => { return engineChecker('뷰어'); }
});

function clickDisplay() {
    document.getElementById('novel_drawing').click();
}

function clickVote() {
    document.getElementById('recommend_tap').children[0].click();
}

keyMappingCa['ep-comment'].system = keyMappingBase(r => {
    if (document.getElementById('header_bar').style.display != 'block')
        clickDisplay();

    let comment_display = false;
    if (document.getElementById('comment_box').style.display != 'none')
        comment_display = true;

    if (typeof html.getAttribute(`${npup.project.prefix.css}old-icon`) == 'string')
        document.getElementsByClassName('comment-ep')[0].click();
    else 
        document.getElementsByClassName('menu-bottom-item')[3].click();
},
{
    condition: () => { return engineChecker('뷰어'); }
});

keyMappingCa['ep-vote'].system = keyMappingBase(r => {
    const vote = document.getElementById('btn_episode_vote').src.includes('recommend_on');

    if (!vote) clickVote(), toastAlert({ msg: '추천을 완료하였습니다.' });
    else {
        if (document.getElementById('viewer-modal')) {
            document.getElementById('viewer-modal').getElementsByClassName('close-x')[0].click();
        } else if (document.getElementById('header_bar').style.display != 'block') {
            clickVote(), document.getElementById('novel_drawing').click();
        } else {
            clickVote();
        }
    }
},
{
    condition: () => { return engineChecker('뷰어'); }
});

keyMappingCa['move-mb'].system = keyMappingBase(async r => {
    let where_href;

    await storage.get(['nav-mybook']).then(r1 => {
        where_href = npup.options.nav.options['nav-mybook'].system(r1, true)?.href || '/';
    });

    location.href ='/mybook' + where_href;
});

keyMappingCa['page-dark'].system = keyMappingBase(r => {
    const result = toggleCookie('DARKMODE_S');

    useMode('다크모드', result, {
        condition: engineChecker('페이지')
    });
});

keyMappingCa['viewer-dark'].system = keyMappingBase(r => {
    const result = toggleCookie('DARKMODE');

    useMode('뷰어 다크모드', result, {
        condition: engineChecker('뷰어') || pathChecker(['/comic_viewer/', '/viewer_collect/'])
    });
});

keyMappingCa['secret'].system = keyMappingBase(r => {
    const result = toggleCookie('secret_mode');

    useMode('시크릿 모드', result, {
        handler: () => { if (result) localStorage.secret_alert = true; }
    });
});


function useMode(name, result, { condition = true, handler = () => {} }) {
    if (condition) {
        if (!navigator.onLine)
            toastAlert({ title: '네트워크', msg: '인터넷에 연결되어 있지 않아 새로고침되지 않습니다.', type: 'warn' });
        else if (navigator.connection?.type == 'cellular')
            toastAlert({ title: '모바일 데이터', msg: '모바일 데이터를 사용 중이므로 새로고침되지 않습니다.' });
        else {
            handler();
            location.reload();
            return;
        }
    }

    toastAlert({ title: name, msg: `${name}가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
}
