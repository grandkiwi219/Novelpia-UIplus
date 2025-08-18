const otherCa = npup.options.other.options;

otherCa['books-web-title'].system = function (r) {

    //노벨피아 - 웹소설로 꿈꾸는 세상! - PAGE
    let tc = document.title.split('-').map(t => t.trim());

    //normal/short/reverse-short/single/reverse-normal
    switch (r[this.key]) {
        case 'short':
            tc = tc[0] + (tc[2] ? ` - ${tc[2]}` : '');
            break;
        case 'reverse-short':
            tc = (tc[2] ? `${tc[2]} - ` : '') + tc[0];
            break;
        case 'single':
            tc = tc[2] ? tc[2] : tc[0];
            break;
        case 'reverse-normal':
            tc = (tc[2] ? `${tc[2]} - ` : '') + tc[0] + ' - ' + tc[1];
            break;
    }

    document.title = tc;

    if (!routing) {
        const titleInterval = setInterval(() => {
            if (document.title == tc) return;
            document.title = tc;
            clearInterval(titleInterval);
        }, 1.5 * 1000); 

        setTimeout(() => {
            clearInterval(titleInterval);
        }, 10 * 1000);
    }
}
