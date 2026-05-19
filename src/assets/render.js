/**
 * 
 * @typedef {string & {}} ElXmlNamespaceURI more information is {@link https://www.w3schools.com/xml/xml_namespaces.asp here}
 * @typedef {'MathML' | 'HTML' | 'SVG' | ElXmlNamespaceURI} ElXmlNS
 * @typedef {((this: HTMLElement, existing: CSSStyleDeclaration) => string | CSSStyleDeclaration)} ElStyle
 * @typedef {((this: HTMLElement, ev: Event) => any)} ElEventListener
 * @typedef {boolean | { capture?: boolean, once?: boolean, passive?: boolean, signal?: boolean | AddEventListenerOptions }} ElEventOptions
 * @typedef {boolean} ElDynamicEventListenerBoolean
 * @typedef {(() => ElEventListener)} ElDynamicEventListenerFunction
 * @typedef {{ listener: ElEventListener, options?: ElEventOptions, generate?: (() => ElEventListener) }} ElEventObject
 * @typedef {(() => void)} ElReload
 * @typedef {{ value: any, refs: Set<ReturnType<typeof el>> }} ElState Proxy Object
 * @typedef {(() => void)} ElRef Proxy Object
 */
/**
 * @typedef {Object} ElAttributes 특성
 * @prop {ElXmlNS | (() => ElXmlNS)} [xmlns]
 * @prop {Object | ElRef} [ref] [ref 로 오는 객체 | 'el.ref 객체' 또는 '함수 객체'] 에게 [element | appendChildren] (를)을 부여
 * @prop {ElState[]} [states] el.state 객체를 사용하여 값 변경시 자동 reload
 * @prop {Object<string, ElEventListener | [ElDynamicEventListenerFunction, ElEventOptions, ElDynamicEventListenerBoolean] | [ElEventListener, ElEventOptions, ElDynamicEventListenerFunction] | ElEventObject>} [on] addEventListener
 * @prop {string | CSSStyleDeclaration | ElStyle} [style] CSS 요소
 */

// todo: ref, states, on->options의 동적 지원, shadow 열기 지원

/**
 * 간편 요소 생성 및 자식 추가 함수
 * @param {string | HTMLElement} tag 생성할 태그
 * @param {ElAttributes & { [key: string]: any }} [attributes] 특성
 * @returns {typeof appendChildren}
 */
function el(tag, attributes = {}) {
    let _dynamicEl = false;

    /** @type {HTMLElement} */
    let element = undefined;

    if (tag instanceof HTMLElement) {
        element = tag;
    }
    else if (typeof tag == 'function') {
        _dynamicEl = true;

        let tmp = tag();
        if (tag instanceof HTMLElement) {
            element = tmp;
        }
        else {
            element = setTag(tmp ?? 'div');
        }
    }
    else {
        element = setTag(tag ?? 'div');
    }
    
    const init_style = element.style;

    const {
        xmlns,
        ref,
        states,
        on,
        style,
        ..._attributes
    } = attributes;

    const $attributes = {
        className: 'class',
    }
    let _xmlns = element.xmlns ?? xmlns;
    let _refFn = null;
    /** @type {ElState[]} */
    let _states = [];
    /** @type {Object<string, ElEventObject>} */
    let _event = {};
    let _style = {};

    let _dynamicAttributes = {};

    /** @type {(typeof appendChildren | { element: Node, isUsed: boolean } | (typeof appendChildren | { element: Node, isUsed: boolean } | undefined)[] | undefined)[]} */
    let _children = [];
    /** @type {{ index: number, generate: () => void }[]} */
    let _dynamicChildren = [];

    if (!_xmlns) {
        setXmlns(typeof _xmlns == 'function' ? xmlns() : _xmlns);
    }

    setReference(ref);

    if (Array.isArray(states)) {
        setRefFn();

        states.forEach(state => {
            state.refs.add(_refFn);
        });
        _states = states;
    }

    if (on && typeof on == 'object') {
        Object.keys(on).forEach(key => {
            const eventObj = on[key];
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
    }

    if (setStyle(style)) {
        _style = style;
    }

    setAttributes(true);

    /**
     * @param  {...HTMLElement | string} children 
     */
    function appendChildren(...children) {
        const fragment = document.createDocumentFragment();

        children.forEach(function setupChild(child) {
            if (typeof child === 'function') {
                if (child.element) {
                    if (child.isUsed)
                        fragment.appendChild(child.element);

                    _children.push(child);

                    setParent(child);
                    setChildIndex(child);
                }
                else {
                    executeElChild(child, { fragment });
                }
            }
            else if (typeof child == 'string' || typeof child == 'number') {
                [...el.toNodes(child)].forEach(setupChild);
            }
            else if (Array.isArray(child)) {
                child.forEach(setupChild);
            }
            else if (child instanceof Node) {
                fragment.appendChild(child);
                const data = {
                    element: child
                }
                setIsUsed(true, data);
                _children.push(data);
            }
        });

        element.appendChild(fragment);

        return appendChildren;
    }
    /** @param {() => any} component  */
    function executeElChild(component, { get_data = false, fragment = undefined } = {}) {
        const childEl = component();
        const index = _children.length;
        if (typeof childEl == 'string' || typeof childEl == 'number') {
            const transformation = el.toNodes(childEl)
                .map(distributeChildren({ get_data, fragment }));

            if (get_data)
                return transformation;
            else
                _children.push(transformation);
        }
        else if (childEl?.element) {
            setParent(childEl);
            setChildIndex(childEl);

            if (get_data)
                return childEl;
            else {
                if (childEl.isUsed)
                    (fragment || element).appendChild(childEl.element);
                _children.push(childEl);
            }
        }
        else if (Array.isArray(childEl)) {
            const sub_children = childEl
                .map(distributeChildren({ get_data, fragment }));

            if (get_data)
                return sub_children;
            else
                _children.push(sub_children);
        }
        else if (childEl instanceof Node) {
            const data = {
                element: childEl
            }
            setIsUsed(true, data, false);
            
            if (get_data)
                return data;
            else {
                (fragment || element).appendChild(childEl);
                _children.push(data);
            }
        }
        else {
            if (get_data)   return undefined;
            else            _children.push(undefined);
        }

        _dynamicChildren.push({ index, generate: component });
    }
    function distributeChildren({ get_data = false, fragment = undefined }) {
        return function(childEl) {
            if (typeof childEl == 'string' || typeof childEl == 'number') {
                return el.toNodes(childEl)
                    .map(distributeChildren({ get_data, fragment }));
            }
            else if (childEl?.element) {
                if (!get_data && childEl.isUsed) {
                    (fragment || element).appendChild(childEl.element);
                }
    
                setParent(childEl);
                setChildIndex(childEl);
    
                return childEl;
            }
            else if (Array.isArray(childEl)) {
                return childEl
                    .map(distributeChildren({ get_data, fragment }));
            }
            else if (childEl instanceof Node) {
                if (!get_data)
                    (fragment || element).appendChild(childEl);
                const data = {
                    element: childEl
                }
                setIsUsed(true, data, false);
    
                return data;
            }
            else return undefined;
        }
    }

    Object.defineProperty(appendChildren, 'element', {
        get() {
            return element;
        }
    });
    Object.defineProperty(appendChildren, '_children', {
        get() {
            return _children;
        }
    });
    Object.defineProperty(appendChildren, '_event', {
        get() {
            return _event;
        }
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
    /** @type {ElReload} */
    appendChildren.reload = reload;
    /** @param {boolean} migrated 동일 객체에게 이전 완료시 true 를 주어 현 객체가 참조를 끊게 만듦 */
    appendChildren.clear = function(migrated = false) {
        element = null;
        appendChildren.isExist = false;
        if (!migrated)
            for (const child of traverse(Array.isArray(_children) ? _children : [_children])) {
                if (child?.isExist) child.clear();
            }
        _children = null;
        _event = null;
    }
    // todo: 자식의 이벤트마저 교체 변경하는 로직 필요
    /** 
     * isEqualNode 검사 통과 시 element 및 children, event 교체 작업
     * @param {typeof appendChildren} target
     */
    appendChildren.transferWith = function(target) {
        element = target.element;
        _children = target._children;
        const data = target._event;
        Object.keys(_event).forEach(event => {

            const event_ref_match = data[event].listener === _event[event].listener;
            const event_not_undefined_match = data[event].listener;

            if (!event_ref_match || !event_not_undefined_match) {
                changeEvent();
                return;
            }

            const data_options = data[event].options;
            const event_options = _event[event].options;
            const options_type_match = typeof data_options == typeof event_options;

            if (options_type_match) switch (data_options) {
                case 'undefined': break;

                case 'boolean': {
                    if (data_options != event_options)
                        return changeEvent();
                    else break;
                }

                case 'object': {
                    if (data_options.once != event_options.once)        return changeEvent();
                    if (data_options.capture != event_options.capture)  return changeEvent();
                    if (data_options.passive != event_options.passive)  return changeEvent();
                    if (data_options.signal != event_options.signal)    return changeEvent();
                    break;
                }

                default: return changeEvent();
            }
            else if (data_options != event_options) // not case undefined, null
                return changeEvent();

            data[event].ignore = true;

            return;

            function changeEvent() {
                data[event].ignore = true;
                target.off(event);
                element.addEventListener(event, _event[event].listener, _event[event].options);
            }
        });
        Object.keys(data).forEach(event => {
            if (data[event].ignore) return;

            target.off(event);
        });
    }
    /** @type {boolean | undefined} tag 가 undefined, null 과 같은 값을 지닐 경우 false 를 출력 */
    appendChildren.isUsed = undefined;
    setIsUsed();
    /** @type {boolean} 완전히 제거시 자식 노드 밑 부분까지 false 로 전환 */
    appendChildren.isExist = true;
    /** @type {typeof appendChildren | undefined} 최상위 el 객체면 존재하지 않으며 주로 자식 el 객체에게서만 주어지는 부모의 appendChildren 객체 */
    appendChildren.parent = undefined;
    /** @type {number | undefined} 최상위 el 객체면 존재하지 않으며 주로 자식 el 객체에게서만 주어지는 부모 el 객체가 부여하는 children index */
    appendChildren.index = undefined;


    function reload() {

        reloadDynamicElement();
        reloadDynamicChildren();

        if (typeof _style == 'function') setStyle();
        setDynamicAttributes();
        setEvent(true);
    }

    function reloadDynamicElement() {
        if (_dynamicEl) {
            const tag_result = tag();
            if (tag_result) {
                replaceEl: if (tag_result !== element.tagName) {

                    if (tag_result instanceof HTMLElement) {
                        if (tag_result.isSameNode(element))
                            break replaceEl;
                        element.replaceWith(tag_result);
                        element = tag_result;
                    }
                    if (_xmlns) {
                        setXmlns(typeof _xmlns == 'function' ? _xmlns() : _xmlns);
                    }
                    else {
                        const newEl = setTag(tag_result);
                        element.replaceWith(document.createElement(tag_result));
                        element = newEl;
                    }
                    setAttributes();
                    reappend();
                }

                if (!appendChildren.isUsed) {
                    setIsUsed();
                    appendChildren.parent?.reappend && appendChildren.parent.reappend(appendChildren.index);
                }
            }
            // if tag_result is undefined, null and NaN
            else if (appendChildren.isUsed) {
                setIsUsed();
                element.remove();
            }
        }
        else if (typeof _xmlns == 'function') {
            setXmlns(_xmlns());
        }
    }

    function reloadDynamicChildren() {
        // todo: el 객체 내부 데이터 교체 진행 및 reappend 진행

        // 주의: isEqualNode 메소드를 이용해 비교를 하기 때문에 자식의 이벤트가 동일하지 않을 수 있음
        //       이 경우 원하는 결과가 나오지 않을 수 있음
        if (_dynamicChildren.length) {
            let use_reappend = -1;

            for (let i = _dynamicChildren.length - 1; i >= 0; i--) {
                const v = _dynamicChildren[i];

                const handle_old_children = Array.isArray(_children[v.index])
                    ? _children[v.index]
                    : [_children[v.index]];
                const old_data = reverseTraverse(handle_old_children);
                const forward_old_data = traverse(handle_old_children);

                _children[v.index] = executeElChild(v.generate, { get_data: true });

                const new_data = Array.isArray(_children[v.index])
                    ? reverseTraverse(_children[v.index])
                    : reverseTraverse([_children[v.index]]);

                let prev_el = undefined;

                const fragment = document.createDocumentFragment();

                for (const child of new_data) {
                    if (child?.isUsed) {
                        const old_child = old_data.next();

                        if (!old_child.done && old_child.value?.element?.isConnected) {
                            // if (child.transferWith && old_child.value.transferWith && child.element.isEqualNode(old_child.value.element)) {
                            //     child.transferWith(old_child.value);
                            //     old_child.value.clear(true);
                            // }
                            // else {
                                element.replaceChild(child.element, old_child.value.element);
                                if (old_child.value.clear) old_child.value.clear();
                            // }
                        }
                        else if (prev_el) {
                            element.insertBefore(child.element, prev_el);

                            if (!old_child.done && old_child.value?.element?.isConnected)
                                if (old_child.value.clear)
                                    old_child.value.clear();
                                else
                                    old_child.value.element.remove();
                        }
                        else {
                            fragment.prepend(child.element);
                            continue;
                        }

                        if (!prev_el) {
                            prev_el = child.element;
                            prev_el.nextSibling
                                ? element.insertBefore(fragment, prev_el.nextSibling)
                                : element.appendChild(fragment);
                        }
                        else prev_el = child.element;
                    }
                }

                if (!prev_el) use_reappend = v.index;

                let old_child_end_point = undefined;

                for (const child of old_data) {
                    if (child?.element?.isConnected) {
                        old_child_end_point = child.element;
                        break;
                    }
                }
                
                if (old_child_end_point) {
                    let bypass = false;
                    for (const child of forward_old_data) {
                        if (!child) continue;

                        if (bypass) {
                            if (child && child.clear) child.clear();
                            if (old_child_end_point === child.element) break;
                        }
                        else if (child?.element?.isConnected) {
                            if (old_child_end_point === child.element) {
                                if (child) 
                                    child.element.remove(),
                                    child.clear && child.clear();
                            }
                            else {
                                const range = document.createRange();
                                range.setStartBefore(child.element);
                                range.setEndAfter(old_child_end_point);
                                range.deleteContents();
    
                                child.clear && child.clear();
                            }
    
                            bypass = true;
                        }
                    }
                }

            }

            if (use_reappend > -1) reappend(use_reappend);
        }
    }

    function reappend(until) {
        let prev_el = undefined;

        (typeof until == 'number' ? _children.slice(until, _children.length) : _children).toReversed()
        .forEach(function findLastChild(child) {
            if (Array.isArray(child)) {
                child.toReversed().forEach(findLastChild);
                return;
            }

            if (child) {
                if (child.isUsed != child.element.isConnected) {
                    if (child.element.isConnected) {
                        child.element.remove();
                    }
                    else {
                        if (prev_el)
                            element.insertBefore(child.element, prev_el);
                        else 
                            element.appendChild(child.element);
                        prev_el = child.element;
                    }
                }
                else if (child.element.isConnected) {
                    if (child.element.nextSibling !== prev_el && prev_el)
                        element.insertBefore(child.element, prev_el);
                    prev_el = child.element;
                }
            }
        });
    }

    return appendChildren;

    function setIsUsed(value, target = appendChildren, configurable = true) {
        Object.defineProperty(target, 'isUsed', {
            configurable: configurable,
            writable: false,
            value: value ?? (_dynamicEl ? !!tag() : !!tag)
        });
    }

    function setChildIndex(target, index) {
        Object.defineProperty(target, 'index', {
            configurable: true,
            writable: false,
            value: index
        });
    }

    function setParent(child) {
        Object.defineProperty(child, 'parent', {
            get() {
                return appendChildren;
            },
            configurable: true
        });
    }

    function setRefFn() {
        if (!_refFn)
            _refFn = () => appendChildren;
    }

    function setTag(tag) {
        return document.createElement(tag);
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
            let newEl = undefined;
            if (namespace) {
                newEl = document.createElementNS(namespace, _dynamicEl ? tag() : tag);
            }
            else {
                newEl = document.createElement(_dynamicEl ? tag() : tag);
            }
            element.replaceWith(newEl);
            element = newEl;
            return true;
        }
        return false;
    }

    function setReference(ref) {
        if (ref) {
            setRefFn();

            Object.defineProperty(ref, 'element', {
                get() {
                    return element;   
                },
                configurable: true
            });

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
                    for (const key in _style) {
                        const new_style = style[key] ?? '';
                        if (_style[key] !== new_style) {
                            _style[key] = new_style;
                            element.style[key] = new_style;
                        }
                    }
                    for (const key in style) {
                        if (key in _style) {
                            console.log(key)
                            continue;
                        }

                        const new_style = style[key] ?? '';
                        _style[key] = new_style;
                        element.style[key] = new_style;
                    }
                    break;
                }
                
                case 'function': {
                    setStyle(style.call(element, init_style));
                    break;
                }
            }
            return true;
        }
        return false;
    }

    function setAttributes(init_check = false) {
        const attributes_keys = Object.keys(_attributes);

        if (init_check) {
            attributes_keys.forEach(key => {
                const value = _attributes[key];
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
            const value = _attributes[key];
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
                    const origin = ref();

                    if (origin?.isExist)
                        origin.reload();
                    else 
                        target.refs.delete(ref);
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
    obj.ref = () => {}

    return new Proxy(obj, {
        apply(target, _, args) {
            try {
                const origin = target.ref();
                if (!origin?.isExist) {
                    target.ref = () => {};
                    return undefined;
                }
                if (origin) return origin(...args);
                return undefined;
            } catch (e) {
                return undefined;
            }
        },

        get(target, prop) {
            const origin = target.ref();
            if (!origin?.isExist) {
                target.ref = () => {};
                return Reflect.get(target, prop);
            }
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

function* reverseTraverse(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const item = array[i];
        if (Array.isArray(item)) {
            yield* reverseTraverse(item);
        } else {
            yield item;
        }
    }
}

function unboxFunction(fn) {
    if (typeof fn == 'function') {
        return unboxFunction(fn());
    }
    return fn;
}





/**
 * Element Substitution Render (주의) 단일 요소에게만 사용해야합니다.
 * @param {InsertPosition | HTMLElement} where 
 * @param {HTMLElement | string} [element] 
 * @param {object} [options]
 * @param {boolean} [options.validate_class] className 검사 여부
 * @param {string[]} [options.ignore_class] className 검사시 무시할 className들
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

    if (early_exist_el && !early_exist_el.isEqualNode(element)) {
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
