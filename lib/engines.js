"use strict"

var inherits = require("./util.js").inherits
var getType = require("./type.js")

function UnitEngine(arg) {
    this.arg = arg
}

function verifyType(expected, found, name) {
    if (!expected.test(found)) {
        throw new TypeError("Expected " + name + " to be of type " +
            expected.type + " but found type " + getType(found))
    }

    return found
}

UnitEngine.prototype.verify = function (found) {
    return verifyType(this.arg, found, this.name)
}

exports.ParamsEngine = ParamsEngine
function ParamsEngine(args) {
    this.args = args
}

ParamsEngine.prototype.verify = function () {
    var args = this.args
    for (var i = 0; i < args.length; i++) {
        verifyType(args[i], arguments[i], "argument " + i)
    }
}

function factory(name) {
    function Engine(arg) {
        UnitEngine.call(this, arg)
    }

    inherits(Engine, UnitEngine)
    Engine.prototype.name = name

    return Engine
}

exports.ThisEngine = factory("`this`")
exports.ReturnEngine = factory("return value")
exports.AssertEngine = factory("value")

exports.CheckEngine = CheckEngine
function CheckEngine(arg) {
    this.arg = arg
}

CheckEngine.prototype.verify = function (found) {
    return this.arg.test(found)
}
