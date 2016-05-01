'use strict';

const EventEmitter = require('events');
const {reactive, observe} = require('xain');
const Delegator = require('dom-delegator');

const reRender = new EventEmitter();
const d = Delegator();

module.exports = function Component(...states) {
    return class {
        static get $emitter() { return reRender }
        static get $states() { return states }
        constructor(props={}) {
            const reaction = this.constructor.reaction;
            this.props = reaction ? reactive(Object.assign({}, reaction(...states), props)) : Object.assign({}, props);
            this.$$el = this.render();

            if (reaction) {
                observe(this.props, () => {
                    this.$$el = this.render();
                    reRender.emit('render');
                });
            }
        }
        get asElement() {
            return this.$$el;
        }
        render() {
            return '';
        }
    }
};