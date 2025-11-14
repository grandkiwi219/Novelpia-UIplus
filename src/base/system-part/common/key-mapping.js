const keyMappingCa = npup.options.mapping.options;


keyMappingCa['quick-mapping-menu'].system = quickMappingMenuAsset((r, menu, comic_viewer) => {
    if ((engineChecker('뷰어') || pathChecker('/viewer_collect/')) && !r[`${this.key}-viewer`])
        window.addEventListener('DOMContentLoaded', () => document.getElementById('footer_bar').esrender(menu)),
        getCookie('DARKMODE') ? menu.style.filter = 'invert(1)' : 0;
    else if (comic_viewer && !r[`${this.key}-viewer`])
        window.addEventListener('DOMContentLoaded', () => document.getElementsByClassName('viewer_bottom')[0].esrender(menu));
    else if (!r[`${this.key}-page`])
        menu.classList.add(`s_inv`), document.body.esrender(menu);
    else
        return false;

    // need detect route

    return true;
},
{
    additional_categories: 'move'
});




keyMappingCa['after-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-next-item')[0].click();
}, isViewer);

keyMappingCa['before-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-bottom-item')[0].click();
}, isViewer);

keyMappingCa['ep-home'].system = keyMappingBase(r => {
    document.getElementsByClassName('menu-top-home')[0].click();
}, isViewer);

keyMappingCa['ep-comment'].system = keyMappingBase(r => {
    btnComment2();
}, isViewer);

keyMappingCa['ep-list'].system = keyMappingBase(r => {
    btnList2();
}, isViewer);

keyMappingCa['ep-vote'].system = keyMappingBase(r => {
    executeVote();
}, isViewer);

keyMappingCa['ep-like'].system = keyMappingBase(r => {
    executeLike();
}, isViewer);

keyMappingCa['ep-up'].system = keyMappingBase(r => {
    movePage('up');
}, isViewer);

keyMappingCa['ep-down'].system = keyMappingBase(r => {
    movePage('down');
}, isViewer);

keyMappingCa['ep-menu'].system = keyMappingBase(r => {
    naviView();
}, isViewer);

keyMappingCa['move-mb'].system = keyMappingBase(async r => {
    let where_href;

    await storage.get(['nav-mybook']).then(r1 => {
        where_href = npup.options.nav.options['nav-mybook'].system(r1, true)?.href || '/';
    });

    location.href ='/mybook' + where_href;
});

keyMappingCa['move-alarm'].system = keyMappingBase(async r => {
    let where_href;

    await storage.get(['alarm']).then(r1 => {
        where_href = npup.options.header.options['alarm'].system(r1, true)?.href || '/';
    });

    location.href ='/alarm' + where_href;
});

keyMappingCa['move-search'].system = keyMappingBase(r => {
    location.href ='/search';
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
