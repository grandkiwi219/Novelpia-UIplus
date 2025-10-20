function npupSelectEpisode(parent) {
    const page_input = parent.children[0];

    const max_page = Number(page_input.nextElementSibling.textContent.replace('/', ''));
    let select_epi = page_input.value;

    if (select_epi > Number(max_page))
        select_epi = max_page;
    else if (select_epi <= 1)
        select_epi = 1;

    const novel_no = parseInt(location.pathname.replace('/novel/', '')) || document.querySelector('input#novel_no')?.value;

    if (!novel_no)
        return npup.func.toastAlert({ title: '오류', msg: '소설 번호를 찾을 수 없어 회차 페이지 이동이 불가능합니다.\n본 알림은 \'노벨피아 UI+\' 확장프로그램의 알림입니다.', type: 'error' }),
        npup.error('소설 번호를 찾을 수 없어 회차 페이지 이동이 불가능합니다.');

    localStorage[`novel_page_${novel_no}`] = (select_epi - 1);
    
    if (typeof episode_list === 'function')
        episode_list();
    else if (typeof episode_list_viewer === 'function')
        episode_list_viewer();
}