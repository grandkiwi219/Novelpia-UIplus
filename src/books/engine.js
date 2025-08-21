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
