/** system: other */
const webTitleSystem = (r) => {
    if (!r[l.w_title] || r[l.w_title] == 'normal') return;

    //노벨피아 - 웹소설로 꿈꾸는 세상! - PAGE
    let tc = document.title.split('-').map(r => r.trim());

    //normal/short/reverse-short/single/reverse-normal
    switch (r[l.w_title]) {
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

new SystemStructure(l.w_title, STRUCTURE.PRE_COMMON.TYPE)
    .setSystem(webTitleSystem)
.setup();
