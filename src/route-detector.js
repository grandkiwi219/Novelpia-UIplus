// 2.0 route detector (url change detector)
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

    window.addEventListener('DOMContentLoaded', () => {
        const loaded_about_path = searchAboutPath();
        let loaded_path = npup.func.resolvePath(loaded_about_path.options.method);

        const urlChangeProcess = (request, sender, sendResponse) => {
            if (request.message != 'route-detect') return; 

            routeDetectorProcess();
        }

        chrome.runtime.onMessage.addListener(urlChangeProcess);

        function routeDetectorProcess() {
            let current_path = npup.func.resolvePath({ hash: true, search: true });
            const current_about_path = searchAboutPath(current_path);
            current_path = npup.func.resolvePath(current_about_path.options.method);

            if (!pathChecker(osc_routes_path, { target: current_path })) {
                chrome.runtime.onMessage.removeListener(urlChangeProcess);
                npup.owo('route detector가 종료 상태에 들어섰습니다.');
                return;
            }

            if (loaded_path == current_path) return;
                        
            routing = true;
            performance_standard = performance.now();
            loaded_path = current_path;
            routeDetector({ path: loaded_path });
        }


        function searchAboutPath(target_path = undefined) {
            let route_setup = {
                path: '',
                options: {
                    method: undefined,
                    defender: false,
                }
            }
            osc.routes.forEach(r => {
                if (pathChecker(r.path, { target: target_path }) && r.path.length > route_setup.path.length) {
                    route_setup.path = r.path;
                    Object.assign(route_setup.options, r.options);
                }
            });

            return route_setup;
        }
    });
})();

/* // v1.0 route-detector
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
        let c_path = npup.func.resolvePath(c_about_path.options.method);


        const routerObserver = new MutationObserver((mu, ob) => {
            ob.disconnect();

            routeDetectorProcess(ob);
        });
        onOb(routerObserver, c_about_path);


        function routeDetectorProcess(ob, { defender_pass = false } = {}) {
            let current_path = npup.func.resolvePath({ hash: true, search: true });
            const current_about_path = searchAboutPath(current_path);
            current_path = npup.func.resolvePath(current_about_path.options.method);

            if (!pathChecker(osc_routes_path, { target: current_path })) {
                ob.disconnect();
                npup.dev('route detector 연결 끊김');
                return;
            }
            
            
            if (c_path != current_path) {
                if (!defender_pass && current_about_path.options.defender && processDefender(ob))
                    return;
                routing = true;
                performance_standard = performance.now();
                c_path = current_path;
                routeDetector({ path: c_path });
            }

            onOb(ob, current_about_path);
        }




        function onOb(ob, about_path) {
            const auto_decide_setup = about_path?.options?.method?.hash ? ob_all_setup : observer_setup;
            ob.disconnect();
            ob.observe(
                about_path?.observer?.target ? document.querySelector(about_path?.observer?.target) : document.body,
                about_path?.observer?.setup || auto_decide_setup
            );
        }

        function searchAboutPath(target_path = undefined) {
            let route_setup = {
                path: '',
                options: {
                    method: undefined,
                    defender: false,
                },
                observer: {
                    target: undefined,
                    setups: undefined,
                }
            }
            osc.routes.forEach(r => {
                if (pathChecker(r.path, { target: target_path }) && r.path.length > route_setup.path.length) {
                    route_setup.path = r.path;
                    Object.assign(route_setup.options, r.options);
                    Object.assign(route_setup.observer, r.observer);
                }
            });

            return route_setup;
        }




        let processing = {
            count: 0,
            clear: undefined,
            timeout: undefined
        }

        const std_process_defender = {
            count: 2,
            clear: 0.22 * 1000,
            stop: 1.6 * 1000
        }

        function processDefender(ob) {
            if (processing.count >= std_process_defender.count) {
                ob.disconnect();
                npup.uwu('route detector 강제 연결 종료');
                if (!processing.stop) {
                    if (processing.clear)
                        clearTimeout(processing.clear);
                    processing.stop = setTimeout(() => {
                        processing = {
                            count: 0,
                            clear: undefined,
                            timeout: undefined
                        }
                        routeDetectorProcess(ob, { defender_pass: true });
                        npup.owo('route detector 재연결');
                    }, std_process_defender.stop);
                }
                return true;
            } else if (processing.count > 0) {
                processing.count++;
                return false;
            }
            if (processing.clear)
                clearTimeout(processing.clear);
            processing.count++;
            processing.clear = setTimeout(() => {
                if (!processing.stop) {
                    processing.count = 0;
                    processing.clear = undefined;
                }
            }, std_process_defender.clear);
            return false;
        }
    });


})(); */

// -----------------------------------------------------------------------------

function routeDetector({ path = npup.path } = {}) {
    const result = changeEngine({ path });

    const data = {
        path: path,
        pathChecker: (paths) => { return pathChecker(paths, { target: path }) },
        engine_is_changed: result
    }

    // 페이지 -> 뷰어 이동 시 엔진 체크 한다면 뷰어로 뜬다는 점 유의할 것
    window.dispatchEvent(new CustomEvent(npup.event.router, { detail: data }));

    const path_content = ` | 위치: ${path} ${domainChecker('base') ? '' : `| 도메인: ${location.hostname}`}`;
    const insert_content = npup.debug?.locate ? path_content : '';

    if (result == 0) {
        npup.dev(`엔진에 변화가 없습니다.${insert_content}`);
        ready({ router: true });
        basic_use_system.router = {};
    }
    else {
        if (result == 1) npup.dev(`엔진이 변경되었습니다.${insert_content}`);
        else npup.dev(`엔진이 존재하지 않습니다.${insert_content}`);
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
        if (
            pathChecker(engine[i]?.matches, { target: settings.path })
            && !pathChecker(engine[i]?.excludes, { target: settings.path })
        ) {
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
