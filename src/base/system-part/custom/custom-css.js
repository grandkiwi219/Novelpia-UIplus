npup.options.custom_css.options['custom-css'].system = function (r) {
    tryChecker(() => {
        styleInjection(`${npup.project.prefix.css}${this.key}`, r[this.key]);
    }, '커스텀', 'css', `Id: ${npup.project.prefix.css}${this.key}`);
}
