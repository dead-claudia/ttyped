import Cache from "../../src/cache/weak.js"
import {expect} from "chai"

describe("cache/weak", () => {
    it("exists", () => {
        expect(Cache).to.be.a("function")
    })

    it("adds objects to the cache", () => {
        const weak = new Cache()
        const obj = {}
        weak.set(obj, 1)
        expect(weak.get(obj)).to.equal(1)
    })
})
