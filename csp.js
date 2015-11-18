"use strict"

var util = require("./lib/util.js")

util.makeExports(exports, function () {
    // The types are cached within the module to limit the overhead of calling.
    // Performance would slow down otherwise.
    var cache = new util.TypeChecker()

    function basicVerify(args, thisType) {
        if (thisType != null) {
            return function () {
                /* eslint-disable no-invalid-this */
                cache.check(thisType, this)
                /* eslint-enable no-invalid-this */
                for (var i = 0; i < args.length; i++) {
                    cache.check(args[i], arguments[i])
                }
            }
        } else {
            return function () {
                for (var i = 0; i < args.length; i++) {
                    cache.check(args[i], arguments[i])
                }
            }
        }
    }

    function createVerifier(args, thisType, restParam, restType) {
        var basic = basicVerify(args, thisType)
        var minLen = args.length

        if (restParam === -1) return basic

        if (restParam === minLen) {
            return function () {
                /* eslint-disable no-invalid-this */
                if (arguments.length <= minLen) {
                    return basic.apply(this, arguments)
                }

                if (thisType != null) {
                    cache.check(thisType, this)
                }
                /* eslint-enable no-invalid-this */

                var i = 0

                for (; i < minLen; i++) {
                    cache.check(args[i], arguments[i])
                }

                for (; i < arguments.length; i++) {
                    cache.check(restType, arguments[i])
                }
            }
        }

        return function () {
            /* eslint-disable no-invalid-this */
            if (arguments.length <= minLen) {
                return basic.apply(this, arguments)
            }

            if (thisType != null) {
                cache.check(thisType, this)
            }
            /* eslint-enable no-invalid-this */

            var i = 0
            var j = 0

            while (j < restParam) {
                cache.check(args[i++], arguments[j++])
            }

            var endIndex = arguments.length - restParam

            while (j < endIndex) {
                cache.check(restType, arguments[j++])
            }

            while (j < arguments.length) {
                cache.check(args[i++], arguments[j++])
            }
        }
    }

    function type() { // eslint-disable-line max-statements
        if (arguments.length === 0) {
            return basicVerify([], undefined)
        }

        var thisType
        var i = 0
        var args = []

        if (/this\s*::/.test(arguments[0])) {
            thisType = cache.add(arguments[0], "`this` type")
            i++
        }

        var restParam = -1
        var restType

        while (i < arguments.length) {
            // Not parsed yet, because of potential rest argument
            var arg = arguments[i]

            if (arg.slice(0, 3) === "...") {
                restParam = i++
                restType = cache.add(arg.slice(3), "Rest type")
                break
            }

            args.push(cache.add(arg, i++))
        }

        while (i < arguments.length) {
            args.push(cache.add(arguments[i], i++))
        }

        var verify = createVerifier(args, thisType, restParam, restType)

        return function (desc) {
            var f

            function checker() {
                /* eslint-disable no-invalid-this */
                verify.apply(this, arguments)
                return f.apply(this, arguments)
                /* eslint-enable no-invalid-this */
            }

            if (arguments.length !== 3 || typeof desc !== "object") {
                return util.alias(checker, f = desc)
            } else {
                desc = arguments[2]
                desc.value = util.alias(checker, f = desc.value)
            }
        }
    }

    return util.makeChecker(this, cache, type)
}.bind(exports))
