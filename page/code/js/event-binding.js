// 세팅 스위치 크롬 스토리지 상호작용
document.querySelectorAll('.switch').forEach(r => {
    r.addEventListener('click', () => {
        let key = r.parentElement.parentElement.getAttribute('key');

        let storage_type = r.parentElement.parentElement.getAttribute('storage');

        let ss_storage = storage_type == 'local' ? local : storage;

        ss_storage.get([key]).then(s => {
            if (s[key] == true) {
                r.setAttribute('check', 'false');
                ss_storage.set({ [key]: false });
            } else {
                r.setAttribute('check', 'true');
                ss_storage.set({ [key]: true });
            }
        });

        if (key == sync_key) return location.reload();
    });
});



// 세팅 셀렉터 스크립트
    // 세팅 셀럭터 창 열림
document.addEventListener('click', (event) => {
    document.querySelectorAll('.selector-value').forEach(r => {
        let is_click = r.contains(event.target);

        if (!is_click) return r.parentElement.classList.remove('selector-active');

        r.parentElement.classList.toggle('selector-active');
    }); 
});

    // 세팅 셀렉처 창 닫힘
document.addEventListener('keydown', (e) => {
    if (e.key == 'Escape') {
        document.querySelectorAll('.selector-value').forEach(r => {
            r.parentElement.classList.remove('selector-active')
        });
    }
});


    // 세팅 셀럭터 크롬 스토리지 상호작용
document.querySelectorAll('.selector-option').forEach(r => {
    r.addEventListener('click', () => {
        let selector = r.parentElement.parentElement.parentElement;
        let key = selector.parentElement.getAttribute('key');
        let storage_type = selector.parentElement.getAttribute('storage');
        let value = r.getAttribute('value');
        let value_name = r.innerHTML;

        let ss_storage = storage_type == 'local' ? local : storage;

        ss_storage.get([key]).then(() => {
            ss_storage.set({ [key]: value });
            //selector.setAttribute('value', value);
            selector.querySelector('.value-name').innerHTML = value_name;
        });
    });
});



// 세팅 텍스트아레아
document.querySelectorAll('.text-area-submit').forEach(r => {
    r.addEventListener('click', () => {
        const black = 'tas-black', active = 'tas-active';
        if (r.className.includes(black) || r.className.includes(active)) return;

        const setting = r.closest('setting-textarea');
        const key = setting.getAttribute('key');

        const textarea = setting.querySelector('textarea');
        const value = textarea.value;

        const storage_type = setting.getAttribute('storage');
        const ss_storage = storage_type == 'local' ? local : storage;

        ss_storage.get([key]).then(() => {
            ss_storage.set({ [key]: value });
            saveSuccess(r, black, active);
        });
    });
});

function saveSuccess(r, black, active) {
    r.classList.add(black);
    setTimeout(() => {
        r.classList.add(active);
        r.classList.remove(black);
        setTimeout(() => {
            r.classList.add(black);
            setTimeout(() => {
                r.classList.remove(active);
                r.classList.remove(black);
            }, 600);
        }, 1200);
    }, 600);
}
