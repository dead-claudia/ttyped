"use strict"

var decorators = require("./decorators.js")

exports.is = decorators.is

function dummyAs(value, type) { // eslint-disable-line no-unused-vars
    return value
}

// When types are not checked, this is used. Functions are constructed
// beforehand to avoid slow closure allocations at runtime.
function decorator(func, _, desc) {
    if (arguments.length !== 3 || typeof desc !== "object") {
        return func
    }
}

function release() {
    return decorator
}

exports.check = check
check()
function check(check) {
    if (check) {
        exports.Param =
        exports.Params =
        exports.Args =
        exports.Arguments = decorators.Param

        exports.This =
        exports.Ctx =
        exports.Context = decorators.This

        exports.Return =
        exports.Returns = decorators.Return

        exports.as = decorators.assert
    } else {
        exports.Param =
        exports.Params =
        exports.Args =
        exports.Arguments =
        exports.This =
        exports.Ctx =
        exports.Context =
        exports.Return =
        exports.Returns = release

        exports.as = dummyAs
    }
}

exports.Type = function Type() {
    this.init.apply(this, arguments)
}
