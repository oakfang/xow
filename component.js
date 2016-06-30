'use strict';

const {reactive, observe, observable, stream, viewOf} = require('xain');

const iState = observable({changes: 0}, true);

const fullTreeChange = rootComponent =>
    observe.bind(null, stream(iState).map(rootComponent.xRender));

function ComplexComponent(...states) {
    return class {
        constructor(props={}) {
            const reaction = new.target.reaction;
            this.props = (reaction ? 
                            reactive(Object.assign({}, reaction(...states), props)) : 
                            props);

            if (reaction) {
                observe(this.props, () => iState.changes++);
            }
        }
        get states() { return states }
        get state() { return states[0] }
        render() { throw new Error('Abstract render called') }
    }
}

function Component(state) {
    return class {
        constructor(props={}) {
            const viewSpec = new.target.view;
            this.props = props;
            if (viewSpec) {
                const view = viewOf(state, viewSpec());
                this.props = Object.assign({}, this.props, view);
                observe(view, () => iState.changes++);
            }
        }
        get state() { return state }
        render() { throw new Error('Abstract render called') }
    };
}

module.exports = {Component, fullTreeChange, ComplexComponent};
