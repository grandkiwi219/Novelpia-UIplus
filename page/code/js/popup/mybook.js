const npup_need_id = 'npup-load-mybook-data';
const npup_need_key = 'load';
const npup_loading = '';
const npup_success = '';
const npup_failed = '';

const expiration_period_for_update = 10 * 60; // 저장된 데이터 유효기간

const tab_type = ['last_view', 'like', 'alarm', 'collect'];
const order_type = ['date', 'view', 'list', 'vote'];


/**
 * 정보 불러오기 버튼 있을 시 중복 방지를 위한 로드 상태 확인 함수
 */
function loadStateMybookData() {
    const load_data_el = document.getElementById(npup_need_id);
    const load_state = load_data_el.getAttribute(npup_need_key);

    return load_state == 'true' ? true : false;
}

/**
 * 마지막으로 연 내서재 위치 가져오기
 */
function getMybookLocationData() {
    try {
        return JSON.parse(localStorage[mybook])?.location || data;
    } catch (e) {
        return mybook_value.location;
    }
}

/**
 * 마지막으로 연 내서재 위치 저장하기
 */
function setMybookLocationData({ tab = 'last_view', category = 0, page = 1, order = 'date' } = {}) {
    let data = {};

    try {
        data = JSON.parse(localStorage[mybook]) || {};
    } catch (e) {}

    data.location = { tab: tab, category: category, page: page, order: order };

    localStorage[mybook] = JSON.stringify(data);
}

/**
 * 저장된 데이터의 유효기간 가져오기
 */
function getExpirationPeriod() {
    try {
        return JSON.parse(localStorage[mybook])?.expiration_period;
    } catch (e) {
        return undefined;
    }
}

/**
 * 저장된 데이터가 아직 유효한지 확인하기
 */
function confirmExpirationPeriod() {
    const period = getExpirationPeriod();
    const current_period = new Date().getTime();

    if (period > current_period) {
        const remaining = period - current_period;
        const seconds = Math.floor(remaining / 1000) % 60;
        const minutes = Math.floor(remaining / (1000 * 60)) % 60;
        const hours = Math.floor(remaining / (1000 * 60 * 60));

        return { status: true, expiration_period: `${hours ? `${hours}시간 ` : ''}${minutes ? `${minutes}분 ` : ''}${seconds}초` };
    }
    else { 
        return { status: false, expiration_period: undefined };
    }
}

/**
 * 데이터의 유효기간 갱신하기
 */
function updateExpirationPeriod() {
    const timestamp = new Date();

    const add_time = Number(expiration_period_for_update);

    timestamp.setSeconds(timestamp.getSeconds() + add_time);

    let data = {};

    try {
        data = JSON.parse(localStorage[mybook]) || {};
    } catch (e) {}

    data.expiration_period = timestamp.getTime();

    localStorage[mybook] = JSON.stringify(data);
}

/**
 * 저장된 소설 데이터 가져오기
 */
function getMybookData() {
    try {
        return JSON.parse(localStorage[mybook])?.data || data;
    } catch (e) {
        return mybook_value.data;
    }
}

/**
 * 소설 데이터 저장하기
 */
function setMybookData(mybook_data_param) {
    let mybook_data = {
        status: 5,
        data: { books: null, category: null, page: null }
    }

    Object.assign(mybook_data, mybook_data_param);

    let data = {};

    try {
        data = JSON.parse(localStorage[mybook]) || data;
    } catch (e) {}

    data.data = mybook_data;

    localStorage[mybook] = JSON.stringify(data);
}

/* 로드 */
async function loadMybookData(tab, category, page, order) {
    const load_data_el = document.getElementById(npup_need_id);
    const initial_html = load_data_el?.innerHTML;

    if (initial_html) {
        load_data_el.setAttribute(npup_need_key, true);
        load_data_el.innerHTML = `${npup_loading} 새로고침 중`;
    }


    let data = await mybookData(tab, category, page, order);


    console.log(`데이터 변환 결과 상태 코드: ${data.status}`);


    if (initial_html) {
        switch (data.status)  {
            case 2:
            case 3:
                load_data_el.innerHTML = `${npup_success} 새로고침 완료`;
                break;
            case 4:
                load_data_el.innerHTML = `${npup_failed} 로그인 필요`;
                break;
            case 5:
                load_data_el.innerHTML = `${npup_failed} 새로고침 실패`
                break;
            default:
                load_data_el.innerHTML = `${npup_failed} 새로고침 실패`;
                break;
        }

        setTimeout(() => {
            load_data_el.setAttribute(npup_need_key, false);
            load_data_el.innerHTML = initial_html;
        }, 400);
    }

    return data;
}

/* 
최근 본 작품: https://novelpia.com/mybook/last_view/0/date/1
소장함: https://novelpia.com/mybook/collect/1103021/date/1
구독알림: https://novelpia.com/mybook/alarm/1103021/date/1
선호작: https://novelpia.com/mybook/like/1103021/date/1
*/

/* 
/search/hash/date/1/{tag}
*/

/**
 * id=npup_need_id 를 지닌 요소 있으면 데이터 연동 중 표시
 * tab = [last_view, collect, alarm, like]
 * status > 2 = 성공, 3 = 카테고리에 등록된 책이 존재하지 않음, 4 = 로그인 상태가 아님, 5 = 정보를 가져올 수 없음, 6 = 데이터 변환 도중 오류
 */
async function mybookData(tab = 'last_view', category = 0, page = 1, order = 'date') {
    let fetch_url = `${novelpia}/mybook/${tab_type.includes(tab) ? tab : 'last_view'}/`;

    const c_bool = category > -3 && typeof category == 'string' && typeof Number(category) == 'number';
    const o_bool = order_type.includes(order);
    const p_bool = page > 1;

    const c_filter = c_bool ? category : 0;
    const o_filter = o_bool ? order : 'date';
    const p_filter = p_bool ? page : 1;

    const fetch_url_plus = `${c_filter}/${o_filter}/${p_filter}`;

    if (c_bool) fetch_url += fetch_url_plus;
    else if (p_bool) fetch_url += fetch_url_plus;
    else if (o_filter != 'date' && o_bool) fetch_url += fetch_url_plus;

    console.log(`데이터 URL: ${fetch_url}`);

    let mybook_data = null,
        category_data = null,
        page_data = null,
        status = null;

    let doc = null;
    let item = null;

    await fetch(fetch_url)
        .then(res => {
            console.log(`데이터 새로고침 결과 상태 코드: ${res.status}`);
            return res.text();
        })
        .then(html => {
            const parser = new DOMParser();
            doc = parser.parseFromString(html, "text/html");
            item = doc.querySelector('.mybook-data-list-items');
        })
        .catch(e => {
            console.error(e.stack);
            status = 5;
        });

    if (!status) {
        try {
            if (!doc.querySelector('.recommend-botton-section')) {
                status = 4;
            }
            else {
                const category = doc.querySelector('#submenu_bar');
                if (tab != 'last_view') category_data = categoryJson(category);

                page_data = pageJson(item, page);

                if (doc.getElementsByClassName('novel-list-real-container')[0]) {
                    status = 2, mybook_data = mybookJson(item);
                }
                else if (item.getElementsByClassName('row')[0]) {
                    status = 2, mybook_data = mybookCollectJson(item);
                }
                else status = 3;
            }
        } catch (e) {
            console.error(e.stack);
            status = 6;
        }
    }

    const data = {
        status: status,
        url: fetch_url,
        data: { books: mybook_data, category: category_data, page: page_data }
    };

    return data;
}

function mybookJson(data) {
    let data_arr = [];

    for (let i = 0; i < data.children.length - 1; i++) {
        let data_html = data.children[i].outerHTML;
        //let next_href = data_html.match(/get_next_episode\((\d+),/) ? data_html.match(/get_next_episode\((\d+),/)[1] : undefined;

        let author_id = data_html.match(/user\/(\d+)/);

        let cont_ep = data_html.match(/EP\.(\d+)/);
        let cont_id = data_html.match(/viewer\/(\d+)/);

        let data_data = {
            author: { 
                name: data.children[i].getElementsByClassName('writer-name')[0].textContent.replace('\n', '').trim(),
                id: author_id ? author_id[1] : undefined
            },
            title: data.children[i].getElementsByClassName('novel-name')[0].textContent.replace('\n', '').trim(),
            thumbnail: data.children[i].getElementsByClassName('cover_style ')[0].src.replace(/[a-zA-Z0-9+.-]+-extension:\/\//, 'https://'),
            id: data_html.match(/novel\/(\d+)/)[1],
            adult: data.children[i].getElementsByClassName('age-mark')[0] ? 1 : 0,
            continue: { 
                ep: cont_ep ? cont_ep[1] : undefined, 
                id: cont_id ? cont_id[1] : undefined
            },
            next: { 
                status: data.children[i].getElementsByClassName('novel-btn-nothing')[0] ? 0 : 1,
                parameter: ''
            },
            open: data.children[i].getElementsByClassName('novel-open-time')[0]?.textContent,
            type: 'normal'
        }

        data_data.next.parameter = `${data_data.id},${data_data.continue.ep}`;

        data_arr.push(data_data);
    }

    
    return data_arr;
}

function mybookCollectJson(data) {
    let data_arr = [];

    const item = data.querySelectorAll('.row > div.mobile_hidden');

    for (let i = 0; i < item.length; i++) {
        let data_html = item[i].outerHTML;

        let data_data = {
            author: { 
                name: item[i].getElementsByTagName('font')[0].textContent.trim(),
                id: undefined
            },
            title: item[i].getElementsByClassName('cut_line_one')[0].textContent.trim(),
            thumbnail: item[i].querySelector('img[src*=cover]').src.replace(/[a-zA-Z0-9+.-]+-extension:\/\//, 'https://'),
            id: data_html.match(/novel\/(\d+)/)[1],
            adult: item[i].querySelector('img[src*="19-2.png"]') ? 1 : 0,
            continue: { 
                ep: undefined, 
                id: undefined
            },
            next: { 
                status: 0,
                parameter: ''
            },
            open: undefined,
            type: 'collect'
        }

        data_arr.push(data_data);
    }

    
    return data_arr;  
}

function categoryJson(data) {
    let data_category = [];

    for (let i = 0; i < data.children.length; i++) {
        data_category.push({ 
            id: data.children[i].outerHTML.match(/mybook\/[^/]+\/(-?\d+)/)[1],
            name: data.children[i].textContent
        });
    }

    return data_category;
}

function pageJson(data, page) {
    let data_page = {
        last: 1,
        active: parseInt(page)
    };

    let page_data = data.getElementsByClassName('page-item');

    if (page_data) data_page.last = parseInt(page_data[page_data.length - 1].children[0].href.match(/(\d+)(?!.*\d)/)[1]);

    if (data_page.active > data_page.last) data_page.active = data_page.last;

    return data_page;
}
