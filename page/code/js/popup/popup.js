let thumb_off;

(async () => {
    await chrome.storage.local.get([sync_key, mybook_key, `${mybook_key}-thumb`]).then(async r => {
        if (r[sync_key]) {
            await chrome.storage.sync.get([mybook_key, `${mybook_key}-thumb`]).then(r1 => {
                checkPopup(r1);
            });
        }
        else {
            checkPopup(r);
        }
    })
})();




function checkPopup(r) {
    if (!r[mybook_key]) {
        openOptions();
    } else {
        resolveMybookData({ open: true, thumb_off: r[`${mybook_key}-thumb`] });
        thumb_off = r[`${mybook_key}-thumb`];
    }
}

function openOptions() {
    chrome.runtime.openOptionsPage();
    close();
}
