'use strict';

const {reactive, observe, observable} = require('xain');
const {html, SYM_COMPONENT} = require('./dsl');

const iState = observable({changes: 0}, true);
const onChange = observe.bind(null, iState);

function Component(...states) {
    return class {
        constructor(props={}, children=[]) {
            const reaction = this.constructor.reaction;
            this.props = (reaction ? 
                            reactive(Object.assign({}, reaction(...states), props, {children})) : 
                            Object.assign({}, props, {children}));
            this[SYM_COMPONENT] = true;
            this.render = this.render.bind(this);
            this.$ = this.$.bind(this);

            if (reaction) {
                observe(this.props, () => {
                    iState.changes++;
                });
            }
        }
        $() {
            let rendered = this.render();
            if (Array.isArray(rendered)) {
                html(this, ...rendered);
            }
        }
        get states() { return states }
        get state() { return states[0] }
        render() { throw new Error('Abstract render called') }
    }
}

module.exports = {Component, onChange};
