/**
 * @typedef {'MathML' | 'HTML' | 'SVG'} ElXmlNS
 * @typedef {((this: HTMLElement, existing: CSSStyleDeclaration) => string | CSSStyleDeclaration)} ElStyle
 * @typedef {((this: HTMLElement, ev: Event) => any)} ElEventListener
 * @typedef {boolean | { capture?: boolean, once?: boolean, passive?: boolean, signal?: boolean | AddEventListenerOptions }} ElEventOptions
 * @typedef {boolean} ElDynamicEventListenerBoolean
 * @typedef {(() => ElEventListener)} ElDynamicEventListenerFunction
 * @typedef {{ listener: ElEventListener, options?: ElEventOptions, generate?: (() => ElEventListener) }} ElEventObject
 * @typedef {(() => void)} ElReload
 * @typedef {{ value: any, refs: Set<ElReload> }} ElState Proxy Object
 * @typedef {(() => void)} ElRef Proxy Object
 */

// todo: ref 수정, state 수정, shadow 열기 구현?
// 요소에 부여할 특성과 요소에 붙일 객체에 대해서 분류?

// 이벤트 => options 

/**
 * 간편 요소 생성 및 자식 추가 함수
 * @param {string | HTMLElement} tag 생성할 태그
 * @param {Object} [attributes] 특성
 * @param {ElXmlNS | (() => ElXmlNS)} [attributes.xmlns] 
 * @param {string | CSSStyleDeclaration | ElStyle} [attributes.style] CSS 요소
 * @param {Object<string, ElEventListener | [ElDynamicEventListenerFunction, ElEventOptions, ElDynamicEventListenerBoolean] | [ElEventListener, ElEventOptions, ElDynamicEventListenerFunction] | ElEventObject>} [attributes.on] addEventListener
 * @param {Object | ElRef} [attributes.ref] [ref 로 오는 객체 | 'el.ref 객체' 또는 '함수 객체'] 에게 [element | appendChildren] (를)을 부여
 * @param {ElState[]} [attributes.states] el.state 객체를 사용하여 값 변경시 자동 reload
 * @returns {typeof appendChildren}
 */
function el(tag, attributes = {}) {
    let _dynamicEl = typeof tag == 'function';

    let element = tag instanceof HTMLElement
        ? tag
        : _dynamicEl
            ? document.createElement(tag() ?? 'div')
            : document.createElement(tag ?? 'div');
    setIsUsed();
    const init_style = element.style;

    const $attributes = {
        className: 'class',
    }
    let _xmlns = element.xmlns ?? null;
    let _refFn = null;
    let _ref = null;
    /** @type {ElState[]} */
    let _states = [];
    /**
     * @type {Object<string, ElEventObject>} 
     */
    let _event = {};
    let _style = null;

    let _dynamicAttributes = {};

    /**
     * @type {(typeof appendChildren | { element: Node } | (typeof appendChildren | { element: Node } | undefined)[] | undefined)[]}
     */
    let _children = [];
    /**
     * @type {{ index: number, generate: () => {} }[]}
     */
    let _dynamicChildren = [];

    if (!_xmlns && attributes.xmlns) {
        setXmlns(typeof attributes.xmlns == 'function' ? attributes.xmlns() : attributes.xmlns);
        delete attributes.xmlns;
    }

    if (setReference(attributes.ref)) {
        _ref = attributes.ref;
        delete attributes.ref;
    }

    if (Array.isArray(attributes.states)) {
        if (!_refFn)
            _refFn = () => appendChildren;

        attributes.states.forEach(state => {
            state.refs.add(_refFn);
        });
        _states = attributes.states;
        delete attributes.states;
    }

    if (attributes.on && typeof attributes.on == 'object') {
        Object.keys(attributes.on).forEach(key => {
            const eventObj = attributes.on[key];
            const form = {
                listener: undefined,
                options: undefined,
                generate: undefined
            }

            if (typeof eventObj == 'function') {
                form.listener = eventObj;
            }
            else if (Array.isArray(eventObj)) {
                const def = eventObj[2];
                const defType = typeof def == 'boolean';
                if (defType == 'boolean') {
                    form.listener = eventObj[0]();
                    form.options = eventObj[1];
                    form.generate = eventObj[0];
                }
                else {
                    form.listener = eventObj[0];
                    form.options = eventObj[1];
                    if (defType == 'function') {
                        form.generate = def;
                    }
                }
            }
            else if (eventObj && typeof eventObj == 'object') {
                form.listener = eventObj.listener;
                form.options = eventObj.options;
                form.generate = typeof eventObj.generate == 'function' ? eventObj.generate : undefined;
            }
            else return;

            _event[key] = form;
        });
        setEvent();
        delete attributes.on;
    }

    if (setStyle(attributes.style)) {
        _style = attributes.style;
        delete attributes.style;
    }

    setAttributes();

    /**
     * @param  {...HTMLElement | string} children 
     */
    function appendChildren(...children) {
        children.forEach(child => {
            if (typeof child === 'function') {
                if (child.element) {
                    if (child.element?.isUsed)
                        element.appendChild(child.element);

                    _children.push(child);

                    setParentReappend(child);
                }
                else {
                    executeElChild(child);
                }
            }
            else if (typeof child == 'string' || typeof child == 'number') {
                appendChildren(...el.toNodes(child));
            }
            else if (Array.isArray(child)) {
                appendChildren(...child);
            }
            else if (child instanceof Node) {
                element.appendChild(child);
                setIsUsed(true, child);
                _children.push({ element: child });
            }
        });

        return appendChildren;
    }
    function executeElChild(childEl, get_data = false) {
        const result = childEl();
        if (typeof result == 'string' || typeof result == 'number') {
            const transformation = el.toNodes(result).map(distributeChildren);

            if (get_data) {
                return transformation;
            }
            else {
                _dynamicChildren.push({ index: _children.length, generate: childEl });
                _children.push(transformation);
            }
        }
        else if (result.element) {
            if (result.element?.isUsed) {
                element.appendChild(result.element);
            }

            setParentReappend(result);

            if (get_data) {
                return result;
            }
            else {
                _dynamicChildren.push({ index: _children.length, generate: childEl });
                _children.push(result);
            }
        }
        else if (Array.isArray(result)) {
            const sub_children = result.map(distributeChildren);

            if (get_data) {
                return sub_children;
            }
            else {
                _dynamicChildren.push({ index: _children.length, generate: childEl });
                _children.push(sub_children);
            }
        }
        else if (result instanceof Node) {
            element.appendChild(result);
            setIsUsed(true, result, false);
            
            if (get_data) {
                return result;
            }
            else {
                _dynamicChildren.push({ index: _children.length, generate: childEl });
                _children.push({ element: result });
            }
        }
        else {
            if (get_data) {
                return undefined;
            }
            else {
                _dynamicChildren.push({ index: _children.length, generate: childEl });
                _children.push(undefined);
            }
        }
    }
    function distributeChildren(child) {
        if (typeof child == 'string' || typeof child == 'number') {
            return el.toNodes(child).map(distributeChildren);
        }
        else if (child.element) {
            if (child.element?.isUsed) {
                element.appendChild(child.element);
            }

            setParentReappend(child);

            return child;
        }
        else if (Array.isArray(child)) {
            return child.map(distributeChildren);
        }
        else if (child instanceof Node) {
            element.appendChild(child);
            setIsUsed(true, child, false);
            return { element: child };
        }
        else return undefined;
    }

    Object.defineProperty(appendChildren, 'element', {
        value: element,
        configurable: true,
        writable: false
    });
    /**
     * @param {keyof HTMLElementEventMap | (() => ElEventObject)} type 
     * @param {ElEventListener} listener 
     * @param {ElEventOptions} [options]
     * @returns 
     */
    appendChildren.on = function(type, listener, options) {
        if (_event[type]) {
            element.removeEventListener(type, _event[type].listener, _event[type].options);
        }

        _event[type] = {
            listener,
            options
        }
        element.addEventListener(type, listener, options);

        return appendChildren;
    }
    /**
     * @param {keyof HTMLElementEventMap} type
     * @returns 
     */
    appendChildren.off = function(type) {
        if (_event[type]) {
            element.removeEventListener(type, _event[type].listener, _event[type].options);
            delete _event[type];
        }

        return appendChildren;
    }
    /**
     * @param {Element} target 
     * @param {InsertPosition} where 
     * @param {object} [options]
     * @param {boolean} [options.validate_class]
     * @param {string[]} [options.ignore_class]
     */
    appendChildren.render = function(target = document.body, where = undefined, { validate_class = true, ignore_class = [] } = {}) {
        target.esrender(where || element, element, { validate_class, ignore_class });
        return appendChildren;
    }
    /**
     * @type {ElReload}
     */
    appendChildren.reload = reload;
    appendChildren.clear = function() {
        if (_states) _states.forEach(state => state.refs.delete(_refFn));
        if (_ref) _ref.ref = () => {};
    }
    
    function reload() {

        if (_dynamicEl) {
            const tag_result = tag();
            if (tag_result) {
                if (tag_result !== element.tagName) {
                    
                    if (_xmlns) {
                        setXmlns(typeof _xmlns == 'function' ? _xmlns() : _xmlns);
                    }
                    else {
                        const reappend_control = appendChildren.parentReappend;
                        const newEl = document.createElement(tag_result);
                        element.replaceWith(document.createElement(tag_result));
                        element = newEl;
                        Object.defineProperties(appendChildren, {
                            element: {
                                value: element,
                                configurable: true,
                                writable: false
                            },
                            parentReappend: {
                                value: reappend_control,
                                configurable: true,
                                writable: false
                            }
                        });
                        setReference();
                    }
                    reappend();
                }

                if (!element.isUsed) {
                    setIsUsed();
                    appendChildren.parentReappend && appendChildren.parentReappend();
                }
            }
            else if (element.isUsed) {
                setIsUsed();
                element.remove();
            }
            else return;
        }
        else if (typeof _xmlns == 'function') {
            setXmlns(_xmlns());
        }

        if (_dynamicChildren.length) {
            let use_reappend = -1;

            _dynamicChildren.forEach(v => {
                const old_data = Array.isArray(_children[v.index]) ? traverse(_children[v.index]) : traverse([_children[v.index]]);

                _children[v.index] = executeElChild(v.generate, true);

                const new_data = Array.isArray(_children[v.index]) ? traverse(_children[v.index]) : traverse([_children[v.index]]);

                let prev_el = undefined;

                new_data.forEach(child => {
                    if (child && child.element.isUsed) {
                        const old_child = old_data.next();

                        if (!old_child.done && old_child.value && old_child.value.element.isUsed) {
                            old_child.value.element.replaceWith(child.element);
                            prev_el = child.element;
                            if (old_child.value.clear) old_child.value.clear();
                        }
                        else if (prev_el) {
                            prev_el.insertAdjacentElement('afterend', child.element);
                            prev_el = child.element;
                        }
                        else {
                            use_reappend = v.index;
                        }
                    }
                });
                old_data.forEach(child => {
                    child && child.element.remove();
                    child.clear && child.clear();
                });

                if (use_reappend > -1) reappend(use_reappend);
            });
        }

        if (typeof _style == 'function') setStyle();
        setDynamicAttributes();
        setEvent(true);
    }

    function reappend(until) {
        let prev_el = undefined;

        (until ? _children : _children.slice(0, until + 1))
        .forEach(function findLastChild(child) {
            if (Array.isArray(child)) {
                child.forEach(findLastChild);
                return;
            }

            if (child && child.element.isUsed != child.element.isConnected) {
                if (child.element.isConnected) {
                    child.element.remove();
                }
                else if (prev_el)
                    prev_el.insertAdjacentElement('afterend', child.element);
                else 
                    element.appendChild(child.element);
            }

            if (child?.element.isConnected) prev_el = child;
        });
    }

    return appendChildren;

    function setIsUsed(value, target = element, configurable = true) {
        Object.defineProperty(target, 'isUsed', {
            configurable: configurable,
            writable: false,
            value: value ?? (_dynamicEl ? !!tag() : !!tag)
        });
    }

    function setParentReappend(child) {
        Object.defineProperty(child, 'parentReappend', {
            value: reappend,
            configurable: true,
            writable: false
        });
    }

    function setXmlns(xmlns = _xmlns) {
        let namespace = undefined;
        switch (xmlns) {
            case 'MathML':
                namespace = 'http://www.w3.org/1998/Math/MathML';
                break;

            case 'HTML':
                namespace = 'http://www.w3.org/1999/xhtml';
                break;

            case 'SVG':
                namespace = 'http://www.w3.org/2000/svg';
                break;

            default:
                namespace = xmlns;
                break;
        }
        if (element.xmlns !== namespace) {
            const reappend_control = appendChildren.parentReappend;
            let newEl = undefined;
            if (namespace) {
                newEl = document.createElementNS(namespace, _dynamicEl ? tag() : tag);
            }
            else {
                newEl = document.createElement(_dynamicEl ? tag() : tag);
            }
            element.replaceWith(newEl);
            element = newEl;
            Object.defineProperties(appendChildren, {
                element: {
                    value: element,
                    configurable: true,
                    writable: false
                },
                parentReappend: {
                    value: reappend_control,
                    configurable: true,
                    writable: false
                }
            });
            setReference();
            _xmlns = xmlns;
            return true;
        }
        return false;
    }

    function setReference(ref = _ref) {
        if (ref) {
            if (!_refFn)
                _refFn = () => appendChildren;

            switch (typeof ref) {
                case 'object': {
                    Object.defineProperty(ref, 'element', {
                        value: element,
                        writable: false,
                        configurable: true
                    });
                    break;
                }

                case 'function': {
                    ref.ref = _refFn;
                    break;
                }

                default: return false;
            }
            return true;
        }
        return false;
    }

    function setEvent(dynamic = false) {
        Object.keys(_event).forEach(type => {
            const obj = _event[type];
            if (dynamic) {
                if (obj.generate) {
                    const newObj = obj.generate();
                    element.removeEventListener(type, obj.listener, obj.options);
                    newObj && element.addEventListener(type, newObj, obj.options);
                    _event[type] = {
                        listener: newObj,
                        options: obj.options,
                        generate: obj.generate
                    }
                }
            }
            else {
                obj.listener && element.addEventListener(type, obj.listener, obj.options);
            }
        });
    }

    function setStyle(style = _style) {
        if (style) {
            switch (typeof style) {
                case 'string': {
                    element.style = style;
                    break;
                }

                case 'object': {
                    element.style = '';
                    Object.assign(element.style, style);
                    break;
                }
                
                case 'function': {
                    setStyle(style.call(element, init_style));
                    break;
                }

                default: return false;
            }
            return true;
        }
        return false;
    }

    function setAttributes(type_check = true) {
        const attributes_keys = Object.keys(attributes);

        if (type_check) {
            attributes_keys.forEach(key => {
                const value = attributes[key];
                let filtered_value = undefined; 
                
                if (typeof value == 'function') {
                    filtered_value = value.call(element);
                    _dynamicAttributes[key] = value.bind(element);
                }
                else {
                    filtered_value = value;
                }

                if (isFull(filtered_value)) {
                    element.setAttribute(
                        $attributes[key] || key,
                        filtered_value
                    );
                }

            });
            return;
        }

        attributes_keys.forEach(key => {
            const value = attributes[key];
            element.setAttribute(
                $attributes[key] || key,
                value
            );
        });
    }

    function setDynamicAttributes() {
        const attributes_keys = Object.keys(_dynamicAttributes);
        attributes_keys.forEach(key => {
            const value = _dynamicAttributes[key]();

            if (isFull(value)) {
                element.setAttribute(
                    $attributes[key] || key,
                    value
                );
            }
            else {
                element.removeAttribute($attributes[key] || key);
            }
        });
    }

    function isFull(value) {
        return value !== undefined && value !== null && !Number.isNaN(value);
    }
}
el.toNodes = function(str = 'undefined') {
    const tempEl = document.createElement('div');
    tempEl.innerHTML = str;
    return Array.from(tempEl.childNodes);
}
/**
 * @param {*} value 
 * @returns {ElState}
 */
el.state = function(value) {
    return new Proxy({ value, refs: new Set() }, {
        set(target, prop, value) {
            if (prop == 'value') {
                target[prop] = value;
                target.refs.forEach(ref => {
                    ref().reload();
                });
                return true;
            }

            return false;
        }
    });
}
/**
 * @returns {ElRef}
 */
el.ref = function() {
    const obj = () => {}
    obj.ref = () => {};

    return new Proxy(obj, {
        apply(target, _, args) {
            try {
                const origin = target.ref();
                if (origin) return origin(...args);
                return undefined;
            } catch (e) {
                return undefined;
            }
        },

        get(target, prop) {
            const origin = target.ref();
            if (origin) return Reflect.get(origin, prop);
            return Reflect.get(target, prop);
        }
    });
}





function* traverse(array) {
    for (const item of array) {
        if (Array.isArray(item)) {
            yield* traverse(item);
        } else {
            yield item;
        }
    }
}





/**
 * Element Substitution Render (주의) 단일 요소에게만 사용해야합니다.
 * @param {InsertPosition | HTMLElement} where 
 * @param {HTMLElement | string} [element] 
 * @param {object} [options]
 * @param {boolean} [options.validate_class] class 검사 여부
 * @param {string[]} [options.ignore_class] class 검사시 무시할 class들
 */
HTMLElement.prototype.esrender = function(where, element, { validate_class = true, ignore_class = [] } = {}) {
    if (where instanceof HTMLElement) {
        validate_class = element?.validate_class ?? validate_class;
        ignore_class = element?.ignore_class || ignore_class;
        element = where;
        where = 'beforeend';
    }
    else if (typeof where != 'string') {
        throw new Error('지명할 방식은 문자열 타입이여야 합니다.');
    }
    else if (!['beforebegin', 'afterbegin', 'beforeend', 'afterend'].includes(where)) {
        throw new Error('지명할 방식이 알맞지 않습니다.');
    }
    else if (!element) {
        throw new Error('위치 지정시 요소가 존재하여야 합니다.');
    }

    const is_HTMLElement = (element instanceof HTMLElement);
    const is_string = (typeof element == 'string');

    if (!is_HTMLElement && !is_string) 
        throw new Error('요소는 HTMLElement 혹은 문자열이여야 합니다.');

    let early_exist_el = null;

    if (is_HTMLElement) {
        if (element.tagName.includes('-') && document.getElementsByTagName(element.tagName).length < 2) {
            
        }

        early_exist_el = document.getElementById(element.id);
        if (validate_class && !early_exist_el && element.classList.length > 0) {
            const doc = (where == 'beforeend' || where == 'afterbegin')
                ? this
                : this.parentElement;
            if (doc) {
                if (!Array.isArray(ignore_class)) {
                    ignore_class = typeof ignore_class == 'string'
                        ? [ignore_class]
                        : [];
                }

                const ignore_class_set = new Set(ignore_class);

                const filtered_class = [...element.classList].filter(cl => !ignore_class_set.has(cl));

                if (filtered_class.length > 0) {
                    early_exist_el = doc.querySelector(`:scope > ${element.tagName.toLowerCase()}.${filtered_class.join('.')}`);
                }
            }
        }
    }

    if (early_exist_el && early_exist_el.outerHTML !== element.outerHTML) {
        early_exist_el.replaceWith(element);
        return true;
    }
    else if (!early_exist_el) {
        if (is_HTMLElement) {
            this.insertAdjacentElement(where, element);
            return true;
        }
        else {
            this.insertAdjacentHTML(where, element);
            return true;
        }
    }
    else {
        return false;
    }
}