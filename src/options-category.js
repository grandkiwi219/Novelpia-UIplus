// routes 설정 시 가장 기본이 되는 경로는 배열의 가장 앞에 둘 것
const options_category = [
    {
        type: 'base',
        name: '웹소설',
        path: 'options',
        routes: [
            {
                path: '/search/',
                options: { method: { search: true } }
            },
            {
                path: '/viewer/',
                options: { method: { hash: true }, defender: true },
                observer: { target: '#viewer_no_drag' }
            }
        ],
    },
    {
        type: 'books',
        name: '북스',
        path: 'options-books',
        routes: [
            { path: '/', observer: { target: '#__nuxt' } },
            { path: '/mybook/', options: { method: { search: true } } },
        ],
    },
    {
        type: 'webtoon',
        name: '웹툰',
        path: 'options-webtoon',
    },
    /* {
        type: 'global',
        name: 'Global',
        path: 'options-global'
    }, */
];
