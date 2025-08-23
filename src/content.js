npup.log('노벨피아를 감지했습니다.');

ready();



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
        startBody(settings);
    } else {
        new MutationObserver((mus, ob) => {
            if (!document.body) return; 
            startBody();
            ob.disconnect();
        }).observe(document.documentElement, { childList: true });
    }

    // --- head checker ---
    if (document.head) {
        startHead();
    } else {
        new MutationObserver((mus, ob) => {
            if (!document.head) return;
            startHead();
            ob.disconnect();
        }).observe(document.documentElement, { childList: true });
    }   
    

    function startBody() {
        // --- Body Common Engine ---
        STRUCTURE.COMMON.ENGINE.on(settings);
        
        // --- System Engine ---
        if (!STRUCTURE.SYSTEM.ENGINE.name) npup.dev('개별 엔진이 존재하지 않는 페이지입니다. 본 페이지에서는 노벨피아 UI+를 이용할 수 없습니다.');
        else STRUCTURE.SYSTEM.ENGINE.on(settings);
    }

    function startHead() {        
        if (routing) return;
    
        // --- initial-setup injection ---
        scriptInjection('src/npup.js');
    }
}
