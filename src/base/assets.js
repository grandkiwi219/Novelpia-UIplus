function clickDisplay() {
    document.getElementById('novel_drawing').click();
}

function clickVote() {
    document.getElementById('recommend_tap').children[0].click();
}

function useMode(name, result, { condition = true, handler = () => {} } = {}) {
    if (condition) {
        if (!navigator.onLine)
            toastAlert({ title: '네트워크', msg: '인터넷에 연결되어 있지 않아 새로고침되지 않습니다.', type: 'warn' });
        else if (navigator.connection?.type == 'cellular')
            toastAlert({ title: '모바일 데이터', msg: '모바일 데이터를 사용 중이므로 새로고침되지 않습니다.' });
        else {
            handler();
            location.reload();
            return;
        }
    }

    toastAlert({ title: name, msg: `${name}가 ${result ? '켜졌습니다.' : '꺼졌습니다.'}` });
}
