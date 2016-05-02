'use strict';

const {patch} = require('incremental-dom');

const Component = require('./component');
const {html, html$} = require('./dsl');

function renderTo(htmlElement, component) {
    patch(htmlElement, component.$);
    component.constructor.$emitter.on('render', () => {
        patch(htmlElement, component.$);
    });
}

module.exports = {
    Component,
    renderTo,
    html,
    html$
};