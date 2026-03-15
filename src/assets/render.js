/**
 * 간편 요소 생성 및 자식 추가 함수
 * @param {string | HTMLElement} tag 생성할 태그
 * @param {Object} attributes 특성
 * @returns 
 */
function el(tag = 'div', attributes = {}) {
    let _xmlns = undefined;
    let _style = {};
    let _custom = false;

    let element = tag instanceof HTMLElement ? tag : document.createElement(tag);

    if (attributes.xmlns) {
        setXmlns(attributes.xmlns);
        delete attributes.xmlns;
    }

    if (attributes.style && typeof attributes.style == 'object') {
        setStyle(attributes.style);
        _style = {};
        Object.assign(_style, attributes.style);
        delete attributes.style;
    }

    if (attributes.custom) {
        _custom = true;
        delete attributes.custom;
    }

    setAttribute();

    /**
     * @param  {...HTMLElement | string} children 
     */
    function appendChildren(...children) {
        children.forEach(child => {
            if (typeof child === 'function' && child?.element) {
                child._setup({ xmlns: _xmlns });
                element.appendChild(child.element);
            }
            else if (typeof child == 'string') {
                element.insertAdjacentHTML('beforeend', child);
            }
            else if (Array.isArray(child)) {
                appendChildren(...child);
            }
            else if (child) {
                element.appendChild(child);
            }
        });

        return appendChildren;
    }

    appendChildren.element = element;
    /**
     * @param {InsertPosition | Element} where_or_target 
     * @param {Element} target 
     */
    appendChildren.render = function(where_or_target = document.body, target = undefined, { validate_class = true, ignore_class = [] } = {}) {
        /* if (where_or_target instanceof Element) {
            where_or_target.appendChild(element);
        }
        else {
            try {
                target.insertAdjacentElement(where_or_target, element);
            } catch (error) {
                console.error(error);
            }
        } */

        element.esrender(where_or_target, target, { validate_class, ignore_class });

        return appendChildren;
    }
    appendChildren._setup = function({ xmlns } = {}) {
        if (xmlns != _xmlns && typeof tag == 'string') {
            setXmlns(xmlns);
            setStyle();
            setAttribute(true);
        }
    }

    return appendChildren;

    function setXmlns(xmlns = _xmlns) {
        switch (xmlns) {
            case 'MathML':
                element = document.createElementNS('http://www.w3.org/1998/Math/MathML', tag);
                break;

            case 'HTML':
                element = document.createElementNS('http://www.w3.org/1999/xhtml', tag);
                break;

            case 'SVG':
            default:
                element = document.createElementNS('http://www.w3.org/2000/svg', tag);
                break;
        }
        _xmlns = xmlns;
        if (appendChildren) appendChildren.element = element;
    }

    function setStyle(style = _style) {
        Object.assign(element.style, style);
    }

    function setAttribute(assign = _xmlns || _custom) {
        if (assign) {
            Object.assign(element, attributes);
        }
        else {
            if (_xmlns) {
                Object.keys(attributes).forEach(key => {
                    element.setAttributeNS(key, attributes[key]);
                });
                return;
            }

            Object.keys(attributes).forEach(key => {
                element.setAttribute(key, attributes[key]);
            });
        }
    }
}





/**
 * Element Substitution Render (주의) 단일 요소에게만 사용해야합니다.
 * @param {InsertPosition | HTMLElement} where 
 * @param {HTMLElement | string} [element] 
 * @param {object} [options]
 * @param {boolean} [options.validate_class]
 * @param {string[]} [options.exclude_class]
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