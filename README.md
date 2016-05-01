# xow
A xain-based view engine for the browser

**Note:** the usage of `xow` in the browser is *critically* dependent on the following ES2015 features:

- Proxies
- Symbols
- `const` / `let`
- Everything else required by `xain`

*tl;dr* - use only on latest chrome versions :smile:


## Usage

*(This example puts everything in 1 file, don't do that)*

```js
// app.js

'use strict';

const xow = require('xow');
const xain = require('xain');

const state = xain.observable({
    firstName: 'Foo',
    lastName: 'Bar',
    age: 5
});

class Button extends xow.Component(state) {
    render() {
        return xow.element('button', {onclick() {state.age += 1}}, [
            'Grow up!'
        ]);
    }
}

class Foo extends xow.Component(state) {
    static reaction(state) {
        return {
            name: xain.link(state, ({firstName, lastName}) => firstName + ' ' + lastName),
            age: xain.pipe(state, 'age')
        }
    }
    render() {
        const {name, age} = this.props;
        return xow.element('div', {}, [
            `${name} - ${age}`
        ]);
    }
}

class Main extends xow.Component() {
    render() {
        const { foo, btn } = this.props;
        return xow.element('div', {}, [
            foo.$,
            btn.$
        ]);
    }
}

xow.renderTo(document.getElementById('container'), new Main({
    foo: new Foo,
    btn: new Button
}));
```