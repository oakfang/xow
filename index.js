'use strict';

const {patch} = require('incremental-dom');

const Component = require('./component');
const {YES, NO, children} = require('./dsl');
const dom = require('./jsx');

function renderTo(htmlElement, component) {
    patch(htmlElement, component.$);
    component.constructor.$emitter.on('render', () => {
        patch(htmlElement, component.$);
    });
}

module.exports = {
    Component,
    renderTo,
    dom,
    YES,
    NO,
    children
};