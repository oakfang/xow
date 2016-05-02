'use strict';

const EventEmitter = require('events');
const {reactive, observe} = require('xain');
const {html} = require('./dsl');

const reRender = new EventEmitter();

module.exports = function Component(...states) {
    return class {
        static get $emitter() { return reRender }
        static get $states() { return states }
        constructor(props={}) {
            const reaction = this.constructor.reaction;
            this.props = reaction ? reactive(Object.assign({}, reaction(...states), props)) : Object.assign({}, props);
            this.render = this.render.bind(this);

            if (reaction) {
                observe(this.props, () => {
                    reRender.emit('render');
                });
            }
        }
        get $() {
            return () => {
                let rendered = this.render();
                if (Array.isArray(rendered)) {
                    html(...rendered);
                }
            };
        }
        render() { throw new Error('Abstract render called') }
    }
};