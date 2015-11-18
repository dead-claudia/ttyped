"use strict"

var util = require("./lib/util.js")

function makeArgs(len) {
    var res = ""
    for (var i = 0; i < len; i++) {
        res += ",x" + i
    }
    return res.slice(1)
}

function makeHeader(minLen, thisType) {
    var source = "return function(" + makeArgs(minLen) + "){var i=" +
        minLen + ",l=arguments.length,j"

    if (thisType != null) {
        source += ";c.check('" + util.escape(thisType) + "',this)"
    }

    return source
}

function checkArgs(args, end) {
    var source = ""

    for (var i = 0; i < end; i++) {
        source += ";c.check('" + util.escape(args[i]) + "',x" + i + ")"
    }

    return source
}

function makeVerifier(first, thisType, restParam, restType, last) {
    var minLen = first.length
    var source = makeHeader(minLen, thisType)

    if (restParam === -1) {
        source += checkArgs(first, minLen)
    } else {
        restType = util.escape(restType)

        if (last.length === 0) {
            source += checkArgs(first, minLen) + ";for(;i<l;c.check('" +
                restType + "',arguments[i++]))"
        } else {
            source += checkArgs(first, restParam) + ";for(j=" + restParam +
                ",i=l-i;j<i;c.check('" + restType + "',arguments[j++]));" +
                "for(i=0;j<l;c.check(a[i++],arguments[j++]))"
        }
    }

    /* eslint-disable no-new-func */
    return new Function("c,f,a", source + ";return f.apply(this,arguments)}")
    /* eslint-enable no-new-func */
}

function noopWrapper(func) {
    if (arguments.length !== 3 || typeof desc !== "object") {
        return func
    }
}

function Verifier(cache, first, thisType, restParam, restType, last) {
    this.func = makeVerifier(first, thisType, restParam, restType, last)
    this.cache = cache
    this.args = last
}

Verifier.prototype.call = function (f) {
    return util.alias(this.func(this.cache, f, this.args), f)
}

util.makeExports(exports, function () {
    // The types are cached within the module to limit the overhead of calling.
    // Performance would slow down otherwise.
    var cache = new util.TypeChecker()

    function type() { // eslint-disable-line max-statements
        if (arguments.length === 0) {
            return noopWrapper
        }

        var thisType
        var i = 0

        if (/this\s*::/.test(arguments[0])) {
            thisType = cache.add(arguments[0], "`this` type")
            i++
        }

        var restParam = -1
        var restType
        var first = []
        var last = []

        while (i < arguments.length) {
            // Not parsed yet, because of potential rest argument
            var arg = arguments[i]

            if (arg.slice(0, 3) === "...") {
                restParam = i++
                restType = cache.add(arg.slice(3), "Rest type")
                break
            }

            first.push(cache.add(arg, i++))
        }

        while (i < arguments.length) {
            last.push(cache.add(arguments[i], i++))
        }

        var verify = new Verifier(cache, first, thisType, restParam, restType,
            last)

        return function (desc) {
            if (arguments.length !== 3 || typeof desc !== "object") {
                return verify.call(desc)
            } else {
                desc = arguments[2]
                desc.value = verify.call(desc.value)
            }
        }
    }

    return util.makeChecker(this, cache, type)
}.bind(exports))
