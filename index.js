'use strict';

const {patch} = require('incremental-dom');

const {Component, onChange} = require('./component');
const {YES, NO, children} = require('./dsl');
const dom = require('./jsx');

function renderTo(htmlElement, component) {
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