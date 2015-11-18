"use strict"

var typeCheck = require("type-check")
var hasOwn = Object.prototype.hasOwnProperty

// The types are cached within the module initialization to limit the overhead
// of calling the types. Performance would slow down otherwise.
exports.TypeChecker = TypeChecker
function TypeChecker() {
    this.cache = {}
    this.types = {customTypes: {}}
}

TypeChecker.prototype.reallyAdd = function (type) {
    type = type.replace(/^\s+|\s+$/g, "")

    if (!hasOwn.call(this.cache, type)) {
        this.cache[type] = typeCheck.parseType(type)
    }

    return type
}

TypeChecker.prototype.add = function (type, label) {
    if (typeof type !== "string") {
        if (typeof label === "number") {
            throw new TypeError("Argument " + label + " must be a string")
        } else {
            throw new TypeError(label + " must be a string")
        }
    }

    return this.reallyAdd(type)
}

function getType(arg) {
    return arg != null ? arg.constructor.name : arg
}

function check(type, parsed, value, types) {
    if (!typeCheck.parsedTypeCheck(parsed, value, types)) {
        throw new TypeError("Expected type " + type + ", found type " +
            getType(value))
    }
}

TypeChecker.prototype.check = function (type, value) {
    return check(type, this.cache[type], value, this.types)
}

TypeChecker.prototype.checkCached = function (type, value) {
    if (typeof type !== "string") {
        throw new TypeError("Type must be a string")
    }

    type = type.replace(/^\s+|\s+$/g, "")

    var cached

    if (!hasOwn.call(this.cache, type)) {
        cached = this.cache[type] = typeCheck.parseType(type)
    } else {
        cached = this.cache[type]
    }

    return check(type, cached, value, this.types)
}

var sentinel = new TypeError()

function copyProp(dest, src, prop) {
    Object.defineProperty(dest, prop,
        Object.getOwnPropertyDescriptor(src, prop))

    // In case this silently fails.
    if (dest[prop] !== src[prop]) {
        throw sentinel
    }
}

var hasEval = (function () {
    try {
        return !eval("0") // eslint-disable-line no-eval
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

function trySetProps(target, func) {
    try {
        copyProp(target, func, "length")
        copyProp(target, func, "name")
        return target
    } catch (e) {
        if (!(e instanceof TypeError)) {
            throw e
        }

        if (hasEval) {
            // Fake the function length via code generation.
            /* eslint-disable no-new-func */
            return new Function("f",
                "return function " + func.name + "(" + makeArgs(func.length) +
                "){return f.apply(this, arguments)}")(target)
            /* eslint-enable no-new-func */
        }

        // ignore if it's not ES6 and CSP is enabled - there's no hope
    }
}

exports.alias = function (target, func) {
    if (typeof func !== "function") {
        throw new TypeError("Expected a function argument")
    }

    return trySetProps(target, func)
}

exports.escape = function (string) {
    return string.replace(/(['\\])/g, "\\$1")
}

function get(target, prop, impl) {
    Object.defineProperty(target, prop, {
        enumerable: true,
        configurable: true,
        get: impl,
    })
}

exports.makeChecker = function (exports, cache, type) {
    type.add = function (type, typeOf, validate) {
        if (typeof type !== "string") {
            throw new TypeError("type must be a string")
        }

        if (typeof typeOf !== "string") {
            throw new TypeError("typeOf must be a string")
        }

        if (typeof validate !== "function") {
            throw new TypeError("validate must be a function")
        }

        cache.types.customTypes[type] = {
            typeOf: typeOf,
            validate: validate,
        }
        return type
    }

    type.as = function (value, type) {
        cache.checkCached(type, value)
        return value
    }

    mixinExports(exports, type)

    return type
}

function makeRelease() {
    // When types are not checked, this is used. Functions are constructed
    // beforehand to avoid slow closure allocations at runtime.
    function decorator(func) {
        if (arguments.length !== 3 || typeof desc !== "object") {
            return func
        }
    }

    function type() {
        return decorator
    }

    /* eslint-disable no-unused-vars */
    type.add = function (type, typeOf, validate) {
        return type
    }

    type.as = function (value, type) {
        return value
    }
    /* eslint-enable no-unused-vars */

    return function () {
        return type
    }
}

function mixinExports(exports, type) {
    get(type, "type", function () {
        return exports.type
    })

    type.check = exports.check
    type.Type = exports.Type
}

// When the types are checked, `debug` is called to initialize the checker.
exports.makeExports = function (exports, debug) {
    var release = makeRelease()
    var exported = debug

    get(exports, "type", function () {
        return exported()
    })

    exports.check = function (check) {
        exported = check ? debug : release
    }

    exports.Type = function Type() {
        this.init.apply(this, arguments)
    }

    // `release` returns the same reference each time
    mixinExports(exports, release())
}
