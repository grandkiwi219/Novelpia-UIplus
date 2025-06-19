(() => {
    const presr = project_prefix + l.s_r;

    const nothing = document.createElement('div');
    nothing.style = 'padding: 20px 0; width: 100%; text-align: center;';
    nothing.textContent = '최근 검색어가 없습니다.';

    document.addEventListener('click', (e) => {
        let target;

        document.querySelectorAll(`.${presr}-delete`).forEach(r => {
            if (r.contains(e.target))
                target = r;
        });

        if (!target) return;

        localStorage.search_novel_word = JSON.stringify(JSON.parse(localStorage.search_novel_word)
            .filter(k => k != target.parentElement.firstChild.textContent));

        if (!JSON.parse(localStorage.search_novel_word)[0]) {
            const items = target.parentElement.parentElement;
            const wrap = items.parentElement;

            wrap.appendChild(nothing);
            wrap.firstChild.children[1].remove();
            items.remove();
            return;
        }

        target.parentElement.remove();
    });

    document.addEventListener('click', (e) => {
        let target = document.getElementById(`${presr}-delete-all`);

        if (!target || !target.contains(e.target)) return;

        localStorage.search_novel_word = JSON.stringify([]);

        const wrap = target.parentElement.parentElement;

        wrap.appendChild(nothing);
        wrap.children[1].remove();
        target.remove();
    });
})();