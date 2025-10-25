(() => {
    let last_episode_form = {
        novel: document.title
            .replace('노벨피아', '')
            .replace('웹소설로 꿈꾸는 세상!', '')
            .replace(/ - /g, ''),

        title: document.getElementsByClassName('menu-top-title')[0]?.textContent.replace('\n', '').trim(),

        ep: document.getElementsByClassName('menu-top-tag')[0]?.textContent,

        adult: false,

        href: {
            novel: window.location.pathname,

            next: document.getElementById('next_epi_auto_url')?.value,

            back: document.getElementById('back_epi_auto_url')?.value,

            list: '/novel/' + document.getElementById('novel_no')?.value,
        },

        thumbnail: document.querySelector('meta[property="og:image"]')?.content,
    };

    if (!last_episode_form.ep) return;

    if (document.getElementsByClassName('menu-top-adult')[0] ||
        document.getElementsByClassName('menu-top-nineteen')[0])
        last_episode_form.adult = true;

    if (!last_episode_form.href.list) 
        npup.func.toastAlert({ title: '경고', msg: '현재 보고 있는 작품의 \'소설 소개 페이지\' 주소 저장에 실패했습니다.', type: 'warn' }),
        npup.warn('현재 보고 있는 작품의 \'소설 소개 페이지\' 주소 저장에 실패했습니다.');

    if (!last_episode_form.thumbnail) 
        npup.warn('현재 보고 있는 작품의 \'썸네일\' 주소 저장에 실패했습니다.');

    localStorage.last_episode = JSON.stringify(last_episode_form);
})();