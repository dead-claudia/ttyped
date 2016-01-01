"use strict"

var getName = require("./name.js")

function copyProp(dest, src, prop) {
    Object.defineProperty(dest, prop,
        Object.getOwnPropertyDescriptor(src, prop))
}

var canSetProps = (function f() {
    try {
        Object.defineProperties(f, {
            length: {value: 1},
            name: {value: "foo"},
        })
        // Check if they're silently ignored
        return f.length === 1 && f.name === "foo"
    } catch (e) {
        return false
    }
})()

var canEval = (function () {
    try {
        return new Function("return!0") // eslint-disable-line no-new-func
    } catch (e) {
        return false
    }
})()

function makeArgs(len) {
    for (var res = ""; len !== 0; len--) {
        res += ",x" + len
    }
    return res.slice(1)
}

function setProps(target, func) {
    copyProp(target, func, "length")
    copyProp(target, func, "name")
    return target
}

function makeFunc(target, func) {
    // Fake the function length via code generation. It's a common non-standard
    // extension to have either `name` or `displayName` for functions.
    return new Function("f", // eslint-disable-line no-new-func
        "return function " + getName(func) + "(" + makeArgs(func.length) +
        "){return f.apply(this, arguments)}")(target)
}

function bail(target) {
    // ignore if it's not ES6 and CSP is enabled - there's no hope here
    return target
}

var trySetProps

if (canSetProps) {
    trySetProps = setProps
} else if (canEval) {
    trySetProps = makeFunc
} else {
    trySetProps = bail
}

module.exports = function (target, func) {
    if (typeof func !== "function") {
        throw new TypeError("Expected a function argument")
    }

    return trySetProps(target, func)
}
