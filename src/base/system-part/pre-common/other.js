npup.options.other.options['web-title'].system = function (r) {
    if (!r[this.key] || r[this.key] == 'normal') return;

    //노벨피아 - 웹소설로 꿈꾸는 세상! - PAGE
    let tc = document.title.split('-').map(r => r.trim());

    //normal/short/reverse-short/single/reverse-normal
    switch (r[this.key]) {
        case 'short':
            document.title = tc[0] + (tc[2] ? ` - ${tc[2]}` : '');
            break;
        case 'reverse-short':
            document.title = (tc[2] ? `${tc[2]} - ` : '') + tc[0];
            break;
        case 'single':
            document.title = tc[2] ? tc[2] : tc[0];
            break;
        case 'reverse-normal':
            document.title = (tc[2] ? `${tc[2]} - ` : '') + tc[0] + ' - ' + tc[1];
            break;
    }
}
