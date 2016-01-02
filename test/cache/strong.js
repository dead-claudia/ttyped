import Cache from "../../src/cache/strong.js"
import {expect} from "chai"

describe("cache/strong", () => {
    it("exists", () => {
        expect(Cache).to.be.a("function")
    })

    it("adds objects to the cache", () => {
        const cache = new Cache()
        const obj = {}
        cache.set(obj, 1)
        expect(cache.get(obj)).to.equal(1)
    })

    it("adds primitives to the cache", () => {
        const cache = new Cache()
        cache.set(true, 1)
        expect(cache.get(true)).to.equal(1)
    })
})
