const keyMappingCa = npup.options.mapping.options;


keyMappingCa['quick-mapping-menu'].system = quickMappingMenuAsset((r, menu, comic_viewer) => {
    if ((engineChecker('뷰어') || pathChecker('/viewer_collect/')) && !r[`${this.key}-viewer`])
        window.addEventListener('DOMContentLoaded', () => document.getElementById('footer_bar').appendChild(menu)),
        getCookie('DARKMODE') ? menu.style.filter = 'invert(1)' : 0;
    else if (comic_viewer && !r[`${this.key}-viewer`])
        window.addEventListener('DOMContentLoaded', () => document.getElementsByClassName('viewer_bottom')[0].appendChild(menu));
    else if (!r[`${this.key}-page`])
        menu.classList.add(`s_inv`), document.body.appendChild(menu);
    else
        return false;

    // need detect route

    return true;
});


keyMappingCa['after-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-next-item')[0].click();
},
{
    condition: () => engineChecker('뷰어')
});

keyMappingCa['before-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-bottom-item')[0].click();
},
{
    condition: () => engineChecker('뷰어')
});

keyMappingCa['ep-home'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-top-home')[0].click();
},
{
    condition: () => engineChecker('뷰어')
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
    condition: () => engineChecker('뷰어')
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
    condition: () => engineChecker('뷰어')
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
        handler: () => { localStorage.npup_secret_alert = result ? true : false; }
    });
});


function useMode(name, result, { condition = true, handler = () => {} } = {}) {
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
