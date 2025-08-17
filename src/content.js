npup.log('노벨피아를 감지했습니다.');



// ready start
function ready(settings = { router: false }) {
    npup.log('ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ');

    STRUCTURE.SWITCH.ENGINE.on(settings);

    STRUCTURE.SELECTOR.ENGINE.on(settings);

    STRUCTURE.CUSTOM.ENGINE.on(settings);

    // --- Head Common Engine ---
    STRUCTURE.PRE_COMMON.ENGINE.on(settings);

    // --- body checker ---
    if (document.body) {
        start(settings);
    } else {
        new MutationObserver((mus, ob) => {
            for (const mu of mus) for (const node of mu.addedNodes)
                if (node.localName === 'body') {
                    start(settings);

                    return ob.disconnect();
                }
        }).observe(html, { childList: true });
    }

    if (routing) return;

    // --- initial-setup injection ---
    scriptInjection('src/npup.js');
}

function start(settings) {
    // --- Body Common Engine ---
    STRUCTURE.COMMON.ENGINE.on(settings);

    // --- System Engine ---
    if (!STRUCTURE.SYSTEM.ENGINE.name) npup.dev('개별 엔진이 존재하지 않는 페이지입니다. 본 페이지에서는 노벨피아 UI+를 이용할 수 없습니다.');
    else STRUCTURE.SYSTEM.ENGINE.on(settings);

    additionalExecution();
}

function additionalExecution() {
    try {
        if (JSON.parse(localStorage.secret_alert))
            toastAlert({ title: '시크릿 모드', msg: '시크릿 모드가 켜졌습니다.' });
        delete localStorage.secret_alert;
    } catch (e) {}
}