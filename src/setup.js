let storage = chrome.storage.sync;
const local = chrome.storage.local;
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
    npup.debug = r[npup.keys.debug];
    /* 
    {
        alert: true,   
        key: true,
        performance: true
    }
    */

    if (r[npup.keys.log]) { 
        npup.log = function() { return; }
        npup.dev = function() { return; }
    }
});


// dom_loaded
window.addEventListener('DOMContentLoaded', () => dom_loaded = true);



/* let options = {
    r: {}
} */



const { tryChecker, pathChecker, domainChecker, engineChecker, toastAlert, tryFunc } = npup.func;
const observer_setup = npup.settings.observer;
