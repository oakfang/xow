'use strict';

module.exports = function dom(tag, props, ...children) {
    return [tag,
            props || {},
            children];
}