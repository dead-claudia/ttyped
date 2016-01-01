"use strict"

var name = require("../lib/name.js")
var expect = require("chai").expect

describe("name default getName()", function () {
    it("exists", function () {
        expect(name).to.be.an("object")
    })

    describe("getType()", function () {
        it("exists", function () {
            expect(name.getType).to.be.a("function")
        })

        it("checks booleans", function () {
            expect(name.getType(true)).to.equal("boolean")
            expect(name.getType(false)).to.equal("boolean")
        })

        it("checks functions", function () {
            expect(name.getType(function () {})).to.equal("function")
        })

        it("checks numbers", function () {
            expect(name.getType(1)).to.equal("number")
            expect(name.getType(0)).to.equal("number")
            expect(name.getType(-1)).to.equal("number")
            expect(name.getType(Infinity)).to.equal("number")
            expect(name.getType(-Infinity)).to.equal("number")
            expect(name.getType(NaN)).to.equal("number")
        })

        it("checks strings", function () {
            expect(name.getType("")).to.equal("string")
            expect(name.getType("foo")).to.equal("string")
            expect(name.getType("\ud852\udf62")).to.equal("string")
        })

        if (typeof Symbol === "function" && typeof Symbol() === "symbol") {
            it("checks symbols", function () {
                expect(name.getType(Symbol("foo"))).to.equal("symbol")
            })
        }

        it("checks `undefined`", function () {
            expect(name.getType(undefined)).to.equal("`undefined`")
            expect(name.getType()).to.equal("`undefined`")
        })

        it("checks `null`", function () {
            expect(name.getType(null)).to.equal("`null`")
        })

        // TODO: finish these
    })
})
