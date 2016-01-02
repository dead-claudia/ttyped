import getType from "../src/type.js"
import {expect} from "chai"

describe("type default getType()", () => {
    it("exists", () => {
        expect(getType).to.be.a("function")
    })

    it("checks booleans", () => {
        expect(getType(true)).to.equal("boolean")
        expect(getType(false)).to.equal("boolean")
    })

    it("checks functions", () => {
        expect(getType(() => {})).to.equal("function")
    })

    it("checks numbers", () => {
        expect(getType(1)).to.equal("number")
        expect(getType(0)).to.equal("number")
        expect(getType(-1)).to.equal("number")
        expect(getType(Infinity)).to.equal("number")
        expect(getType(-Infinity)).to.equal("number")
        expect(getType(NaN)).to.equal("number")
    })

    it("checks strings", () => {
        expect(getType("")).to.equal("string")
        expect(getType("foo")).to.equal("string")
        expect(getType("\ud852\udf62")).to.equal("string")
    })

    if (typeof Symbol === "function" && typeof Symbol() === "symbol") {
        it("checks symbols", () => {
            expect(getType(Symbol("foo"))).to.equal("symbol")
        })
    }

    it("checks `undefined`", () => {
        expect(getType(undefined)).to.equal("`undefined`")
        expect(getType()).to.equal("`undefined`")
    })

    it("checks `null`", () => {
        expect(getType(null)).to.equal("`null`")
    })

    it("checks arrays", () => {
        expect(getType([])).to.equal("array")
    })

    it("checks dates", () => {
        expect(getType(new Date())).to.equal("Date")
    })

    it("checks errors", () => {
        expect(getType(new Error())).to.equal("Error")
    })

    it("checks plain objects", () => {
        expect(getType({})).to.equal("object")
    })

    it("checks objects with incorrect constructors", () => {
        function F() {}
        F.prototype = {}
        expect(getType(new F())).to.equal("object")
    })

    it("checks objects from Object.create(null)", () => {
        expect(getType(Object.create(null))).to.equal("object")
    })

    it("reads the constructor's name", () => {
        expect(getType({constructor: {name: "Foo"}})).to.equal("Foo")
    })

    it("reads the constructor's displayName", () => {
        expect(getType({constructor: {displayName: "Foo"}})).to.equal("Foo")
    })
})
