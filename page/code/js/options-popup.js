const popup_location = '/page/popup.html';


document.addEventListener('click', e => {
    const mybook_el = document.querySelector(`[key="${mybook_key}"]`); 
    const mybook_btn = mybook_el.children[0].children[0];

    if (e.target == mybook_btn && mybook_btn.getAttribute('check') == 'false') {
        checkQuickMybook();
        mybookBinding();
    }
});

function checkQuickMybook() {
    local.get([sync_key, mybook_key]).then(r => {
        if (r[sync_key]) 
            chrome.storage.sync.get([mybook_key]).then(r1 => {
                setPopup(r1);
            });
        else 
            setPopup(r);
    })
}

function setPopup(r) {
    if (r[mybook_key]) {
        chrome.action.setPopup({
            popup: popup_location
        });
    }
}

function mybookBinding() {
    local.get([mybook]).then(r => {
        if (!r[mybook]) {
            local.set({ [mybook]: { last_data: mybook_value.last_data } });
        } 
    });
}
