console.log(console_project_prefix + '노벨피아를 감지했습니다.');



// ready start
function ready() {
    STRUCTURE.ON_OFF.ENGINE.on();

    STRUCTURE.SELECTOR.ENGINE.on();

    STRUCTURE.CUSTOM.ENGINE.on();

    // --- Head Common Engine ---
    STRUCTURE.PRE_COMMON.ENGINE.on();

    // --- initial-setup injection ---
    scriptInjection('src/initial-setup.js');
}



// custom css
const customCssSystem = (r) => {
    if (!r[l.c_css]) return;

    let style = document.createElement('style');
    style.insertAdjacentHTML('afterbegin', r[l.c_css]);

    tryChecker(() => {
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }, '커스텀', 'css', style);
}

new SystemStructure(l.c_css, STRUCTURE.CUSTOM.TYPE)
.setSystem(customCssSystem)
.setup();



// --- body checker ---
let engine = STRUCTURE.SYSTEM.ENGINE;

new MutationObserver((mus, ob) => {
    for (const mu of mus) for (const node of mu.addedNodes)
        if (node.localName === 'body') {
            // --- Body Common Engine ---
            STRUCTURE.COMMON.ENGINE.on();

            // --- System Engine ---
            if (!engine.name) console.log(console_project_prefix + '개별 엔진이 존재하지 않는 페이지입니다.');
            else engine.on();

            return ob.disconnect();
        }
}).observe(html, { childList: true });
