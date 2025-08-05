npup.options.custom_css.options['custom-css'].system = function (r) {

    let style = document.createElement('style');
    style.insertAdjacentHTML('afterbegin', r[this.key]);

    tryChecker(() => {
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }, '커스텀', 'css', style);
}
