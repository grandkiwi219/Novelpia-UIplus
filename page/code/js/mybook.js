const npup_need_id = 'npup-load-mybook-data';
const npup_need_key = 'load'
const npup_loading = '';
const npup_success = '';
const npup_failed = '';
const mybook = 'mybook';


/**
 * 정보 불러오기 버튼 있을 시 중복 방지를 위한 로드 상태 확인 함수
 */
function loadStateMybookData() {
    const load_data_el = document.getElementById(npup_need_id);
    const load_state = load_data_el.getAttribute(npup_need_key);

    return load_state == 'true' ? true : false;
}

const mybook_value = {
    last_data: {
        tab: null,
        category: null /* [category_id] */
    },
    category: [
        /* { id: [category_id], name: [category_name] },
        ... */
    ],
    tab: {
        /* [category_id]: {
            data: [
            { author: { name: '', href: '' }, title: '', thumbnail: '', novel: '', adult: false, continue: { ep: '', href: '' }, next: { state: true, href: '' } },
            ...
            ]
        },
        ... */
    }

}

/**
 * 마지막으로 연 내서재 위치 가져오기
 */
async function getLastMybookData() {
    let data = mybook_value.last_data;
    await local.get(mybook).then(r => {
        data = r[mybook]?.last_data;
    });

    return data;
}

/**
 * 마지막으로 연 내서재 위치 저장하기
 */
async function setLastMybookData(last_data = { tab: null, category: null }) {
    await local.get(mybook).then(async r => {
        let data = r[mybook];

        data.last_data = last_data;

        await local.set({ [mybook]: data });
    });
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



    if (initial_html) {
        switch (data?.state)  {
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

    return data.state == 2 || data.state == 3 ? data.data : null;
}

/* 
최근 본 작품: https://novelpia.com/mybook/last_view/0/date/1
소장함: https://novelpia.com/mybook/collect/1103021/date/1
구독알림: https://novelpia.com/mybook/alarm/1103021/date/1
선호작: https://novelpia.com/mybook/like/1103021/date/1
*/

/**
 * id=npup_need_id 를 지닌 요소 있으면 데이터 연동 중 표시
 * tab = [last_view, collect, alarm, like]
 * state > 2 = 성공, 3 = 카테고리에 등록된 책이 존재하지 않음, 4 = 로그인 상태가 아님, 5 = 정보를 가져올 수 없음
 */
async function mybookData(tab, category = undefined, page = 1, order = 'date') {
    let fetch_url = `https://novelpia.com/mybook/${tab}/`;

    if (category) fetch_url += `${category}/${order}/${page}`;

    let mybook_data = null, category_data = null, state;
    try {
        await fetch(fetch_url)
            .then(res => { 
                console.log(`데이터 새로고침 결과 상태 코드: ${res.status}`);
                return res.text(); 
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const item = doc.querySelector('.mybook-data-list-items');

                if (!doc.querySelector('.recommend-botton-section')) return state = 4

                if (doc.getElementsByClassName('novel-list-real-container')[0]) state = 2, mybook_data = mybookJson(item);
                else state = 3;

                const category = doc.querySelector('#submenu_bar');

                if (tab != 'last_view') category_data = categoryJson(category);
            });
    } catch (e) {
        console.error(e);
        state = 5;
    }

    const data = { state: state, data: { books: mybook_data, category: category_data } }

    return data;
}

function mybookJson(data) {
    let data_arr = [];
    let data_page = {
        first: 1,
        last: 1,
        before: 1,
        next: 1,
        active: 1 
    };

    for (let i = 0; i < data.children.length - 1; i++) {
        let data_html = data.children[i].outerHTML;
        let next_href = data_html.match(/get_next_episode\((\d+),/) ? data_html.match(/get_next_episode\((\d+),/)[1] : undefined;

        let cont_ep = data_html.match(/EP\.(\d+)/);
        let cont_id = data_html.match(/viewer\/(\d+)/);

        let data_data = {
            author: { 
                name: data.children[i].getElementsByClassName('writer-name')[0].textContent.replace('\n', '').trim(),
                id: data_html.match(/user\/(\d+)/)[1]
            },
            title: data.children[i].getElementsByClassName('novel-name')[0].textContent.replace('\n', '').trim(),
            thumbnail: data.children[i].getElementsByClassName('cover_style ')[0].src.replace('chrome-extension://', 'https://'),
            id: data_html.match(/novel\/(\d+)/)[1],
            adult: data.children[i].getElementsByClassName('age-mark')[0] ? true : false,
            continue: { 
                ep: cont_ep ? cont_ep[1] : undefined, 
                id: cont_id ? cont_id[1] : undefined
            },
            next: { 
                state: data.children[i].getElementsByClassName('novel-btn-nothing')[0] ? false : true, 
                id: next_href
            }

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

