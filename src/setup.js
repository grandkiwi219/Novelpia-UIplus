const html = document.documentElement;

// let storage = chrome.storage.sync;
// const local = chrome.storage.local;
class Cache {
    constructor(storage) {
        this.cache = storage;
    }

    get(keys) {
        try {
            return this.cache.get(keys);
        } catch (error) {
            setIsDisconnected();
            if (npup.debug.alert)
                npup.func.toastAlert({ title: '저장소 불러오기 오류', msg: `저장소에서 정보를 불러오는데에 실패했습니다.\n${error}`, type: 'error' });
            npup.error('본 확장프로그램의 저장소에서 정보를 불러오는데에 실패했습니다.\n' + error.stack);
            return Promise.resolve(() => []);
        }
    }

    set(obs) {
        try {
            return this.cache.set(obs);
        } catch (error) {
            setIsDisconnected();
            if (npup.debug.alert)
                npup.func.toastAlert({ title: '저장소 저장하기 오류', msg: `저장소에서 정보를 저장하는데에 실패했습니다.\n${error}`, type: 'error' });
            npup.error('본 확장프로그램의 저장소에서 정보를 저장하는데에 실패했습니다.\n' + error.stack);
            return undefined;
        }
    }
}

let storage = new Cache(chrome.storage.sync);
const local = new Cache(chrome.storage.local);

let storage_type = 'sync';

let extension_load = false;
let performance_standard = performance.now();

let document_status = 1;
let dom_loaded = false;

let routing = false;

local.get([npup.keys.sync]).then(async r => {
    if (!r[npup.keys.sync] && typeof r[npup.keys.sync] != 'boolean')
        local.set({ [npup.keys.sync]: true });
    else if (!r[npup.keys.sync]) {
        storage = local, storage_type = 'local';
        /* ready(); */
    }

    extension_load = true, window.dispatchEvent(new CustomEvent(npup.event.load));
});

local.get([npup.keys.debug, npup.keys.log]).then(r => {
    Object.assign(npup.debug, r[npup.keys.debug]);
    /* 
    {
        alert: boolean,   
        key: boolean,
        performance: boolean,
        locate: boolean,
    }
    */

    if (r[npup.keys.log]) { 
        npup.log = function() { return; }
        npup.dev = function() { return; }
        npup.owo = function() { return; }
        npup.owu = function() { return; }
        npup.uwu = function() { return; }
    }
});


// dom_loaded
window.addEventListener('DOMContentLoaded', () => dom_loaded = true);



/* let options = {
    r: {}
} */



const { tryChecker, pathChecker, domainChecker, engineChecker, toastAlert, tryFunc } = npup.func;
const observer_setup = npup.settings.observer;
