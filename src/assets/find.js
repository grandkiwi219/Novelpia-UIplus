/**
 * [key]: [
 *  {
 *      targetFinder: function,
 *      resolve: function,
 *      stack: string,
 *      cycle: number, // normally (duration / findTarget_storage.STD_TIMEOUT_TIME)
 *  },
 *  ...
 * ]
 */
const findTarget_storage = {
    STD_DURATION: 16 * 1000,
    STD_TIMEOUT_TIME: 80,

    key: 0,
    store: new Map(),
    timeout: null,
}

const registerFindTargetStore = (obj) => {
    const data = findTarget_storage.store.get(findTarget_storage.key);
    if (!data)
        findTarget_storage.store.set(findTarget_storage.key, [obj]);
    else
        data.push(obj);
}

/**
 * 불러올 요소가 없을 수도 있을 때 특정 시간 동안 그 요소가 존재하는지 확인하고 뱉어내는 함수
 * @param {function} targetFinder 감지할 요소
 * @param {Object} [setup={}] 
 * @param {number} setup.duration 탐지할 시간
 * @param {any} setup.method 0 = 기본적으로 작동, * = 바로 탐지 시작
 * @returns {Promise<HTMLElement>} 
 */
function findTarget(targetFinder, {
    duration = findTarget_storage.STD_DURATION,
    method = 0
} = {}) {

    if (Number.isNaN(Number(duration))) {
        duration = findTarget_storage.STD_DURATION;
    }

    const target = targetFinder();
    if (target && method === 0) {
        return Promise.resolve(target);
    }

    const stack = new Error().stack;

    let resolver = null;
    const return_value = new Promise(resolve => resolver = resolve);

    registerFindTargetStore({
        targetFinder,
        resolve: resolver,
        stack: stack.slice(stack.indexOf('\n') + 1),
        cycle: Math.ceil(duration / findTarget_storage.STD_TIMEOUT_TIME)
    });
    
    if (findTarget_storage.timeout) return return_value;

    const timeout = () => {
        findTarget_storage.store
        .get(findTarget_storage.key++)
        .forEach(obj => {
            const target = obj.targetFinder();

            if (!target) {
                if (obj.cycle > 1) {
                    obj.cycle--;
                    registerFindTargetStore(obj);
                }
                else {
                    npup.devGroup('타겟을 찾는 데에 시간이 오래 걸려 함수 실행을 취소했습니다.', obj.stack);
                    obj.resolve(undefined);
                }
                return;
            }

            obj.resolve(target);
        });

        findTarget_storage.store.delete(findTarget_storage.key - 1);

        if (findTarget_storage.store.get(findTarget_storage.key)) {
            findTarget_storage.timeout = setTimeout(timeout, findTarget_storage.STD_TIMEOUT_TIME);
        }
        else {
            findTarget_storage.timeout = null;
            findTarget_storage.store.delete(findTarget_storage.key);
            findTarget_storage.key = 0;
        }
    }

    findTarget_storage.timeout = setTimeout(timeout, findTarget_storage.STD_TIMEOUT_TIME);

    return return_value;
}




/**
 * [key]: [
 *  {
 *      targetFinder: function,
 *      handler: function,
 *      stack: string,
 *      cycle: number, // normally (duration / targetHandler_storage.STD_TIMEOUT_TIME)
 *  },
 *  ...
 * ]
 */
const targetHandler_storage = {
    STD_DURATION: 16 * 1000,
    STD_TIMEOUT_TIME: 80,

    key: 0,
    store: new Map(),
    timeout: null,
}

const registerTargetHandlerStore = (obj) => {
    const data = targetHandler_storage.store.get(targetHandler_storage.key);
    if (!data)
        targetHandler_storage.store.set(targetHandler_storage.key, [obj]);
    else
        data.push(obj);
}

/**
 * 불러올 요소가 없을 수도 있을 때 불러오는 걸 감지해서 핸들을 실행시켜주는 함수
 * @param {function} targetFinder 감지할 요소
 * @param {function} handler 실행할 함수
 * @param {Object} [setup={}] 
 * @param {number} setup.duration 탐지할 시간
 * @param {any} setup.method 0 = 기본적으로 작동, * = 바로 탐지 시작
 */
function targetHandler(targetFinder, handler, {
    duration = targetHandler_storage.STD_DURATION,
    method = 0
} = {}) {

    if (Number.isNaN(Number(duration))) {
        duration = targetHandler_storage.STD_DURATION;
    }

    const target = targetFinder();
    if (target && method === 0) {
        tryChecker(() => handler(target), 'targetHandler -> handler', false);
    }
    else {
        const stack = new Error().stack;

        registerTargetHandlerStore({
            targetFinder,
            handler,
            stack: stack.slice(stack.indexOf('\n') + 1),
            cycle: Math.ceil(duration / targetHandler_storage.STD_TIMEOUT_TIME)
        });
        
        if (targetHandler_storage.timeout) return;

        const timeout = () => {
            targetHandler_storage.store
            .get(targetHandler_storage.key++)
            .forEach(obj => {
                const target = obj.targetFinder();

                if (!target) {
                    if (obj.cycle > 1) {
                        obj.cycle--;
                        registerTargetHandlerStore(obj);
                    }
                    else {
                        npup.devGroup('타겟을 찾는 데에 시간이 오래 걸려 함수 실행을 취소했습니다.', obj.stack);
                    }
                    return;
                }

                tryChecker(() => {
                    try {
                        obj.handler(target);
                    } catch (error) {
                        error.stack += '\n\n' + obj.stack;
                        throw error;
                    }
                }, 'targetHandler -> handler', false);
            });

            targetHandler_storage.store.delete(targetHandler_storage.key - 1);

            if (targetHandler_storage.store.get(targetHandler_storage.key)) {
                targetHandler_storage.timeout = setTimeout(timeout, targetHandler_storage.STD_TIMEOUT_TIME);
            }
            else {
                targetHandler_storage.timeout = null;
                targetHandler_storage.store.delete(targetHandler_storage.key);
                targetHandler_storage.key = 0;
            }
        }

        targetHandler_storage.timeout = setTimeout(timeout, targetHandler_storage.STD_TIMEOUT_TIME);
    }
}




/**
 * 불러올 요소가 없을 수도 있을 때 불러오는 걸 감지해서 핸들을 실행시켜주는 함수
 * @param {function} target 감지할 요소
 * @param {function} handler 실행할 함수
 * @param {Object} [setup={}] 
 * @param {number} setup.redetect 재탐지할 횟수
 * @param {number} setup.duration 탐지할 시간, 이때 재탐지 횟수가 1회 이하일시 standard_duration으로 고정
 * @param {number} setup.standard_duration 최대 탐지 시간, 기본적으로 8 * 1000
 * @param {*} setup.method 0 = 기본적으로 작동, * = 기본적으로 탐지함
 */
function targetHandlerLegacy(targetFinder, handler, {
    redetect = 0,
    duration = NaN,
    standard_duration = 8 * 1000,
    method = 0
} = {}) {

    if (!duration && duration !== 0)
        duration = standard_duration;

    let target = targetFinder();
    if (target && method == 0) {
        tryChecker(() => handler(target), 'targetHandler -> handler', false);
    }
    else {
        const observe_setup = { childList: true, subtree: true }

        let target_found = false;

        const targetOb = new MutationObserver((mus, ob) => {
            ob.disconnect();
            let target = targetFinder();
            if (!target) return Promise.resolve().then(() => ob.observe(document.body, observe_setup));
            target_found = true;
            tryChecker(() => handler(target), 'targetHandler -> handler', false);
        });
        targetOb.observe(document.body, observe_setup);

        setTimeout(() => {
            if (!target_found) {
                targetOb.disconnect();
                if (redetect > 0) {
                    targetHandler(targetFinder, handler, {
                        redetect: redetect - 1,
                        duration: redetect < 2 ? standard_duration : Math.min(duration + 1 * 1000, standard_duration),
                        standard_duration
                    });
                    npup.trace(`타겟을 찾지 못하였습니다. 재탐지를 시작합니다.`);
                }
                else {
                    npup.trace(`타겟을 찾는 데에 시간이 오래 걸려 함수 실행을 취소했습니다.`);
                }
            }
        }, duration);
    }
}