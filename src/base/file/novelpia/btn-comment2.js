(() => {
    if (location.hash == '#comments') {
        btn_comment2();
        setTimeout(() => {
            navi_view();
        }, 4);
    }
    else {
        if (toggle_navi == 1) toggle_navi = 0;
        btn_comment2();
    }
})();