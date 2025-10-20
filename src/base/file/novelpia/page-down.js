(() => {
    if (localStorage['viewer_paging'] == '1') {
        this_page = max_page - 1;
        page_next();
        return;
    }

    switch (location.hash) {
        case '#comments':
            npupPageDown('comment_box', 'comment_load');
            break;
        case '#':
        case '':
            npupPageDown('novel_box', 'novel_drawing');
            break;
        default:
            break;
    }

    function npupPageDown(scroll_target, height_target) {
        const target = document.getElementById(scroll_target);
        target.scrollTo({
            behavior: localStorage['viewer_animation'] == 'on' ? 'smooth' : 'instant',
            top: document.getElementById(height_target).offsetHeight - (localStorage['viewer_nextepi'] == 'on' ? target.offsetHeight + 100 : 0)
        });
    }
})();