import * as Types from "../../../../src/closure/types/builtin/basic"
import Checker from "../../../../src/closure/types/checker"
import {expect} from "chai"

describe("closure/types/builtin/basic", () => {
    it("exists", () => {
        expect(Types).to.be.an("object")
    })

    const hasSymbol = typeof Symbol === "function" &&
        typeof Symbol() === "symbol"

    context("Any", () => {
        it("exists", () => {
            expect(Types.Any).to.be.an.instanceof(Checker)
        })

        it("fails with `null` and `undefined`", () => {
            expect(Types.Any.test(null)).to.be.false
            expect(Types.Any.test(undefined)).to.be.false
            expect(Types.Any.test()).to.be.false
        })

        it("checks with everything else", () => {
            expect(Types.Any.test(1)).to.be.true
            expect(Types.Any.test(0)).to.be.true
            expect(Types.Any.test(true)).to.be.true
            expect(Types.Any.test(false)).to.be.true
            expect(Types.Any.test("string")).to.be.true
            expect(Types.Any.test("")).to.be.true
            expect(Types.Any.test({})).to.be.true
            expect(Types.Any.test({valueOf: () => false})).to.be.true
            expect(Types.Any.test([])).to.be.true
            expect(Types.Any.test(() => {})).to.be.true
            expect(Types.Any.test(Types.Any)).to.be.true
            expect(Types.Any.test(Checker.prototype)).to.be.true
            expect(Types.Any.test(new Date())).to.be.true
            if (hasSymbol) expect(Types.Any.test(Symbol())).to.be.true
        })
    })

    context("Boolean", () => {
        it("exists", () => {
            expect(Types.Boolean).to.be.an.instanceof(Checker)
        })

        it("fails with `null` or `undefined`", () => {
            expect(Types.Boolean.test(null)).to.be.false
            expect(Types.Boolean.test(undefined)).to.be.false
            expect(Types.Boolean.test()).to.be.false
        })

        it("checks with booleans", () => {
            expect(Types.Boolean.test(true)).to.be.true
            expect(Types.Boolean.test(false)).to.be.true
        })

        it("fails with everything else", () => {
            expect(Types.Boolean.test(1)).to.be.false
            expect(Types.Boolean.test(0)).to.be.false
            expect(Types.Boolean.test("string")).to.be.false
            expect(Types.Boolean.test("")).to.be.false
            expect(Types.Boolean.test({})).to.be.false
            expect(Types.Boolean.test({valueOf: () => false})).to.be.false
            expect(Types.Boolean.test([])).to.be.false
            expect(Types.Boolean.test(() => {})).to.be.false
            expect(Types.Boolean.test(Types.Any)).to.be.false
            expect(Types.Boolean.test(Checker.prototype)).to.be.false
            expect(Types.Boolean.test(new Date())).to.be.false
            if (hasSymbol) expect(Types.Boolean.test(Symbol())).to.be.false
        })
    })

    context("Function", () => {
        it("exists", () => {
            expect(Types.Function).to.be.an.instanceof(Checker)
        })

        it("fails with `null` or `undefined`", () => {
            expect(Types.Function.test(null)).to.be.false
            expect(Types.Function.test(undefined)).to.be.false
            expect(Types.Function.test()).to.be.false
        })

        it("checks with functions", () => {
            expect(Types.Function.test(() => {})).to.be.true
        })

        it("fails with everything else", () => {
            expect(Types.Function.test(1)).to.be.false
            expect(Types.Function.test(0)).to.be.false
            expect(Types.Function.test(true)).to.be.false
            expect(Types.Function.test(false)).to.be.false
            expect(Types.Function.test("string")).to.be.false
            expect(Types.Function.test("")).to.be.false
            expect(Types.Function.test({})).to.be.false
            expect(Types.Function.test({valueOf: () => false})).to.be.false
            expect(Types.Function.test([])).to.be.false
            expect(Types.Function.test(Types.Any)).to.be.false
            expect(Types.Function.test(Checker.prototype)).to.be.false
            expect(Types.Function.test(new Date())).to.be.false
            if (hasSymbol) expect(Types.Function.test(Symbol())).to.be.false
        })
    })

    context("Number", () => {
        it("exists", () => {
            expect(Types.Number).to.be.an.instanceof(Checker)
        })

        it("fails with `null` or `undefined`", () => {
            expect(Types.Number.test(null)).to.be.false
            expect(Types.Number.test(undefined)).to.be.false
            expect(Types.Number.test()).to.be.false
        })

        it("checks with numbers", () => {
            expect(Types.Number.test(1)).to.be.true
            expect(Types.Number.test(0)).to.be.true
            expect(Types.Number.test(-1)).to.be.true
        })

        it("fails with everything else", () => {
            expect(Types.Number.test(true)).to.be.false
            expect(Types.Number.test(false)).to.be.false
            expect(Types.Number.test("string")).to.be.false
            expect(Types.Number.test("")).to.be.false
            expect(Types.Number.test({})).to.be.false
            expect(Types.Number.test({valueOf: () => false})).to.be.false
            expect(Types.Number.test([])).to.be.false
            expect(Types.Number.test(() => {})).to.be.false
            expect(Types.Number.test(Types.Any)).to.be.false
            expect(Types.Number.test(Checker.prototype)).to.be.false
            expect(Types.Number.test(new Date())).to.be.false
            if (hasSymbol) expect(Types.Number.test(Symbol())).to.be.false
        })
    })

    context("Object", () => {
        it("exists", () => {
            expect(Types.Object).to.be.an.instanceof(Checker)
        })

        it("fails with `null` or `undefined`", () => {
            expect(Types.Object.test(null)).to.be.false
            expect(Types.Object.test(undefined)).to.be.false
            expect(Types.Object.test()).to.be.false
        })

        it("checks with any object", () => {
            expect(Types.Object.test({})).to.be.true
            expect(Types.Object.test({valueOf: () => false})).to.be.true
            expect(Types.Object.test([])).to.be.true
            expect(Types.Object.test(Types.Any)).to.be.true
            expect(Types.Object.test(Checker.prototype)).to.be.true
            expect(Types.Object.test(new Date())).to.be.true
        })

        it("fails with everything else", () => {
            expect(Types.Object.test(1)).to.be.false
            expect(Types.Object.test(0)).to.be.false
            expect(Types.Object.test(true)).to.be.false
            expect(Types.Object.test(false)).to.be.false
            expect(Types.Object.test("string")).to.be.false
            expect(Types.Object.test("")).to.be.false
            expect(Types.Object.test(() => {})).to.be.false
            if (hasSymbol) expect(Types.Object.test(Symbol())).to.be.false
        })
    })

    context("String", () => {
        it("exists", () => {
            expect(Types.String).to.be.an.instanceof(Checker)
        })

        it("fails with `null` or `undefined`", () => {
            expect(Types.String.test(null)).to.be.false
            expect(Types.String.test(undefined)).to.be.false
            expect(Types.String.test()).to.be.false
        })

        it("checks with strings", () => {
            expect(Types.String.test("string")).to.be.true
            expect(Types.String.test("")).to.be.true
        })

        it("fails with everything else", () => {
            expect(Types.String.test(1)).to.be.false
            expect(Types.String.test(0)).to.be.false
            expect(Types.String.test(true)).to.be.false
            expect(Types.String.test(false)).to.be.false
            expect(Types.String.test({})).to.be.false
            expect(Types.String.test({valueOf: () => false})).to.be.false
            expect(Types.String.test([])).to.be.false
            expect(Types.String.test(() => {})).to.be.false
            expect(Types.String.test(Types.Any)).to.be.false
            expect(Types.String.test(Checker.prototype)).to.be.false
            expect(Types.String.test(new Date())).to.be.false
            if (hasSymbol) expect(Types.String.test(Symbol())).to.be.false
        })
    })

    context("Symbol", () => {
        it("exists", () => {
            expect(Types.Symbol).to.be.an.instanceof(Checker)
        })

        it("fails with `null` or `undefined`", () => {
            expect(Types.Symbol.test(null)).to.be.false
            expect(Types.Symbol.test(undefined)).to.be.false
            expect(Types.Symbol.test()).to.be.false
        })

        if (hasSymbol) {
            it("checks with symbols", () => {
                expect(Types.Symbol.test(Symbol())).to.be.true
            })
        }

        it("fails with everything else", () => {
            expect(Types.Symbol.test(1)).to.be.false
            expect(Types.Symbol.test(0)).to.be.false
            expect(Types.Symbol.test(true)).to.be.false
            expect(Types.Symbol.test(false)).to.be.false
            expect(Types.Symbol.test("string")).to.be.false
            expect(Types.Symbol.test("")).to.be.false
            expect(Types.Symbol.test({})).to.be.false
            expect(Types.Symbol.test({valueOf: () => false})).to.be.false
            expect(Types.Symbol.test([])).to.be.false
            expect(Types.Symbol.test(() => {})).to.be.false
            expect(Types.Symbol.test(Types.Any)).to.be.false
            expect(Types.Symbol.test(Checker.prototype)).to.be.false
            expect(Types.Symbol.test(new Date())).to.be.false
        })
    })

    context("Undefined", () => {
        it("exists", () => {
            expect(Types.Undefined).to.be.an.instanceof(Checker)
        })

        it("checks with `undefined`", () => {
            expect(Types.Undefined.test(undefined)).to.be.true
            expect(Types.Undefined.test()).to.be.true
        })

        it("fails with everything else", () => {
            expect(Types.Undefined.test(1)).to.be.false
            expect(Types.Undefined.test(0)).to.be.false
            expect(Types.Undefined.test(true)).to.be.false
            expect(Types.Undefined.test(false)).to.be.false
            expect(Types.Undefined.test("string")).to.be.false
            expect(Types.Undefined.test("")).to.be.false
            expect(Types.Undefined.test({})).to.be.false
            expect(Types.Undefined.test({valueOf: () => false})).to.be.false
            expect(Types.Undefined.test([])).to.be.false
            expect(Types.Undefined.test(() => {})).to.be.false
            expect(Types.Undefined.test(Types.Any)).to.be.false
            expect(Types.Undefined.test(Checker.prototype)).to.be.false
            expect(Types.Undefined.test(new Date())).to.be.false
            if (hasSymbol) expect(Types.Undefined.test(Symbol())).to.be.false
        })
    })

    context("Null", () => {
        it("exists", () => {
            expect(Types.Null).to.be.an.instanceof(Checker)
        })

        it("checks with `null`", () => {
            expect(Types.Null.test(null)).to.be.true
        })

        it("fails with `undefined`", () => {
            expect(Types.Null.test(undefined)).to.be.false
            expect(Types.Null.test()).to.be.false
        })

        it("fails with everything else", () => {
            expect(Types.Null.test(1)).to.be.false
            expect(Types.Null.test(0)).to.be.false
            expect(Types.Null.test(true)).to.be.false
            expect(Types.Null.test(false)).to.be.false
            expect(Types.Null.test("string")).to.be.false
            expect(Types.Null.test("")).to.be.false
            expect(Types.Null.test({})).to.be.false
            expect(Types.Null.test({valueOf: () => false})).to.be.false
            expect(Types.Null.test([])).to.be.false
            expect(Types.Null.test(() => {})).to.be.false
            expect(Types.Null.test(Types.Any)).to.be.false
            expect(Types.Null.test(Checker.prototype)).to.be.false
            expect(Types.Null.test(new Date())).to.be.false
            if (hasSymbol) expect(Types.Null.test(Symbol())).to.be.false
        })
    })
})
