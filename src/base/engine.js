let line_sharing_success = false;

engine = [
    {
        name: '페이지',
        matches: ['/'],
        excludes: ['/viewer/', '/viewer_collect/', '/comic_viewer/', '/page/block/', '/proc/payment_complete/'],
        execution: async function(r, settings) {
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
        execution: function(r, settings) {
            (() => {
                if (line_sharing_success) return;

                line_sharing_success = true;

                const paging = localStorage['viewer_paging'] == '1';

                const search = location.search.slice(1);
                const line_num = Number(search.split('&').find(r => r.startsWith('line='))?.slice(5));

                if (Number.isNaN(line_num)) return;

                scriptInjection('src/base/file/novelpia/get-page-mark.js');

                if (dom_loaded)
                    lineShare(paging, line_num);
                else
                    window.addEventListener('DOMContentLoaded', () => lineShare(paging, line_num));
            })();

            function getDataLineEl(line_num) {
                return document.querySelector(`[data-line="${line_num}"]`);
            }

            async function lineShare(paging, line_num) {

                await setDelay(600);

                if (paging) {
                    pageLineShare(line_num);
                    return;
                }

                scrollLineShare(line_num);
            }

            async function pageLineShare(line_num) {
                document.getElementsByTagName(npup.project.engine)[0].setAttribute('line', line_num);
                scriptInjection('src/base/file/page-line-share.js');

                await setDelay(localStorage['viewer_animation'] == 'on' ? 300 : 200);

                highlightLine(line_num, localStorage['viewer_animation'] == 'on' ? 2700 : 2500);
            }

            async function scrollLineShare(line_num) {

                const line = getDataLineEl(line_num);

                if (!line) return;
                
                document.getElementById('novel_box').scrollTo({
                    top: line.offsetTop - 100,
                    behavior: localStorage['viewer_animation'] == 'on' ? 'smooth' : 'instant'
                });

                await setDelay(200);

                highlightLine(line_num, localStorage['viewer_animation'] == 'on' ? 3700 : 2500);
            }

            async function highlightLine(line_num, sec) {

                const line = getDataLineEl(line_num);

                if (!line) return;

                Object.assign(line.style, {
                    width: '100%',
                    backgroundColor: 'rgb(178, 178, 178, 0.28)',
                    borderLeft: '6px solid var(--novelpia-color)',
                    transition: 'border .24s, background-color .24s',
                    display: 'inline-block'
                });

                await setDelay(sec);

                Object.assign(line.style, {
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    borderLeftWidth: '0px',
                });
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

STRUCTURE.PRE_COMMON.ENGINE.setAdditionalExecution(function() {
    try {
        toastAlert({
            title: '시크릿 모드',
            msg: `시크릿 모드가 ${JSON.parse(localStorage.npup_secret_alert) ? '켜' : '꺼'}졌습니다.`
        });
        delete localStorage.npup_secret_alert;
    } catch (e) {}
});
