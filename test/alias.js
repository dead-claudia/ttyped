"use strict"

var getName = require("../lib/name.js").getName
var expect = require("chai").expect

var path = require.resolve("../lib/alias.js")

function load(pre, post) {
    var hasOwn = Object.prototype.hasOwnProperty(require.cache, path)
    if (hasOwn) {
        var tmp = require.cache[path]
        delete require.cache[path]
    }

    if (pre != null) pre()
    var ret = require(path)
    if (post != null) post()

    if (hasOwn) require.cache[path] = tmp
    else delete require.cache[path]

    return ret
}

var O = (function (oldSingle, oldMultiple) {
    return {
        install: function () {
            // This is being mocked.
            function mock() {
                throw new Error("Uncallable Object method")
            }

            /*
             * This is extremely fragile. Keep this in sync with the tests in
             * the actual file itself.
             */

            var names = /^(length,name|name,length)$/
            function isOkay(props) {
                return names.test(Object.keys(props).join(",")) &&
                    props.length != null &&
                    props.name != null
            }

            /* eslint-disable no-native-reassign */
            function init() {
                Object.defineProperty = Object.defineProperties = mock
            }

            Object.defineProperties = function (f, props) {
                if (f.length !== 0 || !isOkay(props)) {
                    return oldMultiple.apply(this, arguments)
                }

                init()
                return mock()
            }
            /* eslint-enable no-native-reassign */
        },

        uninstall: function () {
            /* eslint-disable no-native-reassign */
            Object.defineProperty = oldSingle
            Object.defineProperties = oldMultiple
            /* eslint-enable no-native-reassign */
        },
    }
})(Object.defineProperty, Object.defineProperties)

var F = (function (old) {
    return {
        install: function () {
            O.install()
            // The function constructor is being mocked for this.
            /* eslint-disable no-native-reassign, no-undef */
            Function = function () {
                throw new Error("Uncallable Function")
            }
            Function.prototype = old.prototype
            /* eslint-enable no-native-reassign, no-undef */
        },

        uninstall: function () {
            O.uninstall()
            /* eslint-disable no-native-reassign, no-undef */
            Function = old
            /* eslint-enable no-native-reassign, no-undef */
        },
    }
})(Function)

describe("alias default alias()", function () {
    // Precompute these, so tests that would be guaranteed to fail can be
    // automatically skipped.
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

    it("exists", function () {
        expect(load()).to.be.a("function")
    })

    context("can set props", function () {
        if (!canSetProps) return

        var alias

        beforeEach(function () {
            alias = load()
        })

        it("sets length correctly", function () {
            function f(x, y) {
                return x + y
            }

            function g() {}

            expect(alias(g, f)).to.have.length(2)
        })

        it("sets name correctly", function () {
            function f(x, y) {
                return x + y
            }

            function g() {}

            expect(getName(alias(g, f))).to.equal(getName(f))
        })
    })

    context("can eval", function () {
        if (!canEval) return

        var alias

        beforeEach(function () {
            alias = load(O.install, O.uninstall)
        })

        it("sets length correctly", function () {
            function f(x, y) {
                return x + y
            }

            function g() {}

            expect(alias(g, f)).to.have.length(2)
        })

        it("sets name correctly", function () {
            function f(x, y) {
                return x + y
            }

            function g() {}

            expect(getName(alias(g, f))).to.equal(getName(f))
        })
    })

    context("can't eval", function () {
        var alias

        beforeEach(function () {
            alias = load(F.install, F.uninstall)
        })

        it("silently fails to set length", function () {
            function f(x, y) {
                return x + y
            }

            function g() {}

            expect(alias(g, f)).to.have.length(0)
        })

        it("silently fails to set name", function () {
            function f(x, y) {
                return x + y
            }

            function g() {}

            var original = getName(g)
            expect(getName(alias(g, f))).to.equal(original)
        })
    })
})
