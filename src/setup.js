let storage = chrome.storage.sync;
const local = chrome.storage.local;
let storage_type = 'sync';

local.get([npup.keys.sync]).then(r => {
    if (!r[npup.keys.sync] && typeof r[npup.keys.sync] != 'boolean')
        local.set({ [npup.keys.sync]: true });
    else if (!r[npup.keys.sync]) {
        storage = local, storage_type = 'local', storage_changed = true;
    } 
    ready(r);
});

local.get(['debug-mode']).then(r => {
    npup.debug = r['debug-mode'];
    /* 
    {
        alert: true,
        storage: true,
        key: true
    }
    */
});



const { tryChecker, pathChecker, domainChecker, engineChecker, toastAlert, tryFunc } = npup.func;
const observer_setup = npup.settings.observer;



const ENGINE_TYPE = {
    ALL: 'all', // for Addon class
    SWITCH: 'switch',
    SELECTOR: 'selector',
    SYSTEM: 'system',
};

class EngineStructure {
    /**
     * @type {Map<string, SystemStructure>}
     */
    #systems_structures = new Map();

    #execution = () => { return; };

    /**
     * engine structure
     * @param {string} name This engine's name
     * @param {string} type This engine's type, Must be one of STRUCTURE.TYPES
     * @param {boolean} [system_tryChecker=true] Whether this engine uses the system engine tryChecker
     */
    constructor(name, type, system_tryChecker = true) {
        if (!Object.values(ENGINE_TYPE).includes(type))
            throw new TypeError(`This ${name} class cannot be used without specifying a type.`);

        this.name = name ? name : undefined;
        this.type = type;
        this.system_tryChecker = system_tryChecker;
    }

    /**
     * Add system this engine
     * @param {SystemStructure} system add system this engine
     * @returns {EngineStructure} this
     */
    addSystemStructure(system) {
        if (!(system instanceof SystemStructure))
            throw new TypeError(`Expected an instance of ${this.type} SystemStructure.`);

        this.#systems_structures.set(system.key, system);
        return this;
    }

    /**
     * Set additional execution
     * @param {function} execution additional execution
     * @returns {EngineStructure} this
     */
    setAdditionalExecution(execution) {
        if (typeof execution != 'function')
            this.#execution = () => { return execution };
        else
            this.#execution = execution;

        return this;
    }

    /**
     * Engine start
     */
    on() {
        const engine_data = html.getAttribute(`${npup.project.prefix.css}engine`);
        html.setAttribute(
            `${npup.project.prefix.css}engine`,
            (engine_data ? engine_data + ' ': '') + this.name.replace(/ /g, '-')
        );

        return storage.get(this.#getAllKeys()).then(r => {
            this.#debugStorage(r);

            switch (this.type) {
                case ENGINE_TYPE.SYSTEM:
                    if (this.system_tryChecker)
                        tryChecker(() => this.#engine.SYSTEM(r), this.name);
                    else 
                        this.#engine.SYSTEM(r)
                    break;

                case ENGINE_TYPE.SWITCH:
                    this.#engine.SWITCH(r);
                    break;

                case ENGINE_TYPE.SELECTOR:
                    this.#engine.SELECTOR(r);
                    break;
            }

            return this.#execution(r, this);
        });
    }

    #engine = {
        SWITCH: (r) => {
            this.#getKeys().forEach(async key =>{
                const system_structure = this.getSystemStructure(key);

                const system_check = (storage_type == 'sync' && system_structure.settings?.local);

                if (r[key] && !system_check)
                    html.setAttribute(npup.project.prefix.css + key, '');
                else if (system_check) {
                    const key_data = await local.get([key]);
                    if (key_data[key])
                        html.setAttribute(npup.project.prefix.css + key, '');
                } else 
                    return;

                const addons = this.#getAddons(key);

                if (addons)
                    addons.forEach(addon => {
                        if (r[addon]) html.setAttribute(npup.project.prefix.css + key, '');
                    });
            });
        },
        SELECTOR: (r) => {
            this.#getKeys().forEach(async key => {
                const system_structure = this.getSystemStructure(key);

                const system_check = (storage_type == 'sync' && system_structure.settings?.local);

                if (!r[key] || system_check) {
                    if (system_check) {
                        r = await local.get([key]);

                        if (!r[key]) return;
                    } else return;
                }

                if (r[key] == system_structure.options[0]) return;

                html.setAttribute(npup.project.prefix.css + key, r[key]);
            });
        },
        SYSTEM: (r) => {
            this.#getKeys().forEach(async key => {
                this.#debugKey(key);

                const system_structure = this.getSystemStructure(key);

                const system_check = (storage_type == 'sync' && system_structure.settings?.local);

                if (!r[key] || system_check) {
                    if (system_check) { 
                        const key_data = await local.get([key]);
                        r[key] = key_data[key];

                        this.#debugStorage(r, true);

                        if (!r[key]) return;
                    } else return;
                }

                if (system_structure.options.length && r[key] == system_structure.options[0]) return;

                tryChecker(() => {
                    system_structure
                        .system(r);
                }, key, false);
            });
        }
    };

    #debugStorage(r, local) {
        if (npup.debug?.storage)
            npup.dev(`${this.name} ${storage_type} storage value${local ? ' (local) ' : ' '}------------\n`, r);
    }

    #debugKey(key) {
        if (npup.debug?.key)
            npup.dev(key, this.getSystemStructure(key));
    }

    /**
     * Function to retrieve key values ​​from extension storage
     * @returns {EngineStructure} this
     */ 
    #getAllKeys() {
        const values = [...this.#systems_structures.values()];

        let keys = values.map(system => system.key);

        values.forEach(system => {
            system.addons.forEach(addons => {
                addons.addons.forEach(addon => keys.push(addon));
            });
        });

        return [...new Set(keys)];
    }

    /**
     * Key values ​​to apply by default
     * @returns Key values ​​to apply by default
     */
    #getKeys() {
        return [...this.#systems_structures.values()]
            .map(system => system.key);
    }

    #getAddons(key) {
        const addons = [...new Set(
            this.getSystemStructure(key).addons
                .filter(r => r.type == ENGINE_TYPE.ALL || r.type == this.type)
                .flatMap(r => r.addons)
        )];

        return addons.length > 0 ? addons : undefined;
    }

    /**
     * get system
     * @param {string} key 
     * @returns {SystemStructure} key's SystemStructure
     */
    getSystemStructure(key) {
        if (!this.#systems_structures.has(key)) {
            console.warn(`System ${key} does not exist in ${this.name} engine.`);
            return new SystemStructure('', this.type);
        }
        else 
            return this.#systems_structures.get(key);
    }
}




const STRUCTURE = {
    SWITCH:      { TYPE: 'switch',     ENGINE: new EngineStructure('스위치', ENGINE_TYPE.SWITCH)},
    SELECTOR:    { TYPE: 'selector',   ENGINE: new EngineStructure('선택자', ENGINE_TYPE.SELECTOR)},
    CUSTOM:      { TYPE: 'custom',     ENGINE: new EngineStructure('커스텀', ENGINE_TYPE.SYSTEM, false)},
    PRE_COMMON:  { TYPE: 'pre-common',  ENGINE: new EngineStructure('헤드 공통', ENGINE_TYPE.SYSTEM)},
    COMMON:      { TYPE: 'common',     ENGINE: new EngineStructure('바디 공통', ENGINE_TYPE.SYSTEM)},
    SYSTEM:      { TYPE: 'system',     ENGINE: new EngineStructure('', ENGINE_TYPE.SYSTEM)},
};

class Addons {
    /**
     * addon structure
     * @param {string} engine_type engine type
     * @param  {...string} addons addon key names
     */
    constructor(engine_type, ...addons) {
        if (!Object.values(ENGINE_TYPE).includes(engine_type))
            throw new TypeError(`To add an add-on, it must be of a type that exists in the engine type.`);

        if (!addons.every(addon => typeof addon == 'string' && addon.trim()))
            throw new TypeError(`The addon to be added must be a string`);

        this.type = engine_type;
        this.addons = addons.map(k => k.trim());
    }
}

/**
 * 사용법:
 * 
 * 엔진 타입이 switch라면 키 값과 타입을,
 * 엔진 타입이 selector라면 키 값과 타입, 옵션들을,
 * 엔진 타입이 system이라면 키 값과 타입, 시스템을 설정해주어야만 한다.
 * 
 * 추가할 키 값에 추가적인 키 값이 요구된다면 애드온으로 추가시키면 된다.
 * 단, 애드온을 추가하기 위해선 Addons 클래스를 이용해서 추가하여야 한다.
 */
class SystemStructure {
    /**
     * system structure
     * @param {string} key data key name
     * @param {string} types  (STRUCTURE.TYPES) switch | selector | system
     */
    constructor(key, types, settings) {
        this.key = typeof key == 'string' && key ? key.trim() : undefined;
        /**
         * @type {Addons[]} 
         */
        this.addons = [];
        this.description = undefined;
        this.types = types;
        this.system = () => { return /* npup.dev(`The system for "${this.key}" could not find`) */; };
        this.options = [];

        this.settings = settings;
    }

    /**
     * Add dependent keys
     * @param  {...Addons} addons dependent keys { type: string, addons: string[] }
     * @returns {SystemStructure} this
     */
    setAddons(...addons) {
        if (!addons.every(addon => addon instanceof Addons))
            throw new TypeError(`Addons to be added to ${this.key} SystemStructure must use the Addons class.`);

        this.addons = addons;
        return this;
    }

    /**
     * Set system description
     * @param {string} content description of key
     * @returns {SystemStructure} this
     */
    setDescription(content) {
        this.description = content;
        return this;
    }

    /**
     * Set system function
     * @param {function} system system function
     * @returns {SystemStructure} this
     */
    setSystem(system) {
        if (typeof system !== 'function') 
            throw new TypeError(`The system in ${this.key} structure is not a function. The system must be a function.`);
        else if (
            !this.types.some(type =>
                Object.values(STRUCTURE)
                    .filter(s => s.ENGINE.type === ENGINE_TYPE.SYSTEM)
                    .map(s => s.TYPE)
                    .includes(type)
            )
        ) 
            console.warn(`The type in ${this.key} structure does not include the system, so it may not be used.`);

        this.system = system;
        return this;
    }

    /**
     * Set selector options
     * @param {boolean} first_option Are the options you are entering in the same order as written in options.html?
     * @param  {...string} options selector options
     * @returns {SystemStructure} this
     */
    setOptions(first_option, ...options) {
        if (!first_option) 
            console.warn(`You answered that it is not in order. The first option in the selector type of ${this.key} system is not applied.`)
        //else if (!this.types.includes(STRUCTURE.SELECTOR.TYPE))
        //    console.warn(`The type in ${this.key} structure does not include the options, so it may not be used.`);

        this.options = options;
        return this;
    }

    /**
     * Auto sort method
     */
    setup() {
        Object.values(STRUCTURE).forEach(r => {
            if (this.types.includes(r.TYPE))
                r.ENGINE.addSystemStructure(this);
        });
    }
}






// Base Functions
/**
 * 입력한 파일 위치를 사이트 페이지에 삽입합니다
 * @param {string} path 파일 위치
 */
function scriptInjection(path) {
    if (!path) return;

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(path);
    document.head.appendChild(script);
}

let basic_use_system = {};

/**
 * basically use system about key
 * @param {string} key system key
 * @param {*} r 
 */
function basicUseSystem(key, r, ...settings) {
    if (!r[key] && !basic_use_system[key]) {
        basic_use_system[key] = true;
        searchSystem(key).system(r, ...settings);
    }
}

/**
 * search system about key
 * @param {string} key system key
 * @param {*} r 
 */
function searchSystem(key, engine = 'system') {
    if (!key || typeof key != 'string') {
        const msg = '키 값이 없거나 문자열 형식이 아닙니다.';
        toastAlert({
            title: `오류 발생`,
            msg: msg,
            type: 'error'
        })
        return npup.error(msg);
    }
    const data = STRUCTURE[engine.toUpperCase().replace('-', '_')].ENGINE.getSystemStructure(key);
    if (!data.key) {
        const msg = '옵션을 찾을 수 없는 키 값 입니다.';
        toastAlert({
            title: `오류 발생`,
            msg: msg,
            type: 'error'
        })
        return npup.error(msg);
    }
    return data;
}

