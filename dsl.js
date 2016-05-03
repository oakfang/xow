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
            value = prop;
        }
        pairs.push(value);
        return pairs;
    }, []);
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
    elementOpen(tag, key, null, ...propsToPairs(context, props));
    children.filter(child => child != null).forEach(child => {
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


module.exports = {html, YES, NO};