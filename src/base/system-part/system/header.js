const headerCa = npup.options.header.options;

headerCa['adult'].system = function(r) {
    targetHandler(
        () => document.querySelector('.switch-adult'),
        (target) => {
            document.querySelectorAll('.s-logo').forEach(re => {
                let adult_button = target.cloneNode(true);
                adult_button.style = 'cursor: pointer;';

                re.esrender('afterend', adult_button);
            });
        }
    );
}





headerCa['search'].system = function(r) {
    
    document.getElementsByClassName('header-search')[0]?.remove();

    const search_icon = document.createElement('div');
    search_icon.classList.add(`${npup.project.prefix.css}search-base`);

    search_icon.innerHTML = ''
        + `<form id="${npup.project.prefix.css}search-form" class="${npup.project.prefix.css}search-header" autocomplete="off">`
                + `<input id="search_input" class="${npup.project.prefix.css}search-box" type="text" name="search_box" placeholder="제목, 작가를 입력하세요." maxlength="50" autocomplete="off" value form="${npup.project.prefix.css}search-form">`
        + '</form>'
        + `<button type="button" class="${npup.project.prefix.css}search-align" onclick="javascript:npupPcSearch()">`
            +`<img src="//images.novelpia.com/img/new/header/icon_in_search.svg" alt="검색" class="${npup.project.prefix.css}search-icon">`
        + '</button>';

    targetHandler(
        () => document.getElementById('btn_alram'),
        (target) => target.esrender("beforebegin", search_icon)
    );
}



let sr;
let presr;

const delete_all = document.createElement('div');
delete_all.innerHTML = '잔체삭제';


headerCa['search-result'].system = function(r, generate) {
    if (pathChecker('/comic_search/')) return;

    if (routing && !generate) { // 뒤로가기시 바로 업데이트가 되지 않는 문제
        return tryChecker(() => {
            // 혹시 모를 중복 생성으로 인한 검색 결과 미반영 해결책
            let search_result = document.getElementsByClassName(`${npup.project.prefix.css}${this.key}-wrap`)[0];

            if (!search_result/* [0] */ && !document.getElementsByClassName(`${npup.project.prefix.css}${this.key}`)[0]) {
                /* l.nav, 다른 것들도 반영하는 것은 각 시스템별로 바디 부분에 npup- 를 삽입함으로써 이미 존재함을 증명시키게 할 것 */
                /* 그렇다해도 searchResultSystem 내부에 resultBoxContent가 삽입되어 있으니 이 부분은 삭제하지 말 것 */
                this.system(r, true);
            }
            else
                search_result/* [search_result.length - 1] */.innerHTML = searchResultBoxContent();
        }, '동적 검색 결과', '파츠'/* , mus */);
    }
    
    sr = this.key;
    presr = npup.project.prefix.css + this.key;
    delete_all.id = `${presr}-delete-all`;

    let result_box = document.createElement('div');
    result_box.classList.add(`${presr}`);

    let result_box_wrap = document.createElement('div');
    result_box_wrap.classList.add(`${presr}-wrap`);

    result_box_wrap.innerHTML = searchResultBoxContent();

    result_box.appendChild(result_box_wrap);

    // 검색바 최소화 선택이 '안'되어 있을 시
    if (!r['nav'] && !r['search']) {
        const searcher = document.querySelector('div.header-top-wrapper > div.header-top > div:has(div.header-search)');
        // css 로 위치 변경
        //searcher.style = 'position: relative; width: 420px; height: 50px;';

        searcher.esrender(result_box);

        document.addEventListener('click', (e) => {
            let is_click = false;

            const header_search = document.getElementsByClassName('header-search');
            for (let i = 0; i < header_search.length; i++)
                if (header_search[i].contains(e.target)) is_click = true;

            const search_result = document.getElementsByClassName(`${presr}`);
            for (let i = 0; i < search_result.length; i++)
                if (search_result[i].contains(e.target)) is_click = true;

            if (!is_click) return document.getElementsByClassName(`${presr}`)[0].classList.remove(`${presr}-active`);

            document.getElementsByClassName(`${presr}`)[0].classList.add(`${presr}-active`);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') document.getElementsByClassName(`${presr}`)[0].classList.remove(`${presr}-active`);
        });

        // 검색바 최소화 선택이 되어 있을 시
    } else if (r['nav'] || r['search']) {
        targetHandler(
            () => document.getElementById(`${npup.project.prefix.css}search-form`),
            (target) => {
                target.classList.add(`${presr}-form`);
            
                result_box.classList.add(`${presr}-newtype`);
                target.esrender(result_box);
            }
        );
    }

    searchResultRedirect();
    searchResultRemove();
}





/**
 * 검색 결과 클릭 시 리다이렉트 함수
 * 동적 처리
 */
function searchResultRedirect() {
    document.addEventListener('click', (e) => {
        const target = e.target.closest(`.${presr}-word-wrap`);
        if (!target) return;

        let search_type = 'all';
        if (pathChecker('/search/novel_name/')) search_type = 'novel_name';
        else if (pathChecker('/search/writer_nick/')) search_type = 'writer_nick';
        else if (pathChecker('/search/novel_genre/')) search_type = 'novel_genre';

        location.href = '/search/' + search_type + '//1/' + target.firstChild.innerHTML.replace(/[\/%?,]/g, '') + '?page=1&rows=30&novel_type=&start_count_book=&end_count_book=&novel_age=&start_days=&sort_col=last_viewdate&novel_genre=&block_out=0&block_stop=0&is_contest=0&list_display=list';
    });
}

/**
 * result box wrap에 넣을 내용 값
 * @returns {string} result box wrap에 넣을 내용 값
 */
function searchResultBoxContent() {
    let words = JSON.parse(localStorage.search_novel_word || `[]`);

    let items = '';
    if (words[0]) {
        words.forEach(b => {
            let word_wrap = document.createElement('div');
            word_wrap.classList.add(`${presr}-item`);

            let word = document.createElement('div');
            word.classList.add(`${presr}-word-wrap`);

            let word_p = document.createElement('p');
            word_p.classList.add(`${presr}-word`)
            word_p.innerHTML = b;

            word.appendChild(word_p);

            let delete_one = document.createElement('div');
            delete_one.classList.add(`${presr}-delete`);
            delete_one.innerHTML = '<img src="//images.novelpia.com/img/new/menu/novel/btn_remove_tag_3.svg">';

            word_wrap.appendChild(word);
            word_wrap.appendChild(delete_one);

            items += word_wrap.outerHTML;
        });
    }
    let items_wrap = `<div class="${presr}-items">`
        + items
        + `</div>`;

    let nothing = `<div style="padding: 20px 0; width: 100%; text-align: center;">최근 검색어가 없습니다.</div>`

    return ''
        + `<div class="${presr}-header">`
            + `<div style="font-weight: bold; font-size: 18px; color: black;">최근 검색</div>`
            + (words[0] ? delete_all.outerHTML : '')
        + `</div>`
        + (words[0] ? items_wrap : nothing);
}

/**
 * 검색 결과 창에서 검색 결과 제거
 */
function searchResultRemove() {
    const nothing = document.createElement('div');
    nothing.style = 'padding: 20px 0; width: 100%; text-align: center;';
    nothing.textContent = '최근 검색어가 없습니다.';

    const deleteBtn = (e) => {
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
    }

    const deleteAllBtn = (e) => {
        let target = document.getElementById(`${presr}-delete-all`);

        if (!target || !target.contains(e.target)) return;

        localStorage.search_novel_word = JSON.stringify([]);

        const wrap = target.parentElement.parentElement;

        wrap.appendChild(nothing);
        wrap.children[1].remove();
        target.remove();
    }

    document.addEventListener('click', deleteBtn);
    document.addEventListener('click', deleteAllBtn);

    removeEventForEngine(() => {
        document.removeEventListener('click', deleteBtn);
        document.removeEventListener('click', deleteAllBtn);
    });
}




headerCa['alarm'].system = function(r) {

    let where_href = '/';

    switch (r[this.key]) {
        case 'novel': 
            where_href += 'novel';
            break;
        case 'comic':
            where_href += 'comic';
            break;
        case 'system': 
            where_href += 'system';
            break;
        case 'event':
            where_href += 'event';
            break;
        default:
            where_href = '';
    }

    targetHandler(
        () => document.getElementsByClassName('header-alert')[0],
        (target) => target.href += where_href
    );

    // mobile area
    targetHandler(
        () => document.getElementById('btn_m_alram'),
        () => {
            const m_alarm = document.querySelector('.bt-nv-menu:has(#btn_m_alram)');
            m_alarm.outerHTML = m_alarm.outerHTML.replace(/div/g, 'a').replace('a', `a href="/alarm${where_href}" style="color: black;"`);
        }
    );
} 





headerCa['writer-room'].system = async function(r) {

    const generateWriterIcon = () => {
        const writer_wrap = document.createElement('a');
        writer_wrap.href = '/writer_room';
        writer_wrap.classList.add(`${npup.project.prefix.css}${this.key}`);
    
        const writer_icon = document.createElement('img');
        writer_icon.src = '//image.novelpia.com/img/new/menu/w/write.png';
        writer_icon.alt = '내작품';
    
        writer_wrap.appendChild(writer_icon);

        return writer_wrap;
    }

    targetHandler(
        () => document.getElementsByClassName('header-gift')[0],
        () => {
            const target = document.getElementsByClassName('header-gift');
            for (let i = 0; i < target.length; i++)
                target[i].insertAdjacentElement("afterend", generateWriterIcon());
        }
    );
}
