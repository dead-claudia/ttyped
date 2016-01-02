import Literal from "../../../../src/closure/types/builtin/literal.js"
import Checker from "../../../../src/closure/types/checker.js"
import {expect} from "chai"

describe("closure/types/builtin/literal", () => {
    it("exists", () => {
        expect(Literal).to.be.a("function")
    })

    const hasSymbol = typeof Symbol === "function" &&
        typeof Symbol() === "symbol"

    it("works with primitives", () => {
        expect(new Literal(1).test(1)).to.be.true
        expect(new Literal(0).test(0)).to.be.true
        expect(new Literal(true).test(true)).to.be.true
        expect(new Literal(false).test(false)).to.be.true
        expect(new Literal("string").test("string")).to.be.true
        expect(new Literal("").test("")).to.be.true
        expect(new Literal(NaN).test(NaN)).to.be.true
        expect(new Literal(Infinity).test(Infinity)).to.be.true
        expect(new Literal(-Infinity).test(-Infinity)).to.be.true
        expect(new Literal(null).test(null)).to.be.true
        expect(new Literal(undefined).test(undefined)).to.be.true
        expect(new Literal().test()).to.be.true
    })

    it("works with references", () => {
        let o
        expect(new Literal(o = {}).test(o)).to.be.true
        expect(new Literal(o = {valueOf: () => false}).test(o)).to.be.true
        expect(new Literal(o = []).test(o)).to.be.true
        expect(new Literal(o = () => {}).test(o)).to.be.true
        expect(new Literal(o = new Literal()).test(o)).to.be.true
        expect(new Literal(o = Checker.prototype).test(o)).to.be.true
        expect(new Literal(o = new Date()).test(o)).to.be.true
        if (hasSymbol) expect(new Literal(o = Symbol()).test(o)).to.be.true
    })

    it("tests for identity", () => {
        expect(new Literal({}).test({})).to.be.false
        expect(
            new Literal({valueOf: () => false}).test({valueOf: () => false})
        ).to.be.false
        expect(new Literal([]).test([])).to.be.false
        expect(new Literal(() => {}).test(() => {})).to.be.false
        expect(new Literal(new Date()).test(new Date())).to.be.false
        if (hasSymbol) expect(new Literal(Symbol()).test(Symbol())).to.be.false
    })
})
