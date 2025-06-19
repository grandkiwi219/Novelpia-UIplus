// check update for search
const search_target = document.querySelector('.rand-wrapper');
new MutationObserver(searchMutationOption)
    .observe(search_target, { ...observer_setup, characterData: true }); 

const search_item_target = document.querySelector('.search-tags');
new MutationObserver(searchMutationOption)
    .observe(search_item_target, { ...observer_setup, characterData: true }); 

function searchMutationOption(mus, ob) {
    storage.get([l.s_r]).then(r => {
        if (!r[l.s_r]) return;

        tryChecker(() => {
            // 혹시 모를 중복 생성으로 인한 검색 결과 미반영 해결책
            let search_result = document.getElementsByClassName(`${project_prefix + l.s_r}-wrap`);

            if (!search_result[0] && !document.getElementsByClassName(`${project_prefix + l.s_r}`)[0]) {
                /* l.nav, 다른 것들도 반영하는 것은 각 시스템별로 바디 부분에 npup- 를 삽입함으로써 이미 존재함을 증명시키게 할 것 */
                /* 그렇다해도 searchResultSystem 내부에 resultBoxContent가 삽입되어 있으니 이 부분은 삭제하지 말 것 */
                return storage.get([l.search]).then(r1 => {
                    return searchResultSystem({ ...r, ...r1 });
                })
            }
            else
                return search_result[search_result.length - 1].innerHTML = resultBoxContent();
        }, '동적 검색 결과', '파츠'/* , mus */);
    });
}