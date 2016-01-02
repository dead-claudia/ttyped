import getName from "../src/name.js"
import {expect} from "chai"

describe("name default getName()", () => {
    it("exists", () => {
        expect(getName).to.be.a("function")
    })

    it("returns `name`", () => {
        expect(getName({name: "foo"})).to.equal("foo")
    })

    it("returns `displayName`", () => {
        expect(getName({displayName: "foo"})).to.equal("foo")
    })

    it("returns `<anonymous>` if neither exists", () => {
        expect(getName({})).to.equal("<anonymous>")
    })

    it("returns `<anonymous>` if `name` is an empty string", () => {
        expect(getName({name: ""})).to.equal("<anonymous>")
    })

    it("returns `<anonymous>` if `displayName` is an empty string", () => {
        expect(getName({displayName: ""})).to.equal("<anonymous>")
    })

    it("prefers `name` over `displayName`", () => {
        expect(getName({name: "foo", displayName: "bar"})).to.equal("foo")
    })

    it("prefers non-empty `displayName` over empty `name`", () => {
        expect(getName({name: "", displayName: "bar"})).to.equal("bar")
    })

    it("returns `<anonymous>` when both are empty strings", () => {
        expect(getName({name: "", displayName: ""})).to.equal("<anonymous>")
    })
})
