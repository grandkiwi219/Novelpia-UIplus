npup.log('노벨피아를 감지했습니다.');



// ready start
function ready(r) {
    STRUCTURE.SWITCH.ENGINE.on();

    STRUCTURE.SELECTOR.ENGINE.on();

    STRUCTURE.CUSTOM.ENGINE.on();

    // --- Head Common Engine ---
    STRUCTURE.PRE_COMMON.ENGINE.on();

    // --- initial-setup injection ---
    scriptInjection('src/npup.js');
}






// --- body checker ---
let engine = STRUCTURE.SYSTEM.ENGINE;

new MutationObserver((mus, ob) => {
    for (const mu of mus) for (const node of mu.addedNodes)
        if (node.localName === 'body') {
            // --- Body Common Engine ---
            STRUCTURE.COMMON.ENGINE.on();

            // --- System Engine ---
            if (!engine.name) npup.log('개별 엔진이 존재하지 않는 페이지입니다.');
            else engine.on();

            return ob.disconnect();
        }
}).observe(html, { childList: true });
