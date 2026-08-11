const keyMappingCa = npup.options.mapping.options;


keyMappingCa['chat-quick-mapping-menu'].system = quickMappingMenuAsset((r, menu, comic_viewer) => {
    const option = { ignore_class: 'focus' }

    if ((engineChecker('채팅')) && !r[`${this.key}-viewer`])
        window.addEventListener('DOMContentLoaded', () => document.getElementById('footer_bar').esrender(menu, option)),
        getCookie('DARKMODE') ? menu.style.filter = 'invert(1)' : 0;
    else if (comic_viewer && !r[`${this.key}-viewer`])
        window.addEventListener('DOMContentLoaded', () => document.getElementsByClassName('viewer_bottom')[0].esrender(menu, option));
    else if (!r[`${this.key}-page`])
        menu.classList.add(`s_inv`), html.esrender(menu, option);
    else
        return false;

    return true;
},
{
    additional_categories: 'move'
});


keyMappingCa['chat-home'].system = keyMappingBase(r => {
    if (pathChecker('/', { strict: true })) return;
    history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
});

keyMappingCa['chat-chat'].system = keyMappingBase(r => {
    if (pathChecker('/chat/', { strict: true })) return;
    history.pushState({}, '', '/chat');
    window.dispatchEvent(new PopStateEvent('popstate'));
});

keyMappingCa['chat-favorite'].system = keyMappingBase(r => {
    if (pathChecker('/favorite/')) return;
    history.pushState({}, '', '/favorite');
    window.dispatchEvent(new PopStateEvent('popstate'));
});

keyMappingCa['chat-ranking'].system = keyMappingBase(r => {
    if (pathChecker('/ranking/')) return;
    history.pushState({}, '', '/ranking');
    window.dispatchEvent(new PopStateEvent('popstate'));
});
