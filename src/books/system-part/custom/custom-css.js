npup.options.custom_css.options['books-custom-css'].system = function (r) {
    const id = `${npup.project.prefix.css}${this.key}`;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = r[this.key];

    if (document.getElementById(id))
        document.getElementById(id).remove();
    
    tryChecker(() => {
        document.head.appendChild(style);
    }, '커스텀', 'css', style);
}
