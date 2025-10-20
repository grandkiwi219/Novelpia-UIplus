(() => {
    let osc = undefined;

    for (let i = 0; i < options_category.length; i++) {
        if (domainChecker(options_category[i].type)) {
            osc = options_category[i];
            break;
        }
    }

    if (!osc || !osc.routes) return;

    const osc_routes_path = osc.routes.map(r => r.path);

    if (!pathChecker(osc_routes_path)) return;

    const ob_all_setup = { ...observer_setup, attributes: true };

    window.addEventListener('DOMContentLoaded', () => {
        const c_about_path = searchAboutPath();
        let c_path = npup.func.resolvePath(c_about_path.options);

        const routerObserver = new MutationObserver((mu, ob) => {
            let current_path = npup.func.resolvePath({ hash: true, search: true });
            const current_about_path = searchAboutPath(current_path);
            current_path = npup.func.resolvePath(current_about_path.options);

            if (!pathChecker(osc_routes_path, { target: current_path }))
                return ob.disconnect(), npup.dev('route detector 연결 끊김');

            if (c_path != current_path) {
                routing = true;
                performance_standard = performance.now();
                c_path = current_path;
                routeDetector({ path: c_path });
            }
    
            ob.disconnect();
            onOb(ob, current_about_path);
        });

        onOb(routerObserver, c_about_path);
    });


    function onOb(ob, about_path) {
        const auto_decide_setup = about_path.options?.hash ? ob_all_setup : observer_setup;
        ob.observe(document.body, about_path.observer || auto_decide_setup);
    }

    function searchAboutPath(target_path = undefined) {
        let route_path = { path: '', options: undefined, observer: undefined };
        osc.routes.forEach(r => {
            if (pathChecker(r.path, { target: target_path }) && r.path.length > route_path.path.length)
                route_path = r;
        });

        return route_path;
    }
})();

// -----------------------------------------------------------------------------

function routeDetector({ path = npup.path } = {}) {
    const result = changeEngine({ path });

    const data = {
        path: path,
        pathChecker: (paths) => { return pathChecker(paths, { target: path }) },
        engine_is_changed: result
    }
    
    window.dispatchEvent(new CustomEvent(npup.event.router, { detail: data })); // 페이지 -> 뷰어 이동 시 엔진 체크 한다면 뷰어로 뜬다는 점 유의할 것
    
    const path_content = `| 위치: ${path} ${domainChecker('base') ? '' : `| 도메인: ${location.hostname}`}`;

    if (result == 0) {
        npup.dev(`엔진에 변화가 없습니다. ${path_content}`);
        ready({ router: true });
        basic_use_system.router = {};
    }
    else {
        if (result == 1) npup.dev(`엔진이 변경되었습니다. ${path_content}`);
        else npup.dev(`엔진이 존재하지 않습니다. ${path_content}`);
        resetAttribute();
        optionsReset();
        ready();
    }
}

function resetAttribute() {
    document.getElementsByTagName(npup.project.engine)[0].removeAttribute('type');

    current_attribute.forEach(r => {
        html.removeAttribute(r);
    });
    current_attribute = [];

    basic_use_system.base = {};
    basic_use_system.router = {};
}

let engine;

function changeEngine(settings) {
    if (!engine && !engine?.length)
        return -1; // undefined

    let current_engine = STRUCTURE.SYSTEM.ENGINE.name;

    let engine_exist = false;

    for (let i = 0; i < engine.length; i++) {
        if (pathChecker(engine[i]?.matches, { target: settings.path }) && !pathChecker(engine[i]?.excludes, { target: settings.path })) {
            STRUCTURE.SYSTEM.ENGINE.name = engine[i]?.name || '';

            engine_exist = true;

            if (engine[i]?.execution)
                STRUCTURE.SYSTEM.ENGINE.setAdditionalExecution(engine[i].execution);

            break;
        }
    }

    if (!engine_exist) {
        STRUCTURE.SYSTEM.ENGINE.name = '';
        STRUCTURE.SYSTEM.ENGINE.setAdditionalExecution(() => 0);
    }

    if (current_engine == STRUCTURE.SYSTEM.ENGINE.name)
        return 0; // not changed
    else if (!engine_exist) {
        return -2; // null
    }
    else 
        return 1; // changed
}

function removeEvent(func) {
    window.addEventListener(npup.event.router, () => {
        func();
    }, { once: true });
}

function removeEventForEngine(func) {
    function routerEvent(data) {
        if (data.detail.engine_is_changed == 0) return;

        func();
        window.removeEventListener(npup.event.router, routerEvent);
    }
    window.addEventListener(npup.event.router, routerEvent);
}
