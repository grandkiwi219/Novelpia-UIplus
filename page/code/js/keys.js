const sync_key = 'extension-sync';
const update_key = 'extension-update';
const mybook_key = 'quick-mybook';
const mybook = 'mybook';

const novelpia = 'https://novelpia.com';

const popup_location = '/page/popup.html';

const npup = {
    options: {}
};

const mybook_value = {
    last_data: {
        tab: null,
        category: null /* [category_id] */
    },
    category: [
        /* { id: [category_id], name: [category_name] },
        ... */
    ],
    tab: {
        /* [category_id]: {
            data: [
            { author: { name: '', href: '' }, title: '', thumbnail: '', novel: '', adult: false, continue: { ep: '', href: '' }, next: { state: true, href: '' } },
            ...
            ]
        },
        ... */
    }
}
