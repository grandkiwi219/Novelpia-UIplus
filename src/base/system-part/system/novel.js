const novelCa = npup.options.novel.options;

novelCa['novel-page'].system = function(r) {
    if (!pathChecker('/novel/')) return;

    new MutationObserver((mus, ob) => {
        if (!document.getElementById('episode_table')) return;

        ob.disconnect();

        novelPageItem();
        dynamicNovelPageItem();
    }).observe(document.body, observer_setup);
}


function novelPageItem() {
    const page_items_tmp = document.querySelectorAll('div.s_inv.d-flex.align-items-center.justify-content-center');
    const page_items = page_items_tmp[page_items_tmp.length - 1].cloneNode(true);
    page_items.style = 'border-top: 1px solid #EFEFEF; height: 80px'

    const page_selector_tmp = document.getElementsByClassName('select_episode_box');
    const page_selector = page_selector_tmp[page_selector_tmp.length - 1].cloneNode(true);
    page_selector.style = 'margin-bottom: 20px;';

    const target = document.getElementById('episode_table');

    target.insertAdjacentElement('beforebegin', page_items);
    target.insertAdjacentElement('beforebegin', page_selector);

    function novelPageItemEsc(e) {
        if (e.key == 'Escape') {
            const target = document.getElementsByClassName(`select_episode_box`);
            for (let i = 0; i < target.length; i++)
                target[i].style.display = 'none';
        }
    }

    document.addEventListener('keydown', novelPageItemEsc);

    removeEvent(() => {
        document.removeEventListener('keydown', novelPageItemEsc);
    });
}
    
function dynamicNovelPageItem() {
    const target = document.getElementById('episode_list');

    const obs = new MutationObserver((mus, ob) => {
        if (mus[0].target.classList.contains('episode_count_view')) return;

        ob.disconnect();

        novelPageItem();

        obs.observe(target, observer_setup);
    });

    obs.observe(target, observer_setup);

    removeEvent(() => {
        obs.disconnect();
    });
}

novelCa['novel-notice-close'].system = function(r) {
    if (!pathChecker('/novel/')) return;

    const addCloseFunction = () => {
        const more_btn = document.getElementsByClassName('notice_toggle_btn')[0];

        if (!more_btn) return npup.log('공지 더보기 버튼이 없습니다.');

        const more_btn_display = more_btn.style.display == 'none';

        if (more_btn_display) {
            more_btn.style.display = '';
            const more_btn_content = more_btn.children[0];
            more_btn_content.innerHTML = more_btn_content.innerHTML.replace('더보기', '접기').replace('down', 'up');
        }

        more_btn.outerHTML = more_btn.outerHTML.replace('notice_toggle()', 'npupNoticeToggle()');

        const notice_table = document.getElementsByClassName('notice_table')[0];

        if (notice_table.getElementsByClassName('ep_style4').length > 7) {
            const more_btn_long = more_btn.cloneNode(true);

            more_btn_long.style.height = 'fit-content';
            if (more_btn_display) more_btn_long.style.display = '';
            else more_btn_long.style.display = 'none';

            more_btn_long.classList.add('ep_style4');

            notice_table.children[0].appendChild(more_btn_long);

            more_btn_long.outerHTML = more_btn_long.outerHTML
                .replace('notice_toggle()', 'npupNoticeToggleLong()')
                .replace('더보기', '접기')
                .replace('down', 'up');
        }
    }

    targetHandler(() => document.getElementsByClassName('notice_table')[0], () => addCloseFunction());

    const close_script = scriptInjection(`/src/base/file/${this.key}.js`);

    removeEvent(() => {
        close_script.remove();
    });
}
