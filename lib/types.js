"use strict"

var util = require("./util.js")
var cache = require("./cache.js")
var getName = require("./name.js")
var getType = require("./type.js")
var weak = cache.weak
var strong = cache.strong

var types = exports.types = {}

function isPlainObject(object) {
    if (object == null) return false
    if (typeof object !== "object") return false
    if (util.toString(object) !== "[object Object]") return false

    var proto = Object.getPrototypeOf(object)
    return proto == null || proto === Object.prototype
}

function Checker(value) {
    var res = weak.get(value)
    if (res != null) return res
    weak.set(value, this)
}

function makeChecker(C, test) {
    util.inherits(C, Checker)
    C.prototype.test = test
    return C
}

function exportChecker(name, C, test, construct) {
    C = makeChecker(C, test)
    if (construct == null) construct = parseArgument
    types[name] = function () {
        return new C(construct.apply(null, arguments))
    }
    return C
}

function makeCached(init, test) {
    return makeChecker(function (arg) {
        /* eslint-disable no-invalid-this */
        var res = Checker.call(this, arg)
        if (res != null) return res
        return init.apply(this, arguments)
        /* eslint-enable no-invalid-this */
    }, test)
}

function exportCached(name, C, test, construct) {
    C = makeCached(C, test)
    if (construct == null) construct = parseArgument
    types[name] = function () {
        return new C(construct.apply(null, arguments))
    }
    return C
}

function seq(list) {
    var ret = ""
    for (var i = 0; i < list.length; i++) {
        ret += ", " + list[i]
    }
    return ret.slice(2)
}

types.Type = {}

function makeBasic(name, test) {
    var T = makeChecker(function () {}, test)
    T.prototype.name = "Type." + name
    types.Type[name] = new T()
}

makeBasic("any", function () { return true })
makeBasic("boolean", function () { return typeof it === "boolean" })
makeBasic("function", function () { return typeof it === "function" })
makeBasic("number", function () { return typeof it === "number" })
makeBasic("object", function () { return typeof it === "object" })
makeBasic("string", function () { return typeof it === "string" })
makeBasic("symbol", function () { return typeof it === "symbol" })
makeBasic("undefined", function () { return typeof it === "undefined" })

/* eslint-disable no-invalid-this */
var Tuple = makeChecker(function (args) {
    var list = this.list = []
    for (var i = 0; i < args.length; i++) {
        list.push(parseArgument(args[i]))
    }
    this.name = ("[" + seq(this.list) + "]").concat()
}, function (value) {
    if (!Array.isArray(value)) return false

    var list = this.list

    if (list.length !== value.length) return false

    for (var i = 0; i < list.length; i++) {
        if (!list[i].test(value[i])) return false
    }

    return true
})

var Record = makeChecker(function (object) {
    var keys = this.keys = Object.keys(object)
    var values = this.values = []
    var name = ""

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        var value = parseArgument(object[key])
        values.push(value)
        name += ", " + util.escape(key) + ": " + value.name
    }

    this.name = ("{" + name.slice(2) + "}").concat()
}, function (value) {
    if (typeof value !== "object" || value == null) return false

    var keys = this.keys
    var values = this.values

    if (Object.keys(value).length !== keys.length) return false

    var i
    for (i = 0; i < keys.length; i++) {
        if (!util.hasOwn(value, keys[i])) return false
    }

    for (i = 0; i < keys.length; i++) {
        if (!values[i].test(value[keys[i]])) return false
    }

    return true
})

function is(a, b) {
    /* eslint-disable no-self-compare */
    return a === b || a !== a && b !== b
    /* eslint-enable no-self-compare */
}

var Literal = makeChecker(function (value) {
    var res = strong.get(value)
    if (res != null) return res
    strong.set(value, this)
    this.value = value
    this.name = getType(value)
}, function (value) {
    return is(this.value, value)
})

var Class = makeCached(function (type) {
    this.type = type
    this.name = getName(type)
}, function (value) {
    return value instanceof this.type
})

exports.parse = parseArgument
function parseArgument(arg) {
    if (typeof arg === "function") return new Class(arg)
    if (typeof arg !== "object") return new Literal(arg)
    if (arg instanceof Checker) return arg
    if (Array.isArray(arg)) return new Tuple(arg)
    return new Record(arg)
}

exportCached("Opt", function (type) {
    this.type = type
    this.name = "Opt(" + type.name + ")"
}, function (value) {
    return value === undefined || this.type.test(value)
})

exportCached("Nullable", function (type) {
    this.type = type
    this.name = "Nullable(" + type.name + ")"
}, function (value) {
    return value == null || this.type.test(value)
})

function parseArgList() {
    var list = []
    for (var i = 0; i < arguments.length; i++) {
        list.push(arguments[i])
    }
    return list
}

exportCached("Or", function (list) {
    this.list = list
    this.name = "Or(" + seq(list) + ")"
}, function (value) {
    var list = this.list
    for (var i = 0; i < list.length; i++) {
        if (list[i].check(value)) return true
    }
    return false
}, parseArgList)

exportChecker("And", function (list) {
    this.list = list
    this.name = "And(" + seq(list) + ")"
}, function (value) {
    var list = this.list
    for (var i = 0; i < list.length; i++) {
        if (!list[i].check(value)) return false
    }
    return true
}, parseArgList)

exportChecker("List", function (type) {
    this.type = type
    this.name = "And(" + seq(type) + ")"
}, function (value) {
    if (!Array.isArray(value)) return false
    var type = this.type
    for (var i = 0; i < value.length; i++) {
        if (!type.check(value[i])) return false
    }
    return true
})

exportCached("Hash", function (type) {
    this.type = type
    this.name = "And(" + seq(type) + ")"
}, function (value) {
    if (!isPlainObject(value)) return false
    var type = this.type
    var keys = Object.keys(value)
    for (var i = 0; i < keys.length; i++) {
        if (!type.check(value[keys[i]])) return false
    }
    return true
})
