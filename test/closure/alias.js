import getName from "../../src/name.js"
import {expect} from "chai"

const path = require.resolve("../../src/closure/alias.js")

function load(pre, post) {
    const hasOwn = {}.hasOwnProperty.call(require.cache, path)
    let tmp

    if (hasOwn) {
        tmp = require.cache[path]
        delete require.cache[path]
    }

    if (pre) pre()
    const ret = require(path)
    if (post) post()

    if (hasOwn) {
        require.cache[path] = tmp
    } else {
        delete require.cache[path]
    }

    return ret.default || ret
}

const O = (() => {
    const oldSingle = Object.defineProperty
    const oldMultiple = Object.defineProperties

    return {
        install() {
            function mock() {
                throw new Error("Uncallable Object method")
            }

            // Keep this in sync with the tests in the actual file itself.
            const names = /^(length,name|name,length)$/

            function isOkay(props) {
                return names.test(Object.keys(props).join()) &&
                    props.length != null &&
                    props.name != null
            }

            function init() {
                Object.defineProperty = Object.defineProperties = mock
            }

            Object.defineProperties = (f, props) => {
                if (f.length > 0 || !isOkay(props)) {
                    return oldMultiple(f, props)
                } else {
                    init()
                    mock()
                }
            }
        },

        uninstall() {
            Object.defineProperty = oldSingle
            Object.defineProperties = oldMultiple
        },
    }
})()

const F = (() => {
    const old = Function

    return {
        install() {
            O.install()
            global.Function = function () {
                throw new Error("Uncallable Function")
            }
            Function.prototype = old.prototype
        },

        uninstall() {
            global.Function = old
            O.uninstall()
        },
    }
})()

describe("closure/alias default alias()", () => {
    // Precompute these, so tests that would be guaranteed to fail can be
    // automatically skipped.
    const canSetProps = (() => {
        function f() {}
        try {
            Object.defineProperties(f, {
                length: {
                    configurable: true,
                    enumerable: true,
                    value: 1,
                },
                name: {
                    configurable: true,
                    enumerable: true,
                    value: "foo",
                },
                displayName: {
                    configurable: true,
                    enumerable: true,
                    value: "foo",
                },
            })
            // Check if they're silently ignored
            return f.length === 1 && f.name === "foo" && f.displayName === "foo"
        } catch (_) {
            return false
        }
    })()

    const canEval = (() => {
        try {
            return Function("return!0")() // eslint-disable-line no-new-func
        } catch (_) {
            return false
        }
    })()

    it("exists", () => {
        expect(load()).to.be.a("function")
    })

    context("can set props", () => {
        if (!canSetProps) return

        let alias
        before(() => alias = load())

        it("sets length correctly", () => {
            function f(x, y) { return x + y }
            function g() {}
            expect(alias(g, f)).to.have.length(2)
        })

        it("sets name correctly", () => {
            function f(x, y) { return x + y }
            function g() {}

            expect(getName(alias(g, f))).to.equal(getName(f))
        })
    })

    context("can eval", () => {
        if (!canEval) return

        let alias
        before(() => alias = load(O.install, O.uninstall))

        it("sets length correctly", () => {
            function f(x, y) { return x + y }
            function g() {}
            expect(alias(g, f)).to.have.length(2)
        })

        it("sets name correctly", () => {
            function f(x, y) { return x + y }
            function g() {}

            expect(getName(alias(g, f))).to.equal(getName(f))
        })
    })

    context("can't eval", () => {
        let alias
        before(() => alias = load(F.install, F.uninstall))

        it("silently fails to set length", () => {
            function f(x, y) { return x + y }
            function g() {}

            expect(alias(g, f)).to.have.length(0)
        })

        it("silently fails to set name", () => {
            function f(x, y) { return x + y }
            function g() {}

            const original = getName(g)
            expect(getName(alias(g, f))).to.equal(original)
        })
    })
})
