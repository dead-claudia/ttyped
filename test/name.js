"use strict"

var getName = require("../lib/name.js")
var expect = require("chai").expect

describe("name default getName()", function () {
    it("exists", function () {
        expect(getName).to.be.a("function")
    })

    it("returns `name`", function () {
        expect(getName({name: "foo"})).to.equal("foo")
    })

    it("returns `displayName`", function () {
        expect(getName({displayName: "foo"})).to.equal("foo")
    })

    it("returns `<anonymous>` if neither exists", function () {
        expect(getName({})).to.equal("<anonymous>")
    })

    it("returns `<anonymous>` if `name` is an empty string", function () {
        expect(getName({name: ""})).to.equal("<anonymous>")
    })

    it("returns `<anonymous>` if `displayName` is an empty string", function () { // eslint-disable-line max-len
        expect(getName({displayName: ""})).to.equal("<anonymous>")
    })

    it("prefers `name` over `displayName`", function () {
        expect(getName({
            name: "foo",
            displayName: "bar",
        })).to.equal("foo")
    })

    it("prefers non-empty `displayName` over empty `name`", function () {
        expect(getName({
            name: "",
            displayName: "bar",
        })).to.equal("bar")
    })

    it("returns `<anonymous>` when both are empty strings", function () {
        expect(getName({
            name: "",
            displayName: "",
        })).to.equal("<anonymous>")
    })
})
