Object.values(npup.options).forEach(ca => {
    let tools = [];

    Object.values(ca.options).forEach(op => {
        let tools_childs = [];

        toolsBinding(tools_childs, op);

        tools.push(toolsStructure(...tools_childs));
    });

    let tool_box = toolBox(ca.key, ca.name, { icon: ca.icon, icon_svg: ca.icon_svg }, ca.settings, ca.setups, ...tools);

    document.getElementById('waiting').insertAdjacentElement('beforebegin', tool_box);
});

function toolBox(key, name, { icon = '🥝', icon_svg = null } = {}, settings = {}, setups_param, ...node) {
    let setups = {
        length: 1
    }

    Object.assign(setups, setups_param);

    const tool_box = document.createElement('div');
    tool_box.classList.add('tools');

    Object.keys(settings).forEach(r => {
        tool_box.setAttribute(r, settings[r]);
    });

    let tool_icon = icon_svg ? `<img src="${icon_svg}" alt="${icon}">&nbsp;` : icon;
    let tool_headline_structure = ` ${tool_icon} ${name} 설정`;

    const tool_headline = document.createElement('div');
    tool_headline.classList.add('tools-headline');
    tool_headline.insertAdjacentHTML('afterbegin', tool_headline_structure);

    const tool_options_wrap = document.createElement('div');
    tool_options_wrap.classList.add('tools-options-wrap');

    const tool_options = document.createElement('div');
    tool_options.classList.add('tools-options');

    node.forEach(r => {
        if (!r) return;
        tool_options.appendChild(r);
    });

    tool_options_wrap.appendChild(tool_options);

    if (Math.ceil(setups.length) > 1) {
        const type_key = `${document.documentElement.getAttribute('type')}-${key}`;

        const folding_btn = document.createElement('button');
        folding_btn.classList.add('tools-headline-folding-btn');
        folding_btn.classList.add('header-button');

        folding_btn.innerHTML = ''
            + `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">`
                + `<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
            + `</svg>`;

        tool_headline.appendChild(folding_btn);

        setFoldingState();

        folding_btn.addEventListener('click', () => {
            const data = getFoldingData();

            if (data.includes(type_key)) removeFoldingData();
            else insertFoldingData();

            setFoldingState();
        });



        function getFoldingData() {
            let fold_data = [];

            try {
                fold_data = JSON.parse(localStorage['fold']);
                console.log(fold_data)
            } catch (error) {}

            if (!Array.isArray(fold_data)) fold_data = [];

            return fold_data;
        }

        function setFoldingData(data) {
            try {
                localStorage['fold'] = JSON.stringify(data);
            } catch (error) {}
        }

        function insertFoldingData() {
            let data = getFoldingData();

            if (!data.includes(type_key)) {
                data.push(type_key);
                setFoldingData(data);
            }
        }

        function removeFoldingData() {
            let data = getFoldingData();
            const index = data.indexOf(type_key);

            if (data.includes(type_key)) {
                data.splice(index, 1);
                setFoldingData(data);
            }
        }

        function setFoldingState() {
            const folding = getFoldingData();

            if (folding.includes(type_key)) {
                folding_btn.childNodes[0].style = ''; // 열기
                setNormalLength();
            }
            else {
                folding_btn.childNodes[0].style = 'transform: scaleY(-1);'; // 닫기
                setLength();
            }
        }

        function setLength() {
            tool_box.style = '';
            Object.assign(tool_box.style, {
                height: `calc(var(--template-rows-size) * ${setups.length} + var(--box-grid-row-gap) * ${setups.length - 1})`,
                gridRow: `auto / span ${Math.ceil(setups.length)}`
            });
            tool_options_wrap.style = '';
        }

        function setNormalLength() {
            tool_box.style = '';
            tool_options_wrap.style = 'overflow: auto;';
        }
    }

    tool_box.appendChild(tool_headline);
    tool_box.appendChild(tool_options_wrap);

    return tool_box;
}

function toolsStructure(...node) {
    if (!node[0]) return null;

    if (node[0].type == 'textarea') return node[0].node;

    const tools_child = document.createElement('div');
    tools_child.classList.add('tools-child');

    node.forEach(r => {
        tools_child.appendChild(r.node);
    });

    return tools_child;
}

function toolsBinding(item, op, sub = 0) {
    let tools_item;

    if (op.setups?.invisible) return;

    if (typeof op.type?.option != 'string')
        tools_item = setTForm(op.desc, undefined, op.settings, sub, null, 'undefined');
    else switch (op.type?.option) {
        case 'switch': 
            tools_item = settingSwitch(op.desc, op.key, op.settings, sub);
            break;
        case 'selector':
            tools_item = settingSelector(op.desc, op.key, op.values, op.settings, sub);
            break;
        case 'mapping':
            tools_item = settingMapping(op.desc, op.key, op.settings, sub);
            break;
        case 'textarea':
            tools_item = settingTextarea(op.desc, op.key, op.settings.placeholder, op.settings);
            break;
        default:
            tools_item = setTForm(op.desc, op.key, op.settings, sub, document.createElement(`setting-${op.type?.option}`), op.type?.option, op?.customSetting);
            break;
    }

    item.push(tools_item);

    if (op.options) {
        Object.values(op.options).forEach(r => {
            toolsBinding(item, r, sub + 1);
        });
    }
}

function subChecker(desc, sub) {
    const tools_child_item = document.createElement('div');
    tools_child_item.classList.add(`tools-${sub ? 'sub' : 'main'}`);

    const tools_child_item_name = document.createElement('div');
    let item_name = sub ? `${'&nbsp;'.repeat((sub * 2) - 1)} ㄴ ${desc}` : desc;
    tools_child_item_name.insertAdjacentHTML('afterbegin', item_name);

    tools_child_item.appendChild(tools_child_item_name);

    return tools_child_item;
}

function tForm(node, type) {
    return { node, type: type.toLowerCase() };
}

function setTForm(desc, key = undefined, settings = {}, sub = 0, setting_structure, setting_type, customSetting = () => undefined) {
    if (!setting_structure) setting_structure = document.createElement('setting-undefined');
        
    if (key) setting_structure.setAttribute('key', key);

    const tools_chid_item = subChecker(desc, sub);

    Object.keys(settings).forEach(r => {
        setting_structure.setAttribute(r, settings[r]);
    });

    customSetting(setting_structure);

    tools_chid_item.appendChild(setting_structure);

    return tForm(tools_chid_item, setting_type);
}

function settingSwitch(desc, key, settings = {}, sub = 0) {
    const el = document.createElement('setting-switch');

    return setTForm(desc, key, settings, sub, el, 'switch');
}

function settingSelector(desc, key, values, settings = {}, sub = 0) {
    const el = document.createElement('setting-selector');
    el.textContent = values.map(v => `${v.name} {${v.value}}`).join('|');

    return setTForm(desc, key, settings, sub, el, 'selector');
}

function settingMapping(desc, key, settings = {}, sub = 0) {
    const el = document.createElement('setting-mapping');

    return setTForm(desc, key, settings, sub, el, 'mapping');
}

function settingTextarea(desc, key, placeholder = '입력', settings = {}) {
    const setting_textarea = document.createElement('setting-textarea');
    setting_textarea.setAttribute('key', key);
    setting_textarea.setAttribute('placeholder', placeholder);
    setting_textarea.textContent = desc;

    Object.keys(settings).forEach(r => {
        setting_textarea.setAttribute(r, settings[r]);
    });

    return tForm(setting_textarea, 'textarea');
}
