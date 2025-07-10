let open_option = false;


(async () => {
    await chrome.storage.local.get([sync_key, mybook_key]).then(async r => {
        if (r[sync_key]) {
            await chrome.storage.sync.get([mybook_key]).then(r1 => {
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
        open_option = true;
        openOptions();
    }
}

function openOptions() {
    chrome.runtime.openOptionsPage();
    close();
}