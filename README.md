# xow
A [xain](https://github.com/oakfang/xain)-based view engine for the browser

**Note:** the usage of `xow` in the browser is *critically* dependent on the following ES2015 features:

- Proxies
- Symbols
- `const` / `let`
- Everything else required by `xain`

*tl;dr* - use only on latest chrome versions :smile:

## Example code
You can tour a JSX example usage of `xow` right [here.](https://github.com/oakfang/xow-todo)

## The cogs of the machine

```js
const { Component, renderTo, dom, YES, NO, children } = require('xow');
```

Okay, let's start of by splitting these cogs into 2 groups:

- **core** (Component, renderTo, YES, NO): you'll find yourself using all of these on every `xow` project
- **JSX enablers** (dom, renderTo): you don't *need* these, but if you like JSX - you're gonna at least write these words

### Core

#### `Component`
Possibly the most important function here.
`xow` revolves around using components sharing a single `observable` (as in `xain` `observable`) state.
`Component` is a function (not a class! not a class!) that accepts a variable amount of `observable` states (as in ...states),
and returns the base class your actual components should inherit from.
So, first step to creating a new app would be creating the following module:

```js
// components/base.js

const {Component} = require('xow');
const {observable} = require('xain');

const state = observable({
    firstName: 'Foo',
    lastName: 'Bar',
    age: 23
});

const App = Component(state);

module.exports = App;
```

Awesome! You have a base `App` class now :smile:
Now, lets write our first component up:

```js
// components/main.js

const App = require('./base');
const {pipe, link} = require('xain');

/*
The Main constructor accepts `props` (a plain object) and `children` (an array)
to be assigned into `props`. Both can be neglected for a default value of `{}` and `[]`, respectively.
*/
module.exports = class Main extends App {
    /*
    This is the *reactive element* of the component.
    The `state` param is actually the same parameter(s) passed to the base `Component` constructor.
    Basically, if your component should react to state changes, this is where you should declare
    how the properties of your component should be derived from the shared state(s), and therefore,
    when to react to state changes.
    This properties are combined into the `this.props` property.
    */
    static reaction(state) {
        return {
            age: pipe(state, 'age'),
            name: link(state, ({firstName, lastName}) => `${firstName} ${lastName}`)
        }
    }
    /*
    You know this one. This one is like react's one, basically.
    */
    render() {
        const {age, name, children} = this.props;
        // `render` should return a recursive array that consists of three elements:
        // 0 - tagname
        // 1 - attributes (optional)
        // 2 - array of children (optional), where each child has to be either: the same format of array, a component or a string.
        return ['h1', {style: {color: 'red'}}, [`${name}: ${age}`,
            ...children
        ]];
    }
}
```

#### `YES`/`NO`
This one's easy. When you have, let's say, a `button` element that should sometimes be disabled, you'd think you can just:

`return ['button', {disabled: condition}, ['Meow']];`

However, `xow` *always* assigns the value given to the attribute to it, and most browsers will treat certain attributes (e.g. `disabled` and `checked`) as true as long as they exist, meaning `disabled: false` will still be disabled on a browser.

To fix that, `xow` exposes `YES` and `NO`, special values for these special attributes. Use them as if they were equivalent to booleans:

`return ['button', {disabled: condition ? YES : NO}, ['Meow']];`

#### `renderTo`
Finally, we want to mount our app to the `document`, so let's just:

```js
// app.js

const {renderTo} = require('xow');
const Main = require('./components/main');

renderTo(document.getElementById('container'), new Main({}, [
    ['p', {}, 'Hello, world!']
]));
```

And TADA! You have a running `xow` app. For actual reactive features please take a look at the link above.


### JSX-enablers

To enable JSX, you're gonna need `babel` and its `babel-plugin-transform-react-jsx`.
Use the following `.babelrc` snippet:

```
plugins: [
    ["transform-react-jsx", {
      "pragma": "dom"
    }]
]
```

### `dom` and `children`
Once you decided to use JSX, make sure every module has this function at least at module scope, otherwise things break.
It's also important to note that, currently, using components as tags is not supported, and when using sub-components you should simply escape the JSX as you would have with any other variable.

If your components uses the `children` prop, you should escape it using the `children` function.

Here's `main.js` above, JSX style:

```jsx
// components/main.js

const App = require('./base');
const {pipe, link} = require('xain');
const {dom, children} = require('xow');

module.exports = class Main extends App {
    static reaction(state) {
        return {
            age: pipe(state, 'age'),
            name: link(state, ({firstName, lastName}) => `${firstName} ${lastName}`)
        }
    }
    render() {
        const {age, name} = this.props;
        return (
            <h1 style={{color: 'red'}}>
                {name}: {age}
                {children(this.props.children)}
            </h1>
        );
    }
}
```