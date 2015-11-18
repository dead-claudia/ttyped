# ttyped

A runtime type checking library for [LiveScript](https://livescript.net), JavaScript, and [CoffeeScript](https://coffeescript.org). It has two modes, closure-based and code gen, and it uses [type-check](https://npm.im/type-check) for the type syntax. It is also compatible with the [ES6 decorators proposal](https://github.com/wycats/javascript-decorators).

It was mostly designed with LiveScript in mind, but it is very useful in any compile-to-JS dynamic language, or even JavaScript itself.

## Installation

```
npm install --save ttyped
```

Node.js uses the code generation-based version by default, while the browser version uses a CSP-safe closure-based version by default. If you want to specifically use the closure-based version in Node.js, use `ttyped/csp`. If you want to specifically use the code-generation version in the browser through Browserify, Webpack, etc., use `ttyped/gen`.

## Example usage

```js
// JavaScript
import {type, Type} from "ttyped"

type.add("Greeter", "*", x => x instanceof Greeter)

class Greeter extends Type {
    @type("String")
    init(greeting) {
        this.greeting = greeting
    }

    greet() {
        return "Hello, " + this.greeting
    }

    @type("HTMLButtonElement")
    attachTo(button) {
        button.textContent = "Say Hello"
        button.onclick = () => {
            alert(type.as(doSomething(this), "Greeter").greet())
        }
    }
}

const greeter = new Greeter("world")

// Throws!
// const failedGreeter = new Greeter(Symbol("wut?"))

const button = document.createElement("button")

greeter.attachTo(button)

document.body.appendChild(button)
```

```coffee
# CoffeeScript
{type, Type} = require 'ttyped'

type.add 'Greeter', '*', (x) -> x instanceof Greeter

class Greeter extends Type
    init: type('String') (@greeting) ->

    greet: -> "Hello, #{@greeting}"

    attachTo: type('HTMLButtonElement') (button) ->
        button.textContent = 'Say Hello'
        button.onclick = ->
            alert type.as(doSomething(this), 'Greeter').greet()

greeter = new Greeter('world')

# Throws!
# var failedGreeter = new Greeter Symbol('wut?')

button = document.createElement('button')

greeter.attachTo(button)

document.body.appendChild(button)
```

```ls
# LiveScript
require! ttyped: {type: t}

t.add 'Greeter', '*', (instanceof Greeter)

class Greeter extends Type
    init: type 'String' <| (@greeting) !->

    greet: -> "Hello, #{@greeting}"

    attachTo: type 'HTMLButtonElement' <| (button) !->
        button.textContent = 'Say Hello'
        button.onclick = alert . (.greet!) . ->
            (doSomething @) `t.as` 'Greeter'

greeter = new Greeter 'world'

# Throws!
# var failedGreeter = new Greeter Symbol 'wut?'

button = document.createElement 'button'

greeter.attachTo button

document.body.appendChild button
```

## API

### Type declarations

```js
type = ttyped.type
```

Get a type namespace. Note that this is called by name, so two accesses do *not* return identical objects, even though they carry identical structure.

```js
// JavaScript
// Function wrapper
func = type(...types)((...args) => {
    // body
})

// Decorator
class C {
    @type(...types)
    method(...args) {
        // body
    }
}
```

```coffee
# CoffeeScript
# Function wrapper
func = type(types...) (args...) ->
    # body

# Decorator
class C
    method: type(types...) (args...) ->
        # body
```

```ls
# LiveScript
# Function wrapper
func = type ...types <| (...args) ->
    # body

# Decorator
class C
    method: type ...types <| (...args) ->
        # body
```

Create a type assertion and attach it to the function or method. It works as both a function wrapper and decorator. Note that it does not work with ES6
class constructors as values.

```js
type.add(type, existing, validate)
```

Add a new `type` to the namespace, based on an `existing` type and a `validate`
function to check it.

```js
type.as(value, type)
```

Get `value`, simultaneously asserting that it is of type `type`. This is useful
as both a void function and as an inline asssertion.

This is great infix in LiveScript, like so:

```ls
formatString value `type.as` 'String'
```

Also, the `type` function also has all the properties accessible from the module, and they point to the global equivalent.

```js
// Create a fresh new type namespace
ttyped.type
type.type

// Equivalent calls
ttyped.check(true)
type.check(true)

// These extend the exact same class
class extends ttyped.Type {}
class extends type.Type {}
```

### Enable/disable type checking

```js
ttyped.check(boolean)
```

Call with `true` to enable runtime checking, and `false` to disable it.

### Superclass for better type checking

```js
class ttyped.Type {}
```

An abstract class, mainly intended for ES6 classes, CoffeeScript and its
descendants, and similar, for patterns like below:

```coffee
# CoffeeScript example
{type, Type} = require 'ttyped'

class Class extends Type
    init: type("String", "Number") (name, count) ->
        @name = format(name)
        @counter = new Counter(count)
```

```js
// Same in ES6
import {type, Type} from 'ttyped'

class Class extends Type {
    @type("String", "Number")
    init(name, count) {
        this.name = format(name)
        this.counter = new Counter(count)
    }
}
```

```ls
# Same in LiveScript
require! ttyped: {type, Type}

class Class extends Type {
    init: type "String", "Number" <| (name, count) ->
        @name = format name
        @counter = new Counter count
```

## Issues

Use the [issue tracker](https://github.com/impinball/ttyped/issues). Pull requests are welcome, just make sure ESLint is happy and it stays well tested.

## License

ISC
