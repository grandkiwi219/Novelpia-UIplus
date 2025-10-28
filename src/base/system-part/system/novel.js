const novelCa = npup.options.novel.options;

novelCa['novel-page'].system = function(r) {
    let phs = (() => {
        if (engineChecker('페이지')) {
            if (pathChecker('/novel/')) {
                const wrapperTarget = () => document.getElementById('episode_table')
                return {
                    wrapperTarget,
                    pageTarget: () => document.getElementById('episode_list'),
                    attachTarget: wrapperTarget,
                    tHOption: { redetect: 1 }
                }
            }
            else if (pathChecker('/collect_novel/')) {
                const pageTarget = () => document.getElementById('episode_list')
                return {
                    wrapperTarget: () => document.querySelector('div.d-flex.align-items-center.justify-content-center'),
                    pageTarget,
                    attachTarget: pageTarget,
                    tHOption: { redetect: 1 }
                }
            }
            else
                return null;
        }
        else if (engineChecker('뷰어') && location.hash == '#lists') {
            const wrapperTarget = () => document.getElementById('episode_table')
            return {
                wrapperTarget,
                pageTarget: () => document.getElementById('episode_list_viewer'),
                attachTarget: wrapperTarget,
                tHOption: { redetect: 1 }
            }
        }
        else
            return null;
    })();

    if (!phs) return;

    const np_key = `${npup.project.prefix.css}${this.key}`;

    let select_episode = undefined;

    targetHandler(
        phs.wrapperTarget,
        () => {
            novelPageItem(phs.attachTarget);
            dynamicNovelPageItem(
                phs.pageTarget,
                phs.attachTarget
            );
            select_episode = scriptInjection('src/base/file/select-episode.js');
        },
        phs.tHOption
    );



    function novelPageItem(findTarget = () => undefined) {
        const target = findTarget();

        if (!target) return npup.error('페이지 아이템을 표시할 위치를 확인할 수 없습니다.');

        const page_items_tmp = document.querySelectorAll('div.d-flex.align-items-center.justify-content-center');
        const page_items = page_items_tmp[page_items_tmp.length - 1].cloneNode(true);
        page_items.style = 'border-top: 1px solid #EFEFEF; height: 80px';
        page_items.classList.add(np_key);

        target.esrender('beforebegin', page_items);

        const page_selector_tmp = document.getElementsByClassName('select_episode_box');
        if (page_selector_tmp[0]) {
            function reFunc(el) {
                el.outerHTML = el.outerHTML.replace('select_episode()', 'npupSelectEpisode(this.parentElement)');
            }

            const origin = page_selector_tmp[page_selector_tmp.length - 1];
            reFunc(origin);

            const page_selector = origin.cloneNode(true);
            page_selector.style = 'margin-bottom: 20px;';
            page_selector.classList.add(`${np_key}-selector`);

           target.esrender('beforebegin', page_selector);

            reFunc(page_selector);
        }
    }

    function dynamicNovelPageItem(obTarget = () => undefined, findTarget = () => undefined) {
        const obs = new MutationObserver((mus, ob) => {
            if (mus[0].target.classList.contains('episode_count_view')) return;

            ob.disconnect();

            novelPageItem(findTarget);

            obs.observe(obTarget(), observer_setup);
        });

        obs.observe(obTarget(), observer_setup);

        removeEvent(() => {
            obs.disconnect();
        });
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
        try {
            select_episode.remove();
        } catch (error) {}
    });
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
