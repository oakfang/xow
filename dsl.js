'use strict';

const {elementOpen, elementClose, elementVoid, text} = require('incremental-dom');

const SYM_CHILD = Symbol('@@children-list');
const SYM_COMPONENT = Symbol('@@component');

const YES = Symbol('@@yes');
const NO = Symbol('@@no');

function propsToPairs(context, props) {
    return Object.keys(props).reduce((pairs, prop) => {
        let value = props[prop];
        if (value === NO) {
            return pairs;
        }
        pairs.push(prop);
        if (typeof value === 'function') {
            value = value.bind(context);
        } else if (value === YES) {
            value = prop;
        }
        pairs.push(value);
        return pairs;
    }, []);
}

function handleChild(context) {
    return child => {
        if (Array.isArray(child)) {
            html(context, ...child);
        } else if (child[SYM_COMPONENT]) {
            child.$();
        } else if (typeof child === 'object' && SYM_CHILD in child) {
            child[SYM_CHILD].filter(child => child != null).forEach(handleChild(context))
        } else {
            text(child);
        }
    }
}

function html(context, tag, props={}, children=[]) {
    let key = null;
    if ('key' in props) {
        key = props.key;
        delete props.key;
    }
    if (typeof children === 'string') {
        children = [children];
    }
    if (typeof tag === 'string') {
        elementOpen(tag, key, null, ...propsToPairs(context, props));
        children.filter(child => child != null).forEach(handleChild(context));
        elementClose(tag);
    } else {
        const component = new tag(props, children.reduce((subs, sub) => {
            if (typeof sub === 'object' && SYM_CHILD in sub) {
                sub[SYM_CHILD].forEach(c => subs.push(c));
            } else {
                subs.push(sub)
            }
            return subs;
        }, []));
        if (context) component.$();
        return component;
    }
}

function children(elements) {
    return {[SYM_CHILD]: elements};
}


module.exports = {html, YES, NO, children, SYM_COMPONENT};