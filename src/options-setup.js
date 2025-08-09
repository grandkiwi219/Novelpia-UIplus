Object.values(npup.options).forEach(ca => {
    Object.values(ca.options).forEach(op => optionBinding(ca, op));
});

function optionBinding(ca, op) {
    let engine = [];

    const src = op.engine ?? ca.engine;

    if (typeof src === 'string') engine.push(src);
    else if(Array.isArray(src))  engine.push(...src);
    else                         return;

    if (!(engine.includes(STRUCTURE.SYSTEM.ENGINE.name) || src == 'all')) return;

    let opbi_types = [];

    if (op.type.option == 'mapping') {
        opbi_types = ['system'];
    }
    else if (Array.isArray(op.type.structure)) {
        opbi_types = op.type.structure;
    }
    else if (!Array.isArray(op.type.structure) && typeof op.type.structure == 'string') {
        opbi_types = [op.type.structure];
    } 
    else if (op.type.structure != undefined || op.type.structure != null) {
        npup.dev(`경고) ${op.key}의 구조 유형이 불안정합니다. 문자열 혹은 문자열 배열이어야 합니다.`);
    }

    if (opbi_types.length < 1) return;

    let opbi = new SystemStructure(op.key, opbi_types, op.settings)
        .setDescription(op.desc);

    if (op.values?.length /* && op.type.structure?.includes(STRUCTURE.SELECTOR.TYPE) */) {
        let opbi_values = op.values.map(va => va.value);
        opbi.setOptions(true, ...opbi_values);
    }

    if (op.addons?.length) {
        let opbi_addons = op.addons.map(ad => new Addons(ad.type, ...ad.keys));
        opbi.setAddons(...opbi_addons);
    }

    if (op.system)
        opbi.setSystem(op.system);

    opbi.setup();

    if (op.options) {
        Object.values(op.options).forEach(opop => {
            optionBinding(ca, opop);
        });
    }

    delete opbi;
}
