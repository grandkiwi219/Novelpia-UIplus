function insertSettingData(name, element) {
    setting_data.push({ name: name, element: element });
}


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