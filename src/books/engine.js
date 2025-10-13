engine = [
    {
        name: '페이지',
        matches: ['/'],
        excludes: ['/viewer/'],
    },

    {
        name: '뷰어',
        matches: ['/viewer/'],
    },
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
    
    if (books_dark_result) {
        html.classList.add(books_dark.id);
        setBooksDarkTheme('#000');
    }

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
        setBooksDarkTheme('#fff');
    });
});
