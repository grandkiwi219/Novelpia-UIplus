engine = [
    {
        name: '페이지',
        matches: ['/'],
        excludes: ['/viewer/', '/viewer_collect/', '/comic_viewer/', '/page/block/', '/proc/payment_complete/'],
        execution: async (r, _this, settings) => {
            // For Search System
            scriptInjection('src/base/file/pc-search.js');

            // remove last episode history
            const last_ep = 'last-ep';
            const last_ep_data_sync = await chrome.storage.sync.get(last_ep);
            const last_ep_data_local = await chrome.storage.sync.get(last_ep);

            if (!last_ep_data_sync[last_ep] && !last_ep_data_local[last_ep])
                scriptInjection('src/base/file/remove-last-episode.js');
        }
    },

    {
        name: '뷰어',
        matches: ['/viewer/'],
        execution: (r, _this, settings) => {
            if (dom_loaded) {
                lineShare();
            }
            else {
                window.addEventListener('DOMContentLoaded', lineShare);
            }

            async function lineShare() {
                await setDelay(1000);

                const paging = localStorage['viewer_paging'] == '1';

                const search = location.search.slice(1);
                const line_num = Number(search.split('&').find(r => r.startsWith('line='))?.slice(5));

                if (line_num == NaN) return;

                const line = document.querySelector(`[data-line="${line_num}"]`);

                if (!line) return;

                if (paging) {
                    toastAlert({ title: '문단 공유 받지 못함', msg: '페이지 형식에서는 아직 지원하지 않습니다.', type: 'warn' });
                    return;
                }

                document.getElementById('novel_box').scrollTo({
                    top: line.offsetTop - 100,
                    behavior: localStorage['viewer_animation'] == 'on' ? 'smooth' : 'instant'
                });

                if (localStorage['viewer_animation'] == 'on') {
                    await setDelay(240);
                }

                Object.assign(line.style, {
                    borderLeft: '5px solid var(--novelpia-color)',
                    transition: 'border .24s'
                });

                setTimeout(() => {
                    Object.assign(line.style, {
                        borderLeftWidth: '0px'
                    });
                }, 2400);
            }


    // ---

            if (!routing)
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
            }
        }
    }
];

STRUCTURE.PRE_COMMON.ENGINE.setAdditionalExecution(() => {
    try {
        toastAlert({
            title: '시크릿 모드',
            msg: `시크릿 모드가 ${JSON.parse(localStorage.npup_secret_alert) ? '켜' : '꺼'}졌습니다.`
        });
        delete localStorage.npup_secret_alert;
    } catch (e) {}
});
