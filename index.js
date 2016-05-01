'use strict';

const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const createElement = require("virtual-dom/create-element");
const h = require("virtual-dom/h");

const Component = require('./component');

module.exports = {
    Component,
    h,
    renderTo(htmlElement, component) {
        let el = createElement(component.asElement);
        component.constructor.$emitter.on('render', () => {
            const tree = component.asElement;
            const newTree = component.render();
            const patches = diff(tree, newTree);
            el = patch(el, patches);
        });
        htmlElement.appendChild(el);
    }
};