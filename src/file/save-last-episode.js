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

            list: '/novel/' + document.querySelector('input#novel_no')?.value,
        },

        thumbnail: document.querySelector('meta[property="og:image"]')?.content,
    };

    if (!last_episode_form.ep) return;

    if (document.getElementsByClassName('menu-top-adult')[0] ||
        document.getElementsByClassName('menu-top-nineteen')[0])
        last_episode_form.adult = true;

    localStorage.last_episode = JSON.stringify(last_episode_form);
})();