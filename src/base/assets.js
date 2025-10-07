function clickDisplay() {
    document.getElementById('novel_drawing').click();
}

function clickVote() {
    document.getElementById('recommend_tap').children[0].click();
}

function executeClickVote() {
    const vote = document.getElementById('btn_episode_vote').src.includes('recommend_on');

    if (!vote) clickVote(), showVote();
    else showVote(true);
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

async function showVote(already = false) {
    const vote = document.createElement('div');
    vote.classList.add('content_memo');

    const vote_icon = document.createElement('img');
    vote_icon.src = already ? voteIcon(true) : voteIcon();
    vote_icon.classList.add('npup-vote-icon');

    vote.appendChild(vote_icon);
    document.body.appendChild(vote);

    await setDelay(100);
    vote_icon.classList.add('show');
    vote_icon.classList.add('down');
    await setDelay(400);
    if (!already) vote_icon.src = voteIcon(true);
    vote_icon.classList.add('up');
    await setDelay(400);
    vote_icon.classList.remove('show');
    await setDelay(200);
    vote.remove();

    function voteIcon(on = false) {
        return `//images.novelpia.com/img/new/viewer/navbar/v2/recommend${on ? '_on' : ''}.svg`;
    }
}

async function setDelay(time) {
    return await new Promise(r => setTimeout(r, time));
}
