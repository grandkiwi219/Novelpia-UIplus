const keyMappingCa = npup.options.mapping.options;


keyMappingCa['books-quick-mapping-menu'].system = quickMappingMenuAsset((r, menu, comic_viewer) => {
    if ((engineChecker('뷰어')) && !r[`${this.key}-viewer`]) {
        let menu_exist = false;

        const menuRegen = () => {
            if (!document.contains(menu)) {
                appendMenu();
            }
            else {
                if (document_status >= 3) {
                    menu_exist = true;
                    document.removeEventListener('click', menuRegen);
                }
            }
        }

        document.addEventListener('click', menuRegen);

        removeEventForEngine(() => {
            if (!menu_exist) document.removeEventListener('click', menuRegen);
        });

        function appendMenu() {
            const bottom = document.getElementsByClassName('viewer-bottom-wrapper')[0]
            if (bottom) bottom.appendChild(menu);
        }
    }
    else if (!r[`${this.key}-page`])
        document.body.appendChild(menu);
    else 
        return false;

    return true;
},
{
    additional_categories: 'move'
});


keyMappingCa['books-after-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('viewer-btn-next')[0].click();
}, isViewer);

keyMappingCa['books-before-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('viewer-btn-prev')[0].click();
}, isViewer);

keyMappingCa['books-ep-home'].system = keyMappingBase(r => {
    document.getElementsByClassName('viewer-btn-back')[0].click();
}, isViewer);

keyMappingCa['books-move-mb'].system = keyMappingBase(async r => {
    if (pathChecker('/mybook/', { strict: true })) return;

    window.history.pushState({}, '', '/mybook');
    window.dispatchEvent(new PopStateEvent('popstate'));
});

keyMappingCa['books-move-search'].system = keyMappingBase(r => {
    if (pathChecker('/search/', { strict: true })) return;

    window.history.pushState({}, '', '/search');
    window.dispatchEvent(new PopStateEvent('popstate'));
});

keyMappingCa['books-page-dark'].system = keyMappingBase(r => {
    const result = setBooksDark('페이지', 'npup_books_page_dark');
    if (!engineChecker('페이지')) toastAlert({ title: '다크모드', msg: `다크모드가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
});

keyMappingCa['books-viewer-dark'].system = keyMappingBase(r => {
    const result = setBooksDark('뷰어', 'npup_books_viewer_dark');
    if (!engineChecker('뷰어')) toastAlert({ title: '뷰어 다크모드', msg: `뷰어 다크모드가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
});
