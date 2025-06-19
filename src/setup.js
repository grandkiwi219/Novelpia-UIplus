let storage = chrome.storage.sync;
const local = chrome.storage.local;

local.get([sync_key]).then(r => {
    if (!r[sync_key] && typeof r[sync_key] != 'boolean')
        local.set({ [sync_key]: true });
    else if (!r[sync_key]) {
        storage = local;
    } 
    ready();
});






const ENGINE_TYPE = {
    ALL: 'all', // for Addon class
    ON_OFF: 'on-off',
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
        return storage.get(this.#getAllKeys()).then(r => {
            switch (this.type) {
                case ENGINE_TYPE.SYSTEM:
                    if (this.system_tryChecker)
                        tryChecker(() => this.#engine.SYSTEM(r), this.name);
                    else 
                        this.#engine.SYSTEM(r)
                    break;

                case ENGINE_TYPE.ON_OFF:
                    this.#engine.ON_OFF(r);
                    break;

                case ENGINE_TYPE.SELECTOR:
                    this.#engine.SELECTOR(r);
                    break;
            }

            return this.#execution(this);
        });
    }

    #engine = {
        ON_OFF: (r) => {
            this.#getKeys().forEach(key =>{
                if (r[key])
                    html.setAttribute(project_prefix + key, '');

                const addons = this.#getAddons(key);

                if (addons)
                    addons.forEach(addon => {
                        if (r[addon]) html.setAttribute(project_prefix + key, '');
                    });
            });
        },
        SELECTOR: (r) => {
            this.#getKeys().forEach(key => {
                if (r[key] && r[key] != this.#getSystemStructure(key).options[0])
                    html.setAttribute(project_prefix + key, r[key]);
            });
        },
        SYSTEM: (r) => {
            this.#getKeys().forEach(key => {
                tryChecker(() => {
                    this.#getSystemStructure(key)
                        .system(r);
                }, key, false);
            });
        }
    };

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
            this.#getSystemStructure(key).addons
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
    #getSystemStructure(key) {
        /* if (!this.#systems_structures.has(key)) {
            console.warn(`System ${key} does not exist in ${this.name} engine.`);
            return new SystemStructure('', this.type);
        } */
        return this.#systems_structures.get(key);
    }
}




const STRUCTURE = {
    ON_OFF:      { TYPE: 'on-off',     ENGINE: new EngineStructure('온오프', ENGINE_TYPE.ON_OFF)},
    SELECTOR:    { TYPE: 'selector',   ENGINE: new EngineStructure('선택자', ENGINE_TYPE.SELECTOR)},
    CUSTOM:      { TYPE: 'custom',     ENGINE: new EngineStructure('커스텀', ENGINE_TYPE.SYSTEM, false)},
    PRE_COMMON:  { TYPE: 'preCommon',  ENGINE: new EngineStructure('헤드 공통', ENGINE_TYPE.SYSTEM)},
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
 * 엔진 타입이 on-off라면 키 값과 타입을,
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
     * @param {string} types  (STRUCTURE.TYPES) on-off | selector | system
     */
    constructor(key, ...types) {
        this.key = typeof key == 'string' && key ? key.trim() : undefined;
        /**
         * @type {Addons[]} 
         */
        this.addons = [];
        this.description = undefined;
        this.types = types;
        this.system = () => { return undefined };
        this.options = [];
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
        else if (!this.types.includes(STRUCTURE.SELECTOR.TYPE))
            console.warn(`The type in ${this.key} structure does not include the options, so it may not be used.`);

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
const scriptInjection = (path) => {
    if (!path) return;

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(path);
    document.head.appendChild(script);
}
