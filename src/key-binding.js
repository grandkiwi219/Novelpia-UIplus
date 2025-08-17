keyBinding();

function keyBinding() {
    for (const categoryKey in npup.options) {
        const category = npup.options[categoryKey];

        if (!category.options) continue;

        for (const optionKey in category.options) {
            const option = category.options[optionKey];

            if (typeof option === 'object' && option !== null) {
                option.key = optionKey;

                if (option.options) {
                    for (const subKey in option.options) {
                        const subOption = option.options[subKey];
                        if (typeof subOption === 'object' && subOption !== null) {
                            subOption.key = subKey;
                        }
                    }
                }
            }
        }
    }
}
