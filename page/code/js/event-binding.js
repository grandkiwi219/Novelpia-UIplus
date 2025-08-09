// 세팅 스위치 크롬 스토리지 상호작용
document.querySelectorAll('.switch').forEach(r => {
    r.addEventListener('click', () => {
        let key = r.parentElement.parentElement.getAttribute('key');

        let local_storage = r.parentElement.parentElement.getAttribute('local');

        let ss_storage = local_storage == 'true' ? local : storage;

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
        let local_storage = selector.parentElement.getAttribute('local');
        let value = r.getAttribute('value');
        let value_name = r.innerHTML;

        let ss_storage = local_storage == 'true' ? local : storage;

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

        const local_storage = setting.getAttribute('local');
        const ss_storage = local_storage == 'true' ? local : storage;

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



// 세팅 매핑
document.addEventListener('keydown', async e => {
    const target = document.activeElement;
    if (!target.classList.contains('mapping')) return;

    e.preventDefault();

    const setting = target.parentElement.parentElement.parentElement;
    const key = setting.getAttribute('key');
    const local_storage = setting.getAttribute('local');
    const ss_storage = local_storage == 'true' ? local : storage;

    await ss_storage.get([key]).then(() => {
        ss_storage.set({ [key]: { code: e.code, key: e.key } });
    });

    target.textContent = wordMapping(e);
});

document.addEventListener('click', async e => {
    document.querySelectorAll('.mapping-cancel').forEach(async r => {
        let is_click = r.contains(e.target);

        if (!is_click) return;

        const setting = r.parentElement.parentElement.parentElement;
        const key = setting.getAttribute('key');
        const local_storage = setting.getAttribute('local');
        const ss_storage = local_storage == 'true' ? local : storage;

        await ss_storage.get([key]).then(() => {
            ss_storage.set({ [key]: { code: undefined, key: undefined } });
        });

        r.previousElementSibling.innerHTML = `<div class="mapping-nothing">설정 필요</div>`;
    }); 
});

function wordMapping(e) {
    let input_key = e.code ? (
        e.code
        .replace('Key', '')
        .replace('Digit', '')
        .replace('Numpad', 'Num')
    ) : e.key;

    const keyMap = {
        ShiftLeft: '왼쪽 Shift',
        ShiftRight: '오른쪽 Shift',
        Shift: '오른쪽 Shift',
        ControlLeft: '왼쪽 Ctrl',
        ControlRight: '오른쪽 Ctrl',
        AltLeft: '왼쪽 Alt',
        AltRight: '오른쪽 Alt',
        Escape: 'Esc',
        ArrowUp: '↑',
        ArrowDown: '↓',
        ArrowLeft: '←',
        ArrowRight: '→',
        Slash: '/',
        NumDivide: 'Num/',
        NumMultiply: 'Num*',
        Minus: '-',
        NumSubtract: 'Num-',
        Equal: '+',
        NumAdd: 'Num+',
        NumDecimal: 'Num.',
        MetaRight: '오른쪽 Win/⌘',
        MetaLeft: '왼쪽 Win/⌘',
        Backslash: '₩',
        Backquote: '`',
        Semicolon: ';',
        Semicolon: ';',
        Comma: ',',
        Period: '.',
        ContextMenu: 'Menu',
        BracketLeft: '[',
        BracketRight: ']',
    };


    if (keyMap[input_key]) {
        input_key = keyMap[input_key];
    } else if (e.key == 'HangulMode') {
        input_key = '한/영';
    } else if (e.key == 'HanjaMode') {
        input_key = '한자';
    }

    return input_key.replace('Num', 'Num ');
}
