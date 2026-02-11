(() => {
    if (typeof getPageMark != 'function') {
        window.addEventListener('DOMContentLoaded', () => {
            getPageMark = overrideGetPageMark;
        });
        return;
    }

    getPageMark = overrideGetPageMark;

    function overrideGetPageMark() {
        const lists_legacy = localStorage['page_mark'];
        const novel_no = document.getElementById('novel_no').value;
        const content_no = document.getElementById('content_no').value;

        if (lists_legacy) {
            const lists = JSON.parse(lists_legacy);

            const filter_list = lists
                .filter(item => item.novel_no == novel_no);

            if (filter_list.length > 0 && filter_list[0].epi_no == content_no && filter_list[0].novel_no == novel_no) {
                return;
            }
            else if (filter_list.length > 0 && filter_list[0].epi_no != content_no && filter_list[0].novel_no == novel_no) {
                updateMarkEpi();
            }
            else {
                const arr = [{ "novel_no": novel_no, "epi_no": content_no, "page": this_page }, ...lists];

                if (lists.length > 100)
                    arr.pop();

                localStorage['page_mark'] = JSON.stringify(arr);
            }
        }
        else {
            const mark = {
                novel_no: novel_no,
                epi_no: content_no,
                page: this_page
            }
            localStorage['page_mark'] = JSON.stringify([mark]);
        }
    }
})();