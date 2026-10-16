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


keyMappingCa['chat-home'].system = movePathPreset('/', true);

keyMappingCa['chat-feed'].system = movePathPreset('/feed/', true);

keyMappingCa['chat-chat'].system = movePathPreset('/chat/', true);

keyMappingCa['chat-favorite'].system = movePathPreset('/favorite/');

keyMappingCa['chat-ranking'].system = movePathPreset('/ranking/');

keyMappingCa['chat-collection'].system = movePathPreset('/collection/');

keyMappingCa['chat-search'].system = movePathPreset('/search/', true);

keyMappingCa['chat-profile'].system = movePathPreset('/profile/');

keyMappingCa['chat-alarm'].system = movePathPreset('/notification/');
