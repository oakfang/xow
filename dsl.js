'use strict';

const {elementOpen, elementClose, elementVoid, text} = require('incremental-dom');

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
            value = true;
        }
        pairs.push(value);
        return pairs;
    }, []);
}

function html(context, tag, props={}, children=null) {
    let key = null;
    if ('key' in props) {
        key = props.key;
        delete props.key;
    }
    if (!children) {
        elementVoid(tag, key, null, ...propsToPairs(context, props));
    } else {
        if (typeof children === 'string') {
            children = [children];
        }
        elementOpen(tag, key, null, ...propsToPairs(context, props));
        children.filter(child => child).forEach(child => {
            if (Array.isArray(child)) {
                html(context, ...child);
            } else if (typeof child === 'function') {
                child();
            } else {
                text(child);
            }
        });
        elementClose(tag);
    }
}

function html$(context, tag, props={}, children=null) {
    return () => html(context, tag, props, children);
}


module.exports = {html, html$, YES, NO};