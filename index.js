'use strict';

const {patch} = require('incremental-dom');

const {Component, onChange} = require('./component');
const {YES, NO, children, html} = require('./dsl');
const dom = require('./jsx');

function renderTo(htmlElement, component) {
    if (Array.isArray(component)) {
        component = html(null, ...component);
    }
    patch(htmlElement, component.$);
    onChange(() => patch(htmlElement, component.$));
}

module.exports = {
    Component,
    renderTo,
    dom,
    YES,
    NO,
    children
};