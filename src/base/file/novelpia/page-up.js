(() => {
    if (localStorage['viewer_paging'] == '1') {
        this_page = 1;
        page_back();
        return;
    }

    switch (location.hash) {
        case '#comments':
            npupPageUp('comment_box');
            break;
        case '#':
        case '':
            npupPageUp('novel_box');
            break;
        default:
            break;
    }

    function npupPageUp(scroll_target) {
        document.getElementById(scroll_target).scrollTo({
            behavior: localStorage['viewer_animation'] == 'on' ? 'smooth' : 'instant',
            top: 0
        });
    }
})();