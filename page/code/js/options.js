// 옵션 페이지 다크 모드
const headerThemeButton = document.getElementById('theme');
const html = document.querySelector('html');



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
        });

    // 버전 업데이트 알림
    chrome.storage.local.get([update_key]).then(r => {
        if (!r[update_key]) return;

        /* const banner_wrap = document.createElement('div');
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

        setTimeout(() => {
            banner_wrap.classList.add('active');
        }, 10); */
        
        chrome.storage.local.set({ [update_key]: false });
    });
})();
