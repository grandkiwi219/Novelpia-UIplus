(() => {
    try {
        delete localStorage.last_episode;
    } catch (e) {
        npup.error('최근 본 작품 데이터 제거 도중 오류가 발생했습니다.', e.stack);
    }
})();