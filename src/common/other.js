/** system: other */
const quickMybookSystem = (r) => {
    if (!domainChecker('novel') || !r[l.quick_mybook]) return;

    let first_open = false;

    const top_nav = document.getElementsByClassName('top_nav');

    for (let i = 0; i < top_nav.length; i++) {
        const quick_menu = document.createElement('i');
        quick_menu.classList.add('ion-chevron-down');
        quick_menu.classList.add(`${project_prefix}quick-mybook-menu`);

        /* system-content.css => quick-mybook */

        top_nav[i].appendChild(quick_menu);

        // 노벨피아 사이트 서 위치 커스텀 만들 것
    }
}

new SystemStructure(l.quick_mybook, STRUCTURE.COMMON.TYPE)
    .setAddons(new Addons(ENGINE_TYPE.SYSTEM, l.quick_mybook_blank))
    .setSystem(quickMybookSystem)
.setup();
