# xow
A [xain](https://github.com/oakfang/xain)-based view engine for the browser

**Note:** the usage of `xow` in the browser is *critically* dependent on the following ES2015 features:

- Proxies
- Symbols
- `const` / `let`
- Everything else required by `xain`

*tl;dr* - use only on latest chrome versions!

## Example code
You can tour a JSX example usage of `xow` right [here.](https://github.com/oakfang/xow-todo)

## The cogs of the machine

```js
const { Component, renderTo, dom, ComplexComponent } = require('xow');
```

Okay, let's start of by splitting these cogs into 2 groups:

### Core

#### `Component`
Possibly the most important function here.
`xow` revolves around using components sharing a single `observable` (as in `xain` `observable`) state.
`Component` is a function (not a class! not a class!) that accepts a single `observable` state,
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

const {dom} = require('xow');
const App = require('./base');

/*
The Main constructor accepts `props` (a plain object) that constains the key `children` (an array).
It can be neglected for a default value of `{}`.
*/
module.exports = class Main extends App {
    /*
    This is the *view spec* of the component.
    A xain view of the App's state is created with this static spec, to create an observable reduction
    of the main state, specifying to which state changes this component should react to.
    This view's properties are combined into the `this.props` property.
    */
    static view() {
        return {
            age: 'age',
            name({firstName, lastName}) {
                return `${firstName} ${lastName}`;
            }
        }
    }
    /*
    You know this one. This one is like react's one, basically.
    */
    render() {
        const {age, name, children} = this.props;
        return dom('h1', {style: {color: 'red'}}, [`${name}: ${age}`,
            ...children
        ]);
    }
}
```

### Stateless Components
Not all components need acccess to the state or need to know whenever they should update. Some are simply a modular way to handle common usage of HTML nodes. Just like react, you can export an arrow function that gets its props as its single parameter, and returns the dom tree:

```js
const {dom} = require('xow');

module.exports = ({text}) => (
    <div>
        <p>{text}!</p>
    </div>
);
```

#### `renderTo`
Finally, we want to mount our app to the `document`, so let's just:

```js
// app.js

const {renderTo, dom} = require('xow');
const Main = require('./components/main');

renderTo(document.getElementById('container'), dom(Main, {}, [
    dom('p', {}, 'Hello, world!')
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

Here's `main.js` above, JSX style:

```jsx
// components/main.js

const App = require('./base');
const {pipe, link} = require('xain');
const {dom, children} = require('xow');

module.exports = class Main extends App {
    static view() {
        return {
            age: 'age',
            name({firstName, lastName}) {
                return `${firstName} ${lastName}`;
            }
        }
    }
    render() {
        const {age, name} = this.props;
        return (
            <h1 style={{color: 'red'}}>
                {name}: {age}
                {...this.props.children}
            </h1>
        );
    }
}
```

### Complex Components
When creating a compnent with props which should be derived from 2 or more state trees,
you can use `ComplexComponent`, which is a lot like the `Component` class factory, only it accets `...states`
instead of `state` as a parameter, its `view` function is called `reaction`,
it is passed the same `...states` passed to the factory, in the same order,
and it returns the spec for a xain `reactive` object, using the regular `pipe` and `link` values.