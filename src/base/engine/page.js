// --- Page Engine ---
STRUCTURE.SYSTEM.ENGINE.name = '페이지';

STRUCTURE.SYSTEM.ENGINE.setAdditionalExecution(async (r, _this) => {
    // For Search System
    scriptInjection('src/base/file/pc-search.js');

    // remove last episode history
    const last_ep = 'last-ep';
    const last_ep_data_sync = await chrome.storage.sync.get(last_ep);
    const last_ep_data_local = await chrome.storage.sync.get(last_ep);

    if (!last_ep_data_sync[last_ep] && !last_ep_data_local[last_ep])
        scriptInjection('src/base/file/remove-last-episode.js');
});
