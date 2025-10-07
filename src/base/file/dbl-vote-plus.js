let npup_dbl_vote_state = {
    time: 0,
    cooltime: 0,
    clickTimer: undefined
}

window.addEventListener(npup.event.dbl_vote.send, e => {
    npup_dbl_vote_state.cooltime = e.detail.cooltime;
    window.dispatchEvent(new Event(npup.event.dbl_vote.answer));
}, { once: true });

function npupNaviView() {
    const now = performance.now();

    if (now - npup_dbl_vote_state.time < npup_dbl_vote_state.cooltime) {
        clearTimeout(npup_dbl_vote_state.clickTimer);
        npup_dbl_vote_state.time = 0;
        return;
    }

    clearTimeout(npup_dbl_vote_state.clickTimer);
    npup_dbl_vote_state.clickTimer = setTimeout(() => {
        navi_view();
    }, npup_dbl_vote_state.cooltime);

    npup_dbl_vote_state.time = now;
}