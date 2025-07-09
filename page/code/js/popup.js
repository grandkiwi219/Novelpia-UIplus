chrome.storage.local.get([sync_key, mybook_key]).then(r => {
    if (r[sync_key]) {
        chrome.storage.sync.get([mybook_key]).then(r1 => {
            checkPopup(r1);
        });
    }
    else {
        checkPopup(r);
    }
});




function checkPopup(r) {
    if (!r[mybook_key]) {
        openOptions();
    }
}

function openOptions() {
    chrome.runtime.openOptionsPage();
    close();
}