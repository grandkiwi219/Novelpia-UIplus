npup.options.header.options.adult.system = async function(r) {
    if (!r[this.key]) return;

    new MutationObserver((mus, ob) => {
        let switch_adult = document.querySelector('.switch-adult');

        if (!switch_adult) return;

        ob.disconnect();

        document.querySelectorAll('.s-logo').forEach(re => {
            let adult_button = switch_adult.cloneNode(true);
            adult_button.style = 'cursor: pointer;';

            re.insertAdjacentElement('afterend', adult_button);
        });
    }).observe(document.body, observer_setup);
}


    


npup.options.header.options.search.system = function(r) {
    if (!r['nav'] && !r[this.key]) return;
    
    document.getElementsByClassName('header-search')[0]?.remove();

    let search_icon = ''
        + `<div class="${npup.project.prefix.css}search-base">`
            + `<form id="${npup.project.prefix.css}search-form" class="${npup.project.prefix.css}search-header" autocomplete="off">`
                    + `<input id="search_input" class="${npup.project.prefix.css}search-box" type="text" name="search_box" placeholder="제목, 작가를 입력하세요." maxlength="50" autocomplete="off" value form="${npup.project.prefix.css}search-form">`
            + '</form>'
            + `<button type="button" class="${npup.project.prefix.css}search-align" onclick="javascript:npupPcSearch()">`
                +`<img src="//images.novelpia.com/img/new/header/icon_in_search.svg" alt="검색" class="${npup.project.prefix.css}search-icon">`
            + '</button>'
        + '</div>'

    new MutationObserver((mus, ob) => {
        let main = document.getElementById('btn_alram');

        if (!main) return;

        ob.disconnect();

        main.insertAdjacentHTML("beforebegin", search_icon); 
    }).observe(document.body, observer_setup);
}



let sr;
let presr = npup.project.prefix.css;

let delete_all = document.createElement('div');
delete_all.innerHTML = '잔체삭제';


npup.options.header.options['search-result'].system = function(r) {
    if (!r[this.key] || path == '/comic_search') return;
    
    sr = this.key
    presr += this.key;
    delete_all.id = `${presr}-delete-all`;

    if (!pathChecker('/comic_search/')) {
        let result_box = document.createElement('div');
        result_box.classList.add(`${presr}`);

        let result_box_wrap = document.createElement('div');
        result_box_wrap.classList.add(`${presr}-wrap`);

        result_box_wrap.innerHTML = resultBoxContent();

        result_box.appendChild(result_box_wrap);

        // 검색바 최소화 선택이 '안'되어 있을 시
        if (!r['nav'] && !r['search']) {
            let searcher = document.querySelector('div.header-top-wrapper > div.header-top > div:has(div.header-search)');
            // css 로 위치 변경
            //searcher.style = 'position: relative; width: 420px; height: 50px;';

            searcher.appendChild(result_box);   

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
        } else if (r['nav'] || r[npup.options.header.options.search]) {
            new MutationObserver((mus, ob) => {
                let searcher = document.getElementById(`${npup.project.prefix.css + npup.options.header.options.search}-form`);

                if (!searcher) return;

                ob.disconnect();

                searcher.classList.add(`${presr}-form`);

                result_box.classList.add(`${presr}-newtype`);
                searcher.appendChild(result_box); 
            }).observe(document.body, observer_setup);
        }

        resultRedirect();
        resultRemove();
    }
}



/**
 * 검색 결과 창에서 검색 결과 제거
 */
function resultRemove() {
    window.addEventListener("DOMContentLoaded", () => {
        scriptInjection(`src/base/file/${sr}-remove.js`);
    });
}

/**
 * 검색 결과 클릭 시 리다이렉트 함수
 * 동적 처리
 */
function resultRedirect() {
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
function resultBoxContent() {
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




npup.options.header.options.alarm.system = function(r) {
    if (!r[this.key] || r[this.key] == 'comment') return;

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

    new MutationObserver((mus, ob) => {
        const header_alert = document.getElementsByClassName('header-alert')[0];

        if (!header_alert) return;

        ob.disconnect();

        header_alert.href += where_href;
    }).observe(document.body, observer_setup);


    // mobile area
    new MutationObserver((mus, ob) => {
        if (!document.getElementById('btn_m_alram')) return;

        ob.disconnect();

        let m_alarm = document.querySelector('.bt-nv-menu:has(#btn_m_alram)');
            
        m_alarm.outerHTML = m_alarm.outerHTML.replace(/div/g, 'a').replace('a', `a href="/alarm${where_href}" style="color: black;"`);
    }).observe(document.body, observer_setup);
} 
