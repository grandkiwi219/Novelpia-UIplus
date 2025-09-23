function loadComplete() {
    document.getElementById('options').addEventListener('click', () => {
        openOptions();
    });
    
    

    const scroll_category = document.getElementById('p-mybook-category-wrap');
    
    let scrollAmount = 0;
    let isScrolling = false;
    
    scroll_category.addEventListener('wheel', function (e) {
        e.preventDefault();
    
        scrollAmount += e.deltaY;
    
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(smoothScroll);
        }
    }, { passive: false });
    
    function smoothScroll() {
        scroll_category.scrollLeft += scrollAmount * 0.2;
        scrollAmount *= 0.7;
    
        if (Math.abs(scrollAmount) > 0.5) {
            requestAnimationFrame(smoothScroll);
        } else {
            isScrolling = false;
        }
    }

    const reloadMybookDataFunc = () => {
        resolveMybookData({ thumb_off: thumb_off });
    }

    document.getElementById(npup_need_id).addEventListener('click', reloadMybookDataFunc);

    document.addEventListener('keydown', e => {
        const active = document.activeElement;

        if (
            active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.isContentEditable
        ) return;

        const key_match = e.code != 'F5';
        
        if (
            (key_match) ||
            (!key_match && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey))
        ) return

        e.preventDefault();

        reloadMybookDataFunc();
    });

    document.addEventListener('click', e => {
        mybookDataAttribute(e);
        getNextEpAttribute(e);
    });
}
window.addEventListener('DOMContentLoaded', loadComplete);






const mb_func_att = 'mybook-data';
const gne_func_att = 'get-next-ep';

function mybookDataAttribute(e) {
    if (!e.target.getAttribute(mb_func_att)) return;

    const att_data = e.target.getAttribute(mb_func_att).split(',');

    const data = {
        tab: att_data ? att_data[0] : 'last_view',
        category: att_data.length > 1 && att_data[1] ? att_data[1] : null,
        page: att_data.length > 2 ? att_data[2] : 1,
        order: att_data.length > 3 ? att_data[3] : 'date'
    };

    setMybookLocationData(data);
    setMybookData();

    const mybook_wrap = document.getElementById('p-mybook');

    mybook_wrap.setAttribute('page', data.page);
    mybook_wrap.setAttribute('order', data.order);

    resolveMybookData({ thumb_off: thumb_off });
}

function getNextEpAttribute(e) {
    if (!e.target.getAttribute(gne_func_att)) return;

    const att_data = e.target.getAttribute(gne_func_att).split(',');

    const data = {
        'mode': 'get_next_episode',
        'novel_no': parseInt(att_data[0]),
        'novel_epi_no': att_data.length > 1 ? parseInt(att_data[1]) : 0
    }

    getNextEp(data);
}




async function getNextEp(novel_data) {
    try {
        const response = await fetch(novelpia + '/proc/mybook', {
            method: 'POST',
            body: new URLSearchParams(novel_data)
        });

        const data = await response.json();

        if (data.status == '200') {
            if (data.result.next_episode_no && data.result.next_episode_no !== '') {
                if (data.result.wait_episode == '1') {
                    console.log(`공개 전 소설 (id: ${novel_data['novel_no']})`, `\n다음 소설 회차 오픈시간: ${data.result.content_viewdate}`);
                } else {
                    console.log(`다음 회차로 이동합니다. (id: ${novel_data['novel_no']}) (ep_id: ${data.result.next_episode_no})`);
                    try {
                        chrome.tabs.create({ url: novelpia + '/viewer/' + data.result.next_episode_no });
                    } catch (e) {
                        window.open(novelpia + '/viewer/' + data.result.next_episode_no);
                        console.error(e);
                    }
                }
            } else {
                if (data.result.end_episode == '1') {
                    console.log('마지막 회차 소설.');
                } else {
                    setInitNextEp(novel_data);
                }
            }
        } else if (data.status == '401') {
            console.log('로그인이 필요함.');
        } else {
            console.log(data.errmsg);
        }
    } catch (e) {
        console.error(e);
    }
}

async function setInitNextEp(novel_data) {
    novel_data['mode'] = 'set_init_next_episode';

    try {
        const response = await fetch(novelpia + '/proc/mybook', {
            method: 'POST',
            body: new URLSearchParams(novel_data)
        });

        const data = await response.json();

        if (data.status == '200') {
            console.log(data);
            console.log(data.result);
        } else if (data.status == '401') {
            console.log('로그인이 필요함.');
        } else {
            console.log(data.errmsg);
        }
    } catch (e) {
        console.error(e);
    }
}


function changeNovelLogo(url) {
    document.querySelector('a.normal-button:has(#novel-logo)')
    .href = url;
}




/* 초기화된 마지막 내서재 정보를 들고온다 */
async function resolveMybookData({ open = false, thumb_off = false } = {}) {
    if (loadStateMybookData()) return;

    const mybook_wrap = document.getElementById('p-mybook-novel-wrap');
    const category_wrap = document.getElementById('p-mybook-category-wrap');

    if (!mybook_wrap.classList.contains('waiting')) {
        mybook_wrap.className = '';
        mybook_wrap.classList.add('waiting');
        mybook_wrap.innerHTML = '';
    } 

    
    try {
        let last_data = getMybookLocationData();
    
        if (!last_data.tab) last_data.tab = 'last_view';
    
        const active_tab = document.querySelector('.p-mybook-tab.active');
        if (active_tab) active_tab.classList.remove('active');
    
        document.getElementById(last_data.tab).classList.add('active');
    
    
        const mb_att = document.getElementById('p-mybook');
        mb_att.setAttribute('tab', last_data.tab || mybook_value.location.tab);
        mb_att.setAttribute('category', last_data.category || mybook_value.location.category);
        mb_att.setAttribute('page', last_data.page || mybook_value.location.page);
        mb_att.setAttribute('order', last_data.order || mybook_value.location.order);
    
        const tab_att =  mb_att.getAttribute('tab');
        let category_att = mb_att.getAttribute('category');
    
        const page_att = mb_att.getAttribute('page');
        const order_att = mb_att.getAttribute('order');
    
        let mybook_data;
    
        const expiration_period = confirmExpirationPeriod();
        
        if (open && expiration_period.status) {
            mybook_data = getMybookData();
            console.log('데이터가 유효합니다.');
            console.log(`데이터의 남은 유효기간: ${expiration_period.expiration_period}`);
            if (mybook_data?.url) console.log(`데이터의 원위치: ${mybook_data.url}`);

            if (mybook_data?.status >= 4) {
                console.log('데이터의 상태가 좋지 않습니다. 데이터를 다시 불러옵니다.');

                if (!await mybookDataSetup())
                    return mybook_wrap.classList.add('blocked');
            }
        }
        else {
            if (!await mybookDataSetup()) 
                return mybook_wrap.classList.add('blocked');
        }

        async function mybookDataSetup() {
            try {
                mybook_data = await loadMybookData(last_data.tab, last_data.category, page_att, order_att);
                setMybookData(mybook_data);
                updateExpirationPeriod();
                return true;
            } catch (e) {
                setMybookData();
                console.error(e.stack);
                localStorage.mybook_error = new Date() + '\n' + e.stack;
                return false;
            }
        }
    
    
        changeNovelLogo(mybook_data.url);
    
        const novel_data = mybook_data.data;
    
        setMybookLocationData({
            tab: mb_att.getAttribute('tab'),
            category: mb_att.getAttribute('category'),
            page: mb_att.getAttribute('page'),
            order: mb_att.getAttribute('order')
        });
    
        mybook_wrap.classList.remove('waiting');
        
        categorySetup();
    
        pageSetup();
    
        let status = undefined;
    
        switch (mybook_data.status) {
            case 3:
                status = 'empty';
                break;
            case 4:
                status = 'logout';
                break;
            case 5:
                status = 'failed';
                break;
            case 6:
                status = 'error';
                break;
        }
    
        if (status)
            return mybook_wrap.classList.add(status);
    
        novel_data.books.forEach(r => mybook_wrap.appendChild(novelItem(r, { thumb_off: thumb_off })));




        async function categorySetup() {
            category_wrap.innerHTML = '';
            novel_data.category?.forEach(r => {
                const category = document.createElement('button');
                category.classList.add('p-mybook-category');
                if (r.id == last_data.category) category.classList.add('active');
                category.id = r.id;
                category.textContent = r.name;
                category.setAttribute(mb_func_att, `${last_data.tab},${r.id},${page_att},${order_att}`);
    
                category_wrap.appendChild(category);
            });
    
            if (!last_data.category && last_data.category != 0) {
                if (!category_wrap.children[0]) {
                    mb_att.setAttribute('category', 0);
                }
                else {
                    category_wrap.children[0].classList.add('active');
                    mb_att.setAttribute('category', category_wrap.children[0].id);
                    category_att = mb_att.getAttribute('category');
                }
                setMybookLocationData({ tab: tab_att, category: category_att, page: page_att, order: order_att });
            }
        }
    
        async function pageSetup() {
            const page_items = document.querySelectorAll('.p-mybook-page-items');
        
            if (!novel_data.page || novel_data.page?.last <= 1) return page_items.forEach(ptem => ptem.innerHTML = '');
        
            const page_side_size = 2;
            
            page_items.forEach(ptem => {
                ptem.innerHTML = '';
        
                const first_page = pageItem(1, { content: '<<' });
        
                ptem.appendChild(first_page);
        
                let last_set_page = novel_data.page.active;
        
                for (let i = novel_data.page.active - 1; i >= 1 && i >= novel_data.page.active - page_side_size; i--) {
                    first_page.insertAdjacentElement('afterend', pageItem(i));
                    last_set_page--;
                }
        
                if (last_set_page > 1) {
                    first_page.insertAdjacentElement('afterend', pageItem(last_set_page - 1, { content: '<' }));
                } else {
                    first_page.insertAdjacentElement('afterend', pageItem(1, { content: '<' }));
                }
        
                ptem.appendChild(pageItem(novel_data.page.active, { active: true }));
        
                last_set_page = novel_data.page.active;
        
                for (let i = novel_data.page.active + 1; i <= novel_data.page.last && i <= novel_data.page.active + page_side_size; i++) {
                    ptem.appendChild(pageItem(i));
                    last_set_page++;
                }
        
                if (last_set_page < novel_data.page.last) {
                    ptem.appendChild(pageItem(last_set_page + 1, { content: '>' }));
                } else {
                    ptem.appendChild(pageItem(novel_data.page.last, { content: '>' }));
                }
        
                ptem.appendChild(pageItem(novel_data.page.last, { content: '>>' }));
            });
        }

        function pageItem(page_num, { content = undefined, active = false } = {}) {
            const el = document.createElement('button');
            el.classList.add('p-mybook-page-item');
            if (active) el.classList.add('active');
            el.setAttribute('mybook-data', `${tab_att},${category_att},${page_num},${order_att}`);
            if (content) {
                el.textContent = content;
                el.title = page_num;
            } else {
                el.textContent = page_num;
            }
            return el;
        }
    } catch (e) {
        mybook_wrap.classList.add('crash');
        setMybookData();
        console.error(e.stack);
        localStorage.mybook_error = new Date() + '\n' + e.stack;
        // error port?
    }
}





function novelItem(mybook_data, { thumb_off = false } = {}) {
    const data = {
        title: mybook_data?.title || '알 수 없음',
        author: {
            name: mybook_data?.author?.name || '알 수 없음',
            id: mybook_data?.author?.id
        },
        thumb: thumb_off ? `https://images.novelpia.com/img/layout/readycover4.wimg` : (mybook_data?.thumbnail || `https://images.novelpia.com/img/layout/readycover4.wimg`),
        id: mybook_data?.id || '',
        adult: mybook_data?.adult,
        continue: {
            ep: mybook_data?.continue?.ep,
            id: mybook_data?.continue?.id
        },
        next: {
            status: mybook_data?.next?.status,
            parameter: mybook_data?.next?.parameter
        },
        open: mybook_data?.open,
        type: mybook_data?.type || 'normal',
    }

    const novelpia = 'https://novelpia.com/'

    const wrap = document.createElement('div');
    wrap.classList.add('p-novel-item-wrap');

    const item = document.createElement('div');
    item.classList.add('p-novel-item');


    const thumb = document.createElement('a');
    thumb.classList.add('p-novel-thumb');
    thumb.title = data.title;
    thumb.target = '_blank';
    thumb.rel = 'noopener';
    thumb.href = `${novelpia}novel/${data.id}`;

    const thumb_img = document.createElement('img');
    thumb_img.src = data.thumb;
    thumb_img.alt = data.thumb;

    if (data.adult) {
        const adult = document.createElement('div');
        adult.classList.add('p-novel-adult-mark');

        thumb.appendChild(adult);
    }

    thumb.appendChild(thumb_img);
    item.appendChild(thumb);


    const info = document.createElement('div');
    info.classList.add('p-novel-info');

    const title = document.createElement('a');
    title.classList.add('p-novel-title');
    title.title = data.title;
    if (data.id) title.href = `${novelpia}${data.type == 'collect' ? 'collect_' : ''}novel/${data.id}`;
    title.target = '_blank';
    title.rel = 'noopener';
    title.textContent = data.title;

    const author = document.createElement('a');
    author.classList.add('p-novel-author');
    author.title = data.author.name;
    if (data.author.id) author.href = `${novelpia}user/${data.author.id}`;
    else author.classList.add('disabled');
    author.target = '_blank';
    author.rel = 'noopener';
    author.textContent = data.author.name;

    info.appendChild(title);
    info.appendChild(author);

    if (data.open) {
        const open_time = document.createElement('div');
        open_time.classList.add('p-novel-open');
        open_time.textContent = data.open;

        info.appendChild(open_time);
    }

    item.appendChild(info);


    wrap.appendChild(item);


    const btns = document.createElement('div');
    btns.classList.add('p-novel-btns');

    if (data.type == 'collect') {
        0;
    }
    else if (data.continue.ep && data.continue.id) {
        const continue_btn = document.createElement('a');
        continue_btn.classList.add('normal-button');
        continue_btn.classList.add('continue');
        continue_btn.target = '_blank';
        continue_btn.rel = 'noopener';
        if (typeof data.continue.id == 'string') continue_btn.href = `${novelpia}viewer/${data.continue.id}`;
        else continue_btn.classList.add('disabled');
        continue_btn.textContent = `EP.${typeof data.continue.ep == 'string' ? data.continue.ep : '?'} 이어보기`;

        const next_btn = document.createElement('button');
        next_btn.classList.add('normal-button');
        next_btn.classList.add('next');
        if (data.next.status == 1) {
            if (typeof data.next.parameter == 'string') {
                next_btn.setAttribute('get-next-ep', data.next.parameter);
                next_btn.textContent = '다음화 보기';
            }
            else {
                nextDisable('불러올 수 없음');
            }
        }
        else if (data.next.status == 2) {
            nextDisable('예약회차 있음');
        }
        else {
            nextDisable('신규회차 없음');
        }

        btns.appendChild(continue_btn);
        btns.appendChild(next_btn);

        function nextDisable(content) {
            next_btn.classList.add('disabled');
            next_btn.textContent = content;
        }
    }
    else {
        const next_btn = document.createElement('a');
        next_btn.classList.add('normal-button');
        next_btn.classList.add('next');
        next_btn.classList.add('disabled');
        next_btn.textContent = '불러올 수 없음';

        btns.appendChild(next_btn);
    }

    wrap.appendChild(btns);

    return wrap;
}
