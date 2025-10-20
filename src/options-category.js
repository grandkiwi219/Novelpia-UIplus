const options_category = [
    {
        type: 'base',
        name: '웹소설',
        path: 'options',
        routes: [
            { path: '/search/', options: { search: true } },
            { path: '/viewer/', options: { hash: true } }
        ],
    },
    {
        type: 'books',
        name: '북스',
        path: 'options-books',
        routes: [
            { path: '/' },
            { path: '/mybook/', options: { search: true }, observer: undefined }
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
