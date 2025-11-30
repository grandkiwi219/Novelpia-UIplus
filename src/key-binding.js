(() => {
    if (!npup) return console.error('Extension-Base[Novelpia-UI-Plus]: A fatal problem occurred. \'Key Binding\' is down.');

    keyBinding(npup.options);
})();

function keyBinding(npup_options) {
    Object.keys(npup_options).forEach(option_key => {
        const option = npup_options[option_key];

        if (typeof option !== 'object' || !option) return;

        option.key = option_key;

        if (!option.options) return;

        keyBinding(option.options, true);
    });
}
