"use strict"

var hasOwn = Object.prototype.hasOwnProperty

var toString = Object.prototype.toString

exports.hasOwn = function (object, prop) {
    return hasOwn.call(object, prop)
}

exports.escape = function (string) {
    return string.replace(/(["\\])/g, "\\$1")
}

exports.toString = function (object) {
    return toString.call(object)
}

// Don't pull in Node's util.inherits
exports.inherits = function (Sub, Sup) {
    Sub.prototype = Object.create(Sup.prototype, {
        constructor: {
            configurable: true,
            enumerable: false,
            writable: true,
            value: Sub,
        },
    })
}
