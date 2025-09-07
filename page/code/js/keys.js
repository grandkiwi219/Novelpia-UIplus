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
    location: {
        tab: 'last_view',
        category: 0, /* [category_id] */
        page: 1,
        order: 'date'
    },
    expiration_period: undefined,
    data: {
        status: 5,
        data: {
            books: undefined,
            category: undefined,
            page: undefined
        }
    }
}
