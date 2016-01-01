"use strict"

var alias = require("./alias.js")
var weak = require("./cache.js").weak
var engines = require("./engines.js")
var parse = require("./types.js").parse

function transform(check, engine, f) {
    return alias(check(f, engine), f)
}

function makeDecorator(engine, check) {
    return function (desc) {
        if (arguments.length !== 3 || typeof desc !== "object") {
            return transform(check, engine, desc)
        } else {
            desc = arguments[2]
            desc.value = transform(check, engine, desc.values)
        }
    }
}

function verifyParams(f, engine) {
    return function () {
        engine.verify(engine, arguments)
        return f.apply(this, arguments) // eslint-disable-line no-invalid-this
    }
}

exports.Param = Param
function Param() {
    var args = []
    for (var i = 0; i < arguments.length; i++) {
        args.push(parse(arguments[i]))
    }
    return makeDecorator(new engines.ParamsEngine(args, verifyParams))
}

function memoCreate(type, Engine) {
    var res = weak.get(type)
    if (res == null) {
        weak.set(type, res = new Engine(res))
    }
    return res
}

function memoDecorate(Engine, func) {
    return function (type) {
        var parsed = parse(type)
        var res = weak.get(parsed)
        if (res == null) {
            res = makeDecorator(memoCreate(parsed, Engine), func)
            weak.set(parsed, res)
        }
        return res
    }
}

exports.This = memoDecorate(engines.ThisEngine, function (f, engine) {
    return function () {
        /* eslint-disable no-invalid-this */
        engine.verify(this)
        return f.apply(this, arguments)
    }
})

exports.Return = memoDecorate(
    engines.ReturnEngine,
    function (f, engine) {
        return function () {
            /* eslint-disable no-invalid-this */
            return engine.verify(f.apply(this, arguments))
        }
    })

function memoEngine(Engine) {
    return function (arg, type) {
        return memoCreate(parse(type), Engine).arg()
    }
}

exports.assert = memoEngine(engines.AssertEngine)
exports.test = memoEngine(engines.CheckEngine)
