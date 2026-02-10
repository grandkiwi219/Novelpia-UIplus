const experimentalCa = npup.options.experimental.options;

experimentalCa['search-in-mybook'].system = function(r) {
    if (!pathChecker('/mybook/') || pathChecker('/mybook/collect/')) return;

    const system_key = this.key;

    const key = 'mybook-data-tag-search';

    let keep_data = {};
    const keep_key = 'mybook-data-tag-search-data';

    try {
        keep_data = JSON.parse(localStorage[keep_key]) || {};
    } catch (e) {}

    if (typeof keep_data !== 'object' && keep_data === null) keep_data = {};

    const wrap = el('div');
    wrap.classList.add('mybook-data-option-box');
    wrap.classList.add('s_inv');
    wrap.classList.add('mybook-data-search');
    Object.assign(wrap.style, {
        justifyContent: 'flex-start',
        gap: '5px 25px',
        flexWrap: 'wrap',
        lineHeight: 'inherit'
    });

    const text = el('b');
    text.textContent = '검색';
    wrap.appendChild(text);
    Object.assign(text.style, {
        userSelect: 'none'
    });

    const search_wrap = el('div');
    Object.assign(search_wrap.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: '14px'
    });

    const input = el('input');
    input.id = key;
    Object.assign(input.style, {
        width: '200px',
        height: '30px',
    });
    if (keep_data.use) input.value = keep_data.content.trim();
    search_wrap.appendChild(input);

    const btn = el('button');
    btn.id = key + '-btn';
    btn.textContent = '확인';
    Object.assign(btn.style, {
        height: '30px',
        cursor: 'pointer'
    });
    search_wrap.appendChild(btn);

    const reset = el('button');
    reset.id = key + '-reset';
    reset.textContent = '초기화';
    Object.assign(reset.style, {
        height: '30px',
        marginLeft: '5px',
        cursor: 'pointer'
    });
    search_wrap.appendChild(reset);

    wrap.appendChild(search_wrap);

    const keep_wrap = el('div');
    Object.assign(keep_wrap.style, {
        width: 'fit-content',
        height: 'fit-content',
    });

    const keep = el('label');
    keep.htmlFor = key + '-keep';
    Object.assign(keep.style, {
        boxSizing: 'border-box',

        height: '30px',

        padding: '0 5px',
        margin: 0,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',

        lineHeight: '14px',

        cursor: 'pointer'
    });
    keep_wrap.appendChild(keep);

    const ki = el('input');
    ki.id = key + '-keep';
    ki.type = 'checkbox';
    if (keep_data.use) ki.checked = true;
    Object.assign(ki.style, {
        cursor: 'pointer'
    });
    keep.appendChild(ki);

    const kl = el('span');
    kl.textContent = '다음 페이지에서 유지';
    Object.assign(kl.style, {
        userSelect: 'none'
    });
    keep.appendChild(kl);

    wrap.appendChild(keep_wrap);

    // nd r-d
    targetHandler(
        () => document.querySelector('.mybook-data-option-box:has(.novel-count)'),
        async (target) => {
            target.esrender('beforebegin', wrap);

            ki.addEventListener('change', (event) => {
                if (ki.checked) {
                    try {
                        localStorage[keep_key] = JSON.stringify({ use: true, content: input.value.trim() });
                    } catch (e) {}
                    toastAlert({ title: '다음 페이지 새로고침시', msg: '현 검색 결과를\n"유지합니다."' });
                } else {
                    localStorage.removeItem(keep_key);
                    toastAlert({ title: '다음 페이지 새로고침시', msg: '현 검색 결과를\n"유지하지 않습니다."' });
                }
            });

            if (keep_data.use) {
                if (dom_loaded)
                    searchItems();
                else 
                    window.addEventListener('DOMContentLoaded', searchItems);
            }

            input.addEventListener('keydown', (e) => {
                if (e.key != 'Enter') return;
                
                e.preventDefault();
                
                decideInputData();

                searchItems();
            });  

            btn.addEventListener('click', (e) => {
                decideInputData();

                searchItems();
            });

            reset.addEventListener('click', (e) => {
                input.value = '';

                decideInputData();

                searchItems();
            });
        }
    );

    function decideInputData() {
        let result = {};
        try {
            result = JSON.parse(localStorage[keep_key]) ?? {};
        } catch (error) {
            
        }
        if (typeof result !== 'object' && result === null) result = {};
        if (result.use) {
            try {
                localStorage[keep_key] = JSON.stringify({ use: true, content: input.value.trim() });
            } catch (e) { }
        } else {
            localStorage.removeItem(keep_key);
        }
    }

    function searchItems() {
        const els = document.querySelectorAll('.novel-list-real-container');

        const blank = input.value.trim() == '';
        
        els.forEach(el => {
            let save = blank;

            if (!save) {
                const i_value = input.value.trim().toLowerCase();

                if (canUse('tag')) {
                    const tags = el.querySelectorAll('.novel-tag > *');

                    for (const tag of tags) {
                        if (tag.textContent.toLowerCase().includes(i_value)) {
                            save = true;
                            break;
                        }
                    }
                }

                if (!save) {
                    const i_value_no_space = i_value.replaceAll(' ', '');
    
                    if (canUse('title')) {
                        (() => {
                            const title = el.querySelector('.novel-name').textContent.toLowerCase();
                            const title_no_space = title.replaceAll(' ', '');
        
                            if (title_no_space.includes(i_value_no_space))
                                return save = true;
        
                            const title_pieces = title.split(' ');
                            const title_firsts = title_pieces.map(p => p.slice(0, 1)).join('');
        
                            if (title_firsts.includes(i_value_no_space))
                                return save = true;
                        })();
                    }
    
                    if (!save && canUse('name')) {
                        const name = el.querySelector('.writer-name').textContent.trim().toLowerCase();
    
                        if (name.includes(i_value_no_space)) save = true;
                    }
                }
            }

            if (save) el.style.display = 'block';
            else el.style.display = 'none';
        });

        function canUse(param) {
            return r[system_key].includes(param);
        }
    }

    /**
     * @returns {HTMLElement}
     */
    function el(str) {
        return document.createElement(str);
    }
}
