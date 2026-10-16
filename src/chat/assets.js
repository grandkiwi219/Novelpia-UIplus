const isChat = { condition: () => engineChecker('채팅') }

function movePathPreset(path = '/', strict = false) {

    return keyMappingBase(r => {
        if (pathChecker(path, { strict })) return;
        history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    });
}