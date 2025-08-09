npup.options.nav.options['nav-mybook'].system = function(r, get_data) {

    let where_href = '/';
    let where_name;

    switch (r[this.key]) {
        case 'like':
            where_href += 'like';
            where_name = '선호작';
            break;
        case 'last': 
            where_href += 'last_view';
            where_name = '최근기록';
            break;
        case 'alarm':
            where_href += 'alarm';
            where_name = '구독 알림';
            break;
        case 'collect':
            where_href += 'collect'
            where_name = '소장함';
            break;
        default:
            where_href = '';
            break;
    }

    if (get_data) return { href: where_href, name: where_name };

    document.querySelectorAll('.top_nav > a:last-child').forEach(b => {
        b.href += where_href;
    })

    // mobile area
    new MutationObserver((mus, ob) => {
        if (!document.getElementsByClassName('bt-nv-menu')[0]) return;
        ob.disconnect();

        let m_menu = document.getElementsByClassName('bt-nv-menu');

        let m_mybook =  m_menu[m_menu.length - 1].outerHTML;
            
        m_mybook = m_mybook
            .replace(/div/g, 'a').replace('a', `a href="/mybook${where_href}" style="color: black;"`)
            .replace('최근기록', where_name);

        if (where_name != '최근기록') m_mybook = m_mybook.replace('recent', 'mybook');

        m_menu[m_menu.length - 1].outerHTML = m_mybook
    }).observe(document.body, observer_setup);
}   





npup.options.nav.options.nav.system = function(r) {
    basicUseSystem('search', r);    // '기본적으로' 검색바 최소화 '사용하기'

    const nav = document.getElementsByClassName('top_nav')[0];
    let header_position = false;

    if (window.innerWidth > 891)
        headerLocation(r['nav-align'], nav), header_position = true;

    const delay = npup.etc.laze_check_time;
    let timer = null;

    window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (window.innerWidth > 891 && !header_position)
                headerLocation(r['nav-align'], nav), header_position = true;

            else if (window.innerWidth <= 891 && header_position)
                navLocation(nav), header_position = false;
        }, delay);
    });
}



/**
 * 헤더로 위치 변경
 * @param {string} re r[l.nav_align] 값
 * @param {Element} nav nav 요소
 */
function headerLocation(re, nav) {
    nav.classList.add(`${npup.project.prefix.css}nav`);

    if (re == 'center')
        document.querySelector('.header-top > div:not(.header-icon-menu, .hader-logo)')
            .appendChild(nav);
    else if (re == 'right' || re == 'right-less')
        document.getElementsByClassName('header-icon-menu')[0]
            .insertAdjacentElement('afterbegin', nav);
    else 
        document.getElementsByClassName('hader-logo')[0]
            .appendChild(nav);
}

/**
 * 내비로 위치 변경
 * @param {Element} nav nav 요소
 */
function navLocation(nav) {
    nav.classList.remove(`${npup.project.prefix.css}nav`);

    document.querySelector('header.mobile_hidden')
        .appendChild(nav);
}
