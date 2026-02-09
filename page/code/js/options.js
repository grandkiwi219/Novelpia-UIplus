// 옵션 페이지 다크 모드
const headerThemeButton = document.getElementById('theme');
const html = document.documentElement;



if (!prevDark) headerThemeButton.innerHTML = moon;

headerThemeButton.addEventListener('click', function () {
    const currentDark = html.getAttribute('dark');

    if (currentDark == 'true') {
        html.setAttribute('dark', 'false');
        headerThemeButton.innerHTML = moon;
        localStorage.dark = 0;
    } else {
        html.setAttribute('dark', 'true');
        headerThemeButton.innerHTML = sun;
        localStorage.dark = 1;
    }
});





//----------------------------------------------------






(async () => {
    // 버전 기입
    let version;

    await fetch('../manifest.json')
        .then(r => r.json())
        .then(manifest => {
            version = manifest.version;
            document.getElementById('version').textContent = manifest.version;

            const options = options_category.find(e => e.type == document.documentElement.getAttribute('type'));
            const name = manifest.name + (options.type == 'base' ? '' : ` | ${options.name}`);
            document.title = name;
            const name_el = document.getElementById('name');
            if (name_el) {
                name_el.textContent = name;
            }
        });

    // 버전 업데이트 알림
    local.get([update_key]).then(r => {
        if (!r[update_key]) return;

        const banner_wrap = document.createElement('div');
        banner_wrap.id = 'update-banner';
        banner_wrap.classList.add('cleaner');

        const banner = document.createElement('div');
        banner.classList.add('container');

        const what_version = document.createElement('span');
        what_version.textContent = `${version} 버전으로 업데이트 되었습니다!`;

        const what_patch = document.createElement('a');
        what_patch.classList.add('update-button');
        what_patch.href = document.getElementById('patch').href;
        what_patch.target = '_blank';
        what_patch.textContent = '패치노트';

        banner.appendChild(what_version);
        banner.appendChild(what_patch);

        banner_wrap.appendChild(banner);

        document.getElementById('box').insertAdjacentElement('beforebegin', banner_wrap);

        what_patch.addEventListener('click', () => {
            banner_wrap.classList.remove('active');
        }, { once: true });

        setTimeout(() => {
            banner_wrap.classList.add('active');
        }, 10);
        
        local.set({
            [update_key]: false,
            [update_alert_key]: false
        });
    });
})();
