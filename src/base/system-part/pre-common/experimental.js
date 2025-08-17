npup.options.experimental.options['frosted-glass'].system = function (r) {
    let blur_intensity = 18;
    const box_shadow_color_page = getCookie('DARKMODE_S') ? '255, 255, 255, 0.32' : '0, 0, 0, 0.16';
    const border_color = '200, 200, 200';

    let style = document.createElement('style');
    style.id = `${npup.project.prefix.css}frosted-glass-css`;
    style.textContent = `
header,
#bottom-nav-bar,
#header_bar, #footer_bar,
.last-ep-alarm
{
    background-color: rgba(255, 255, 255, 0.35) !important;
    backdrop-filter: blur(${blur_intensity}px);
}

header {
    border: none !important;
    ${window.location.pathname == "/" ? '' : `box-shadow: rgba(${box_shadow_color_page}) 0px 1px 4px 0px;`}
}

#search_input {
    background-color: rgba(255, 255, 255, 0);
}

@media screen and (min-width: 892px) {
    .header-top-wrapper {
        border-color: rgba(${border_color}, 0.35) !important;
    }
}

#comment_box {
    height: 100% !important;
    padding-top: 60px;
    inset: 0;
}

#list_box {
    height: 100% !important;
    padding-bottom: 60px;
}

#tab_top + table {
    background-color: rgba(235, 235, 235, 0.35) !important;
    backdrop-filter: blur(${blur_intensity}px);

    .active {
        background-color: rgba(255, 255, 255, 0.35) !important;
        backdrop-filter: blur(${blur_intensity}px);
    }
}
`;

    let home_style = undefined;
    let dark_style = undefined;

    if (window.location.pathname == "/") {
        const box_shadow = `header { box-shadow: rgba(${box_shadow_color_page}) 0px 1px 4px 0px; }`;
        const box_shadow_lock = `header { box-shadow: none }`;

        home_style = document.createElement('style');
        home_style.id = `${npup.project.prefix.css}frosted-glass-css-home`;
        home_style.insertAdjacentHTML('afterbegin', box_shadow_lock);

        const scrollBoxShadow = () => {
            if (window.scrollY > 10 && home_style.textContent != box_shadow) {
                home_style.textContent = box_shadow;
            }
            else if (window.scrollY <= 10  && home_style.textContent != box_shadow_lock){
                home_style.textContent = box_shadow_lock;
            }
        }

        document.addEventListener('scroll', scrollBoxShadow);
    }

    if (engineChecker('페이지') && getCookie('DARKMODE_S')) {
        dark_style = document.createElement('style');
        dark_style.id = `${npup.project.prefix.css}frosted-glass-css-page-dark`;
        dark_style.textContent = `
header,
#bottom-nav-bar,
.menu_alarm_m,
.last-ep-alarm
{
    background-color: rgba(0, 0, 0, 0.35) !important;    
    filter: none !important;

    & > * {
        filter: invert(1);
    }
}

#tab_top + table {
    border-color: rgba(${border_color}, 0.35) !important;
    background-color: rgba(60, 60, 60, 0.35) !important;

    .active {
        border-left: 2px solid rgba(${border_color}, 0.70) !important;
        border-right: 2px solid rgba(${border_color}, 0.70) !important;
    }
}

.last-ep-alarm {
    box-shadow: 0 0 20px rgba(175, 175, 175, 0.5) !important;
}
`;
    }
    else if (engineChecker('뷰어') && getCookie('DARKMODE')) {
        dark_style = document.createElement('style');
        dark_style.id = `${npup.project.prefix.css}frosted-glass-css-viewer-dark`;
        dark_style.textContent = `
#header_bar, #footer_bar
{
    box-shadow: rgba(255, 255, 255, 0.32) 0px 1px 4px 0px !important;
    background-color: rgba(0, 0, 0, 0.35) !important;
}
`;
    }

    tryChecker(() => {
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
        if (home_style) head.appendChild(home_style);
        if (dark_style) head.appendChild(dark_style);
    }, '실험 기능', this.key, style, home_style, dark_style);
}
