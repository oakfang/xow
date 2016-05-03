'use strict';

module.exports = function dom(tag, props, ...children) {
    return [tag,
            props || {},
            Array.isArray(children[0]) && children.length === 1 ? children[0] : children];
}