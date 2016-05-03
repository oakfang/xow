# xow
A [xain](https://github.com/oakfang/xain)-based view engine for the browser

**Note:** the usage of `xow` in the browser is *critically* dependent on the following ES2015 features:

- Proxies
- Symbols
- `const` / `let`
- Everything else required by `xain`

*tl;dr* - use only on latest chrome versions :smile:


## Usage

*(This example puts everything in 1 file, don't do that)*

*(A more comprehensive [example](https://github.com/oakfang/xow/blob/master/examples/todo.js) exists in the examples dir :smile: )*

```js
// app.js

'use strict';

const {Component, renderTo} = require('xow');
const {observable, link, pipe} = require('xain');

const state = observable({
    firstName: 'Foo',
    lastName: 'Bar',
    age: 5
});

class Button extends Component(state) {
    render() {
        return ['button', {onclick() {state.age += 1}}, [
            'Grow up!'
        ]];
    }
}

class Foo extends Component(state) {
    static reaction(state) {
        return {
            name: link(state, ({firstName, lastName}) => firstName + ' ' + lastName),
            age: pipe(state, 'age')
        }
    }
    render() {
        const {name, age} = this.props;
        return ['div', {}, [
            `${name} - ${age}`
        ]];
    }
}

class NameLabel extends Component(state) {
    static reaction(state) {
        return {
            firstName: pipe(state, 'firstName'),
            lastName: pipe(state, 'lastName')
        }
    }
    render() {
        const {firstName, lastName} = this.props;
        return ['div', {}, [
            ['input', {value: firstName, oninput(e) {state.firstName = e.target.value}}],
            ['input', {value: lastName, oninput(e) {state.lastName = e.target.value}}]
        ]];
    }
}

class Main extends Component() {
    render() {
        const { foo, btn, label } = this.props;
        return ['div', {}, [
            ['h1', {}, [
                'Welcome!'
            ]],
            label.$,
            foo.$,
            btn.$
        ]];
    }
}

renderTo(document.getElementById('container'), new Main({
    foo: new Foo,
    btn: new Button,
    label: new NameLabel
}));
```