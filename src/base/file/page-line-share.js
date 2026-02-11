(() => {
    const [engine] = document.getElementsByTagName(npup.project.engine);

    if (!engine) return;

    const line = engine.getAttribute('line');

    if (!line) return;

    const line_el = document.querySelector(`[data-line="${line}"]`);

    const novel_page_width = page_width();

    const margin = (window.innerWidth / 2) - (novel_page_width / 2);

    const page = Math.floor((line_el.offsetLeft - margin) / novel_page_width);

    page_goto(this_page + page);
})();
