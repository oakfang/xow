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
        return xow.h('button', {'ev-click': () => {state.age += 1}}, [
            'Grow up!'
        ]);
    }
}

class Foo extends Component(state) {
    static reaction(state) {
        return {
            name: xain.link(state, ({firstName, lastName}) => firstName + ' ' + lastName),
            age: xain.pipe(state, 'age')
        }
    }
    render() {
        const {name, age} = this.props;
        return xow.h('div', {}, [
            `${name} - ${age}`
        ]);
    }
}

const foo = new Foo;
const btn = new Button;

class Main extends Component() {
    render() {
        return xow.h('div', {}, [
            foo.asElement,
            btn.asElement
        ]);
    }
}


xow.renderTo(document.getElementById('container'), new Main);
```