'use strict';

const {Component, fullTreeChange, ComplexComponent} = require('./component');
const {getDynamicRoot, dom} = require('./dom');

function renderTo(htmlElement, component) {
    setTimeout(() => getDynamicRoot(htmlElement,
                                    component,
                                    fullTreeChange(component)), 0);
}

module.exports = {
    Component,
    ComplexComponent,
    renderTo,
    dom,
};