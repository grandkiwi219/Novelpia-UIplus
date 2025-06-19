/** system: novel */
const novelPageSystem = (r) => {
    if (!r[l.no_pa] || !pathChecker('/novel/')) return;

    new MutationObserver((mus, ob) => {
        if (!document.getElementById('episode_table')) return;

        ob.disconnect();;

        novelPageItem(r);
        dynamicNovelPageItem(r);
    }).observe(document.body, observer_setup);
}

new SystemStructure(l.no_pa, STRUCTURE.SYSTEM.TYPE)
    .setSystem(novelPageSystem)
.setup();

function novelPageItem(r) {
    const page_items_tmp = document.querySelectorAll('div.s_inv.d-flex.align-items-center.justify-content-center');
    const page_items = page_items_tmp[page_items_tmp.length - 1].cloneNode(true);
    page_items.style = 'border-top: 1px solid #EFEFEF; height: 80px'

    const page_selector_tmp = document.getElementsByClassName('select_episode_box');
    const page_selector = page_selector_tmp[page_selector_tmp.length - 1].cloneNode(true);
    page_selector.style = 'margin-bottom: 20px;';

    const target = document.getElementById('episode_table');

    target.insertAdjacentElement('beforebegin', page_items);
    target.insertAdjacentElement('beforebegin', page_selector);

    document.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            const target = document.getElementsByClassName(`select_episode_box`);
            for (let i = 0; i < target.length; i++)
                target[i].style.display = 'none';
        }
    });
}
    
function dynamicNovelPageItem(r) {
    const target = document.getElementById('episode_list');

    const obs = new MutationObserver((mus, ob) => {
        if (mus[0].target.classList.contains('episode_count_view')) return;

        ob.disconnect();

        novelPageItem(r);

        obs.observe(target, observer_setup);
    });

    obs.observe(target, observer_setup);
}
