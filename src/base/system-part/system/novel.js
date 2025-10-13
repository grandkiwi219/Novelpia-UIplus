const novelCa = npup.options.novel.options;

novelCa['novel-page'].system = function(r) {
    let target = () => undefined;
    let handler = () => undefined;

    if (engineChecker('페이지')) {
        let attachTarget = () =>  undefined;

        if (pathChecker('/novel/')) {
            target = () => document.getElementById('episode_table');
            attachTarget = () => document.getElementById('episode_table');
        }
        else if (pathChecker('/collect_novel/')) {
            target = () => document.querySelector('div.d-flex.align-items-center.justify-content-center');
            attachTarget = () => document.getElementById('episode_list');
        }
        else return;

        handler = () => {
            novelPageItem(attachTarget);
            dynamicNovelPageItem(attachTarget);
        }
    }
    /* else if (engineChecker('뷰어')) {
        target = () => document.getElementById('list_box');
        handler = () => {
            console.log('hi')
        }
    } */
    else return;

    new MutationObserver((mus, ob) => {
        if (!target()) return;

        ob.disconnect();

        handler();
    }).observe(document.body, observer_setup);



    const novelPageItem = (findTarget = () => undefined) => {
        const target = findTarget();

        if (!target) return npup.error('페이지 아이템을 표시할 위치를 확인할 수 없습니다.');

        const page_items_tmp = document.querySelectorAll('div.d-flex.align-items-center.justify-content-center');
        const page_items = page_items_tmp[page_items_tmp.length - 1].cloneNode(true);
        page_items.style = 'border-top: 1px solid #EFEFEF; height: 80px';
        page_items.classList.add(`${npup.project.prefix.css}${this.key}`);

        const remained_page_item = document.getElementsByClassName(`${npup.project.prefix.css}${this.key}`)[0];

        if (remained_page_item) remained_page_item.replaceWith(page_items);
        else target.insertAdjacentElement('beforebegin', page_items);

        const page_selector_tmp = document.getElementsByClassName('select_episode_box');
        if (page_selector_tmp[0]) {
            const page_selector = page_selector_tmp[page_selector_tmp.length - 1].cloneNode(true);
            page_selector.style = 'margin-bottom: 20px;';

            //const remained_page_selector = document.getElementsByClassName(`${npup.project.prefix.css}${this.key}-selector`)[0];

            //if (remained_page_selector) remained_page_selector.replaceWith(page_selector); else
            target.insertAdjacentElement('beforebegin', page_selector);
        }

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

    function dynamicNovelPageItem(findTarget = () => undefined) {
        const target = document.getElementById('episode_list');

        const obs = new MutationObserver((mus, ob) => {
            if (mus[0].target.classList.contains('episode_count_view')) return;

            ob.disconnect();

            novelPageItem(findTarget);

            obs.observe(target, observer_setup);
        });

        obs.observe(target, observer_setup);

        removeEvent(() => {
            obs.disconnect();
        });
    }
}



novelCa['novel-notice-close'].system = function(r) {
    if (!pathChecker(['/novel/', '/collect_novel/'])) return;

    const addCloseFunction = (notice_table) => {
        const more_btn = document.getElementsByClassName('notice_toggle_btn')[0];

        if (!more_btn) return npup.log('공지 더보기 버튼이 없습니다.');

        const more_btn_display = more_btn.style.display == 'none';

        if (more_btn_display) {
            more_btn.style.display = '';
            const more_btn_content = more_btn.children[0];
            more_btn_content.innerHTML = more_btn_content.innerHTML.replace('더보기', '접기').replace('down', 'up');
        }

        more_btn.outerHTML = more_btn.outerHTML.replace('notice_toggle()', 'npupNoticeToggle()');

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
        else npup.dev('공지를 담는 요소를 찾지 못했습니다.');
    }

    targetHandler(
        () => document.getElementsByClassName('notice_table')[0] || document.querySelector('table[style*=width]:has(> * > .ep_style4)'),
        (t) => addCloseFunction(t)
    );

    const close_script = scriptInjection(`/src/base/file/${this.key}.js`);

    removeEvent(() => {
        close_script.remove();
    });
}
