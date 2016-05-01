'use strict';

const {elementOpen, elementClose, elementVoid, text} = require('incremental-dom');

function propsToPairs(props) {
    return Object.keys(props).reduce((pairs, prop) => {
        pairs.push(prop);
        pairs.push(props[prop]);
        return pairs;
    }, []);
}

function element(tag, props={}, children=null) {
    let key = null;
    if ('key' in props) {
        key = props.key;
        delete props.key;
    }
    if (!children) {
        elementVoid(tag, key, null, ...propsToPairs(props));
    } else {
        elementOpen(tag, key, null, ...propsToPairs(props));
        children.forEach(child => {
            typeof child === 'function' ? child() : text(child);
        });
        elementClose(tag);
    }
}


module.exports = element;