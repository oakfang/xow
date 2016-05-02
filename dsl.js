'use strict';

const {elementOpen, elementClose, elementVoid, text} = require('incremental-dom');

function propsToPairs(props) {
    return Object.keys(props).reduce((pairs, prop) => {
        pairs.push(prop);
        pairs.push(props[prop]);
        return pairs;
    }, []);
}

function html(tag, props={}, children=null) {
    let key = null;
    if ('key' in props) {
        key = props.key;
        delete props.key;
    }
    if (!children) {
        elementVoid(tag, key, null, ...propsToPairs(props));
    } else {
        if (typeof children === 'string') {
            children = [children];
        }
        elementOpen(tag, key, null, ...propsToPairs(props));
        children.filter(child => child).forEach(child => {
            if (Array.isArray(child)) {
                html(...child);
            } else if (typeof child === 'function') {
                let rendered = child();
                if (Array.isArray(rendered)) html(...rendered);
            } else {
                text(child);
            }
        });
        elementClose(tag);
    }
}

function html$(tag, props={}, children=null) {
    return () => html(tag, props, children);
}


module.exports = {html, html$};