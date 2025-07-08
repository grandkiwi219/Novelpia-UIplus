Object.values(npup.options).forEach(ca => {
    let tools = [];

    Object.values(ca.options).forEach(op => {
        let tools_childs = [];

        toolsBinding(tools_childs, op);

        tools.push(toolsStructure(...tools_childs));
    });

    let tool_box = toolBox(ca.name, { icon: ca.icon, icon_svg: ca.icon_svg ?? null }, ca.settings, ca.setups, ...tools);

    document.getElementById('waiting').insertAdjacentElement('beforebegin', tool_box);
});

function toolBox(name, { icon, icon_svg }, settings = {}, setups = { length: 1 }, ...node) {
    const tool_box = document.createElement('div');
    tool_box.classList.add('tools');

    Object.keys(settings).forEach(r => {
        tool_box.setAttribute(r, settings[r]);
    });

    if (setups.length > 1) 
        Object.assign(tool_box.style, {
            height: `calc(var(--template-rows-size) * ${setups.length} + var(--box-grid-row-gap) * ${setups.length - 1})`,
            gridRow: `auto / span ${setups.length}`
        });

    let tool_icon = icon_svg ? `<img src="${icon_svg}" alt="${icon}">&nbsp;` : icon;
    let tool_headline_structure = ` ${tool_icon} ${name} 설정`;

    const tool_headline = document.createElement('div');
    tool_headline.classList.add('tools-headline');
    tool_headline.insertAdjacentHTML('afterbegin', tool_headline_structure);

    const tool_warp = document.createElement('div');
    tool_warp.classList.add('tools-wrap');

    node.forEach(r => {
        tool_warp.appendChild(r);
    });

    tool_box.appendChild(tool_headline);
    tool_box.appendChild(tool_warp);

    return tool_box;
}

function toolsStructure(...node) {
    if (node[0].type == 'textarea') return node[0].node;

    const tools_child = document.createElement('div');
    tools_child.classList.add('tools-child');

    node.forEach(r => {
        tools_child.appendChild(r.node);
    });

    return tools_child;
}

function toolsBinding(item, op, sub = false) {
    let tools_item;

    switch (op.type.option) {
        case 'switch': 
            tools_item = settingSwitch(op.desc, op.key, op.settings, sub);
            break;
        case 'selector':
            tools_item = settingSelector(op.desc, op.key, op.values, op.settings, sub);
            break;
        case 'textarea':
            tools_item = settingTextarea(op.desc, op.key, op.settings.placeholder, op.settings);
            break;
        default:
            tools_item = settingSwitch(op.desc, op.key, op.settings, sub);
            break;
    }

    item.push(tools_item);

    if (op.options) {
        Object.values(op.options).forEach(r => {
            toolsBinding(item, r, true);
        });
    }
}

function subChecker(desc, sub) {
    const tools_child_item = document.createElement('div');
    tools_child_item.classList.add(`tools-${sub ? 'sub' : 'main'}`);

    const tools_child_item_name = document.createElement('div');
    let item_name = sub ? `&nbsp; ㄴ ${desc}` : desc;
    tools_child_item_name.insertAdjacentHTML('afterbegin', item_name);

    tools_child_item.appendChild(tools_child_item_name);

    return tools_child_item;
}

function tForm(node, type) {
    return { node, type: type.toLowerCase() };
}

function settingSwitch(desc, key, settings = {}, sub = false) {
    const tools_chid_item = subChecker(desc, sub);

    const setting_switch = document.createElement('setting-switch');
    setting_switch.setAttribute('key', key);

    Object.keys(settings).forEach(r => {
        setting_switch.setAttribute(r, settings[r]);
    });

    tools_chid_item.appendChild(setting_switch);

    return tForm(tools_chid_item, 'switch');
}

function settingSelector(desc, key, values, settings = {}, sub = false) {
    const tools_chid_item = subChecker(desc, sub);

    const setting_selector = document.createElement('setting-selector');
    setting_selector.setAttribute('key', key);
    setting_selector.textContent = values.map(v => `${v.name} {${v.value}}`).join('|');

    Object.keys(settings).forEach(r => {
        setting_selector.setAttribute(r, settings[r]);
    });

    tools_chid_item.appendChild(setting_selector);

    return tForm(tools_chid_item, 'selector');
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
