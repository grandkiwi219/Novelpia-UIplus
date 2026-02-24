(() => {
    if (localStorage['viewer_paging'] == '1') {
        document.getElementById('novel_drawing_page_c').addEventListener('scroll', () => {
            if (toggle_navi == 0) navi_view();
        });
    }
    else {
        document.getElementById('novel_box').addEventListener('scroll', () => {
            if (toggle_navi == 0) navi_view();
        });
    }
})();