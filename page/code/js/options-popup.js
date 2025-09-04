document.addEventListener('click', e => {
    const mybook_el = document.querySelector(`[key="${mybook_key}"]`); 

    if (!mybook_el) return;

    const mybook_btn = mybook_el?.children[0]?.children[0];

    if (!mybook_btn) return;

    if (e.target == mybook_btn && mybook_btn.getAttribute('check') == 'false') {
        checkQuickMybook();
        mybookBinding();
    }
});

function mybookSetup() {
    storage.get([mybook_key]).then(r => {
        if (r[mybook_key]) {
            storage.set({ [mybook_key]: false });
            console.log('빠른 내서재 옵션을 수동으로 \'취소\'시켰습니다.');
        }
        else {
            storage.set({ [mybook_key]: true });
            console.log('빠른 내서재 옵션을 수동으로 \'작동\'시켰습니다.');
            checkQuickMybook();
            mybookBinding();
        }
    }).catch(e => {
        console.warn('빠른 내서재 옵션을 수동으로 작동시키는 도중에 오류가 발생했습니다.');
        console.error(e.stack);
    }); 
}

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
