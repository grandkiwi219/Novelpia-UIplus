npup.log('노벨피아를 감지했습니다.');



// ready start
function ready(r) {
    STRUCTURE.SWITCH.ENGINE.on();

    STRUCTURE.SELECTOR.ENGINE.on();

    STRUCTURE.CUSTOM.ENGINE.on();

    // --- Head Common Engine ---
    STRUCTURE.PRE_COMMON.ENGINE.on();

    // --- body checker ---
    if (document.body) {
        start();
    } else {
        new MutationObserver((mus, ob) => {
            for (const mu of mus) for (const node of mu.addedNodes)
                if (node.localName === 'body') {
                    start();

                    return ob.disconnect();
                }
        }).observe(html, { childList: true });
    }

    // --- initial-setup injection ---
    scriptInjection('src/npup.js');
}

function start() {
    // --- Body Common Engine ---
    STRUCTURE.COMMON.ENGINE.on();

    // --- System Engine ---
    if (!STRUCTURE.SYSTEM.ENGINE.name) npup.log('개별 엔진이 존재하지 않는 페이지입니다.');
    else STRUCTURE.SYSTEM.ENGINE.on();

    additionalExecution();
}

function additionalExecution() {
    try {
        if (JSON.parse(localStorage.secret_alert))
            toastAlert({ title: '시크릿 모드', msg: '시크릿 모드가 켜졌습니다.' });
        delete localStorage.secret_alert;
    } catch (e) {}
}
