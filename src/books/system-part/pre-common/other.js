const otherCa = npup.options.other.options;

otherCa['books-web-title'].system = function (r) {
    let result = webTitleAsset(r[this.key]);

    document.title = result;

    if (1) {
        const titleInterval = setInterval(() => {
            if (document.title == result) return;
            document.title = result;
            clearInterval(titleInterval);
        }, 1.5 * 1000); 

        setTimeout(() => {
            clearInterval(titleInterval);
        }, 10 * 1000);
    }
}
