engine = [
    {
        name: '페이지',
        matches: ['/'],
        excludes: ['/viewer/'],
        execution: async (r, _this, settings) => {
            /* // For Search System
            scriptInjection('src/base/file/pc-search.js');

            // remove last episode history
            const last_ep = 'last-ep';
            const last_ep_data_sync = await chrome.storage.sync.get(last_ep);
            const last_ep_data_local = await chrome.storage.sync.get(last_ep);

            if (!last_ep_data_sync[last_ep] && !last_ep_data_local[last_ep])
                scriptInjection('src/base/file/remove-last-episode.js'); */
        }
    },

    {
        name: '뷰어',
        matches: ['/viewer/'],
        execution: (r, _this, settings) => {
            /* if (!routing)
                window.addEventListener("DOMContentLoaded", checkLastEp);
            else
                checkLastEp();


            async function checkLastEp() {
                const last_ep = 'last-ep';
                const last_ep_data_sync = await chrome.storage.sync.get(last_ep);
                const last_ep_data_local = await chrome.storage.sync.get(last_ep);

                if (last_ep_data_sync[last_ep] || last_ep_data_local[last_ep])
                    scriptInjection('src/base/file/save-last-episode.js'); // save last episode history
                else
                    scriptInjection('src/base/file/remove-last-episode.js'); // remove last episode history
            } */
        }
    }
];

STRUCTURE.PRE_COMMON.ENGINE.setAdditionalExecution(() => {
    let books_dark_result;

    if (engineChecker('페이지')) {
        try {
            books_dark_result = JSON.parse(localStorage.getItem('npup_books_page_dark'));
        } catch (error) {
            books_dark_result = false;
        }
    }
    else if (engineChecker('뷰어')) {
        try {
            books_dark_result = JSON.parse(localStorage.getItem('npup_books_viewer_dark'));
        } catch (error) {
            books_dark_result = false;
        }   
    }
    
    if (books_dark_result) html.classList.add(books_dark.id);

    removeEventForEngine(() => {
        let books_dark_result;

        if (engineChecker('뷰어')) {
            try {
                books_dark_result = JSON.parse(localStorage.getItem('npup_books_viewer_dark'));
            } catch (error) {
                books_dark_result = false;
            }
        }
        else if (engineChecker('페이지')) {
            try {
                books_dark_result = JSON.parse(localStorage.getItem('npup_books_page_dark'));
            } catch (error) {
                books_dark_result = false;
            }
        }

        if (books_dark_result) return;
        
        html.classList.remove(books_dark.id);
    });
});
