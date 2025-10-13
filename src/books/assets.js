let books_dark = {
    id: `${npup.project.prefix.css}books-dark`,
    meta_id: `${npup.project.prefix.css}books-dark-theme`
}

function setBooksDark(engine_name, local_key) {
    let result;

    try {
        result = JSON.parse(localStorage.getItem(local_key));
    } catch (e) {
        result = false;
    }

    if (result) {
        if (engineChecker(engine_name)) {
            html.classList.remove(books_dark.id);
            setBooksDarkTheme('#fff');
        }
        localStorage.removeItem(local_key);
    }
    else {
        if (engineChecker(engine_name)) {
            html.classList.add(books_dark.id);
            setBooksDarkTheme('#000');
        }
        localStorage.setItem(local_key, JSON.stringify(!result));
    }

    return !result;
}

function setBooksDarkTheme(hex_color) {
    let target = document.getElementById(books_dark.meta_id);
    
    if (target) {
        target.content = hex_color;
        return;
    }

    target = document.createElement('meta');
    target.id = books_dark.meta_id;
    target.name = 'theme-color';
    target.content = hex_color;

    document.head.appendChild(target);
}