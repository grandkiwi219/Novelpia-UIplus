const viewerCa = npup.options.viewer.options;


viewerCa['old-icon'].system = function(r) {
    window.addEventListener('DOMContentLoaded', iconSetup);

    /* route detector? */
}


function iconSetup() {
    // style: system-content.css => old-icon css 부분

    // home
    const home = document.getElementsByClassName('menu-top-home')[0];

    const old_home = document.createElement('div');
    old_home.classList.add('ion-home');
    old_home.style.fontSize = '25px';

    home.appendChild(old_home);

    // title
    const title = document.getElementsByClassName('menu-title-wrapper')[0];

    const novel_name = document.createElement('b');
    novel_name.classList.add('menu-top-novel-title');
    novel_name.textContent = document.title
        .replace('노벨피아', '')
        .replace('웹소설로 꿈꾸는 세상!', '')
        .replace(/ - /g, '');

    const title_element_wrapper = document.createElement('div');
    title_element_wrapper.classList.add('menu-top-title-element-wrapper');
    title_element_wrapper.textContent = document.getElementsByClassName('menu-top-title')[0].textContent;

    const title_tag = document.getElementsByClassName('menu-top-tag')[0];
    if (title_tag)
        title_element_wrapper.insertAdjacentElement('afterbegin', title_tag);

    const title_nineteen = document.getElementsByClassName('menu-top-adult')[0]
    if (title_nineteen) {
        title_nineteen.remove();

        const old_nineteen = document.createElement('span');
        old_nineteen.classList.add('menu-top-nineteen');
        old_nineteen.textContent = '19';

        title_element_wrapper.insertAdjacentElement('afterbegin', old_nineteen);
    }

    title.insertAdjacentElement('afterbegin', novel_name);
    title.appendChild(title_element_wrapper);

    // list -- 나중 svg, 텍스트로 직접 대체하기 전까지
    /* const list = document.getElementsByTagName('menu-top-list')[0]; */

    // setting -- 나중 svg, 텍스트로 직접 대체하기 전까지
    /* const setting = document.getElementsByTagName('menu-top-setting')[0]; */


    // vote -- 나중 svg, 텍스트로 직접 대체하기 전까지
    /* const vote = document.getElementById('recommend_tap'); */


    // bottom item
    const bt_item = document.getElementsByClassName('menu-bottom-item');

    bt_item[1].classList.add('last-ep'); // last

    // before -- 나중 svg, 텍스트로 직접 대체하기 전까지
    const before = bt_item[0];
    before.classList.add('before-ep');

    // after -- 나중 svg, 텍스트로 직접 대체하기 전까지
    const after = bt_item[4];
    after.classList.add('after-ep');

    // comment -- 나중 svg, 텍스트로 직접 대체하기 전까지
    const comment = bt_item[3];
    comment.classList.add('comment-ep');

    before.insertAdjacentElement('afterend', comment);

    // like -- 나중 svg, 텍스트로 직접 대체하기 전까지
    const like = document.getElementsByClassName('menu-top-like')[0];

    like.classList.add('menu-bottom-item');
    like.classList.add('like-ep');
    like.classList.remove('menu-top-like');

    after.insertAdjacentElement('beforebegin', like);
}



viewerCa['click-alert'].system = function(r) {
    npup.log('우클릭 제거 준비가 완료되었습니다.');

    scriptInjection('src/base/file/delete-click-alert.js');

    /* route detector? */
}



viewerCa['dbl-vote'].system = function(r) {
    let enhanced = {
        key: `${this.key}-plus`,
        func: () => {}
    }

    if (r[enhanced.key]) {
        targetHandler(
            () => document.getElementById('novel_drawing'),
            (target) => targetFunction(target),
            {
                method: 1,
                redetect: true
            }
        );

        const targetFunction = (target) => {
            target.outerHTML = target.outerHTML.replace('onclick', '');
        }

        enhanced.func = () => {
            clearTimeout(last.clickTimer);
            last.clickTimer = setTimeout(() => {
                scriptInjection(`src/base/file/${enhanced.key}.js`);
            }, cooltime);
        }
    }

    let last = {
        time: 0,
        pos: { x: 0, y: 0 },
        clickTimer: undefined
    }

    const cooltime = 180;
    const pos_error = 100;
    
    const dblVoteEvent = (e) => {
        if (!document.getElementById('novel_box').contains(e.target)) return;

        const now = performance.now();

        const last_time = now - last.time;
        const dist = Math.hypot(e.clientX - last.pos.x, e.clientY - last.pos.y);

        if (last_time < cooltime && dist < pos_error) {
            clearTimeout(last.clickTimer);
            resetLast(0);
            executeClickVote();
            return;
        }

        resetLast(now);
        enhanced.func();

        function resetLast(time) {
            last.time = time;
            last.pos = { x: e.clientX, y: e.clientY };
        }
    }

    document.addEventListener('click', dblVoteEvent);

    /* route detector? */
}
