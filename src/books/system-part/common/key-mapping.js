const keyMappingCa = npup.options.mapping.options;


keyMappingCa['books-quick-mapping-menu'].system = quickMappingMenuAsset((r, menu, comic_viewer) => {
    if ((engineChecker('뷰어')) && !r[`${this.key}-viewer`]) {
        if (routing) {
            appendMenu();
        }
        else {
            let menu_exist = false;
            
            const menuRegen = () => {
                if (!document.contains(menu)) {
                    appendMenu();
                }
                else {
                    if (document_status >= 3) {
                        menu_exist = true;
                        window.removeEventListener('click', menuRegen);
                    }
                }
            }

            document.addEventListener('click', menuRegen);

            removeEventForEngine(() => {
                if (!menu_exist) document.removeEventListener('click', menuRegen);
            });
        }

        function appendMenu() {
            document.getElementsByClassName('viewer-bottom-wrapper')[0].appendChild(menu);
        }
    }
    else if (!r[`${this.key}-page`])
        document.body.appendChild(menu);
    else 
        return false;

    return true;
});


keyMappingCa['books-after-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('viewer-btn-next')[0].click();
},
{
    condition: () => engineChecker('뷰어')
});

keyMappingCa['books-before-ep'].system = keyMappingBase(r => {
    document.getElementsByClassName('viewer-btn-prev')[0].click();
},
{
    condition: () => engineChecker('뷰어')
});

keyMappingCa['books-ep-home'].system = keyMappingBase(r => {
    document.getElementsByClassName('viewer-btn-back')[0].click();
},
{
    condition: () => engineChecker('뷰어')
});

keyMappingCa['books-move-mb'].system = keyMappingBase(async r => {
    window.history.pushState({}, '', '/mybook');
    window.dispatchEvent(new PopStateEvent('popstate'));
});


let books_dark = {
    id: `${npup.project.prefix.css}books-dark`
}

keyMappingCa['books-page-dark'].system = keyMappingBase(r => {
    const result = setBooksDark('페이지', 'npup_books_page_dark');
    if (!engineChecker('페이지')) toastAlert({ title: '다크모드', msg: `다크모드가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
});

keyMappingCa['books-viewer-dark'].system = keyMappingBase(r => {
    const result = setBooksDark('뷰어', 'npup_books_viewer_dark');
    if (!engineChecker('뷰어')) toastAlert({ title: '뷰어 다크모드', msg: `뷰어 다크모드가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
});


function setBooksDark(engine_name, local_key) {
    let result;

    try {
        result = JSON.parse(localStorage.getItem(local_key));
    } catch (e) {
        result = false;
    }

    if (result) {
        if (engineChecker(engine_name)) {
            html.classList.remove(books_dark.id);
        }
        localStorage.removeItem(local_key);
    }
    else {
        if (engineChecker(engine_name)) html.classList.add(books_dark.id);
        localStorage.setItem(local_key, JSON.stringify(!result));
    }

    return !result;
}
