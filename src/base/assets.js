const isDarkMode = () => getCookie('DARKMODE_S');
const isViewerDarkMode = () => getCookie('DARKMODE');

const isTouchDevice = () => (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement);

function isRestored() {
    const [nav] = performance.getEntriesByType('navigation');

    if (!nav) return false;

    if (nav?.type == 'back_forward') {
        return true;
    }

    if (typeof document.wasDiscarded == 'boolean') {
        return document.wasDiscarded;
    }

    return nav.type == 'reload'
        && nav.transferSize == 0
        && nav.encodedBodySize > 0;
}

function executeVote() {
    if (!document.getElementById('btn_episode_vote').src.includes('_on')) {
        document.getElementById('recommend_tap').children[0].click();
        showIcon(iconFunc);
    }
    else {
        showIcon(iconFunc, true);
    }

    function iconFunc(on = false) {
        return `//images.novelpia.com/img/new/viewer/navbar/v2/recommend${on ? '_on' : ''}.svg`;
    }
}

function executeLike() {
    const target = document.getElementById('btn_like');

    if (!target.src.includes('_on')) {
        target.click();
        showIcon(iconFunc());
    }
    else {
        target.click();
        showIcon(iconFunc(true));
    }

    function iconFunc(reverse = false) {
        return function (on = false) {
            const willOn = reverse ? (on ? '' : '_on') : (on ? '_on' : '');
            return `//image.novelpia.com/img/new/viewer/navbar/v2/like${willOn}.svg`
        }
    }
}

function naviView() {
    return scriptInjection(`src/base/file/novelpia/navi-view.js`);
}

function btnComment2() {
    return scriptInjection(`src/base/file/novelpia/btn-comment2.js`);
}

function btnList2() {
    return scriptInjection(`src/base/file/novelpia/btn-list2.js`);
}

function movePage(position) {
    try {
        return scriptInjection(`src/base/file/novelpia/page-${position}.js`);
    } catch (error) {
        return undefined;
    }
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

async function copyUrl(url) {
    try {
        await navigator.clipboard.writeText(url);
        showAlert({ msg: '링크를 클립보드에 복사했습니다.' });
    } catch (err) {
        showAlert({ msg: '링크를 클립보드에 복사하는 데에 실패했습니다.', type: 'error' });
        throw new Error(err);
    }
}
