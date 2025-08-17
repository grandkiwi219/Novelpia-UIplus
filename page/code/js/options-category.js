const base_path = '/page';

const options_category = [
    {
        type: 'base',
        name: '웹소설',
        path: 'options'
    },
    {
        type: 'books',
        name: '북스',
        path: 'options-books'
    },
/*     {
        type: 'webtoon',
        name: '웹툰',
        path: 'options-webtoon'
    },
    {
        type: 'global',
        name: 'Global',
        path: 'options-global'
    }, */
];

(() => {
    if (!options_category || !options_category?.length) return;

    const options_ca_fil = options_category
        .filter(e => e.type != document.getElementsByTagName('html')[0].getAttribute('type'));

    if (!options_ca_fil.length) return;

    const banner_wrap = document.createElement('div');
    banner_wrap.id = 'category';
    banner_wrap.classList.add('cleaner');

    const banner = document.createElement('div');
    banner.classList.add('container');

    options_ca_fil
        .forEach(e => {
            const warp_a = document.createElement('a');
            warp_a.classList.add('normal-button');
            warp_a.textContent = e.name;
            warp_a.href = `${base_path}/${e.path}.html`;

            banner.appendChild(warp_a);
        });

    banner_wrap.appendChild(banner);

    document.getElementById('box').insertAdjacentElement('afterbegin', banner_wrap);


    const box = document.getElementById('box');

    const banner_height = banner_wrap.offsetHeight;

    let current_height = box.scrollTop;

    box.addEventListener('scroll', () => {
        if (current_height < box.scrollTop)
            banner_wrap.style.top = `-${banner_height}px`;

        else
            banner_wrap.style.top = 0;

        current_height = box.scrollTop;
    });
})();
