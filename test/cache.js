"use strict"

var cache = require("../lib/cache.js")
var expect = require("chai").expect

describe("cache", function () {
    it("exists", function () {
        expect(cache).to.be.an("object")
    })

    it("has cache.strong", function () {
        expect(cache.strong).to.be.an("object")
    })

    it("has cache.weak", function () {
        expect(cache.weak).to.be.an("object")
    })

    describe("weak cache", function () {
        it("adds objects to the cache", function () {
            var obj = {}
            cache.weak.set(obj, 1)
            expect(cache.weak.get(obj)).to.equal(1)
        })
    })

    describe("strong cache", function () {
        it("adds objects to the cache", function () {
            var obj = {}
            cache.strong.set(obj, 1)
            expect(cache.strong.get(obj)).to.equal(1)
        })

        it("adds primitives to the cache", function () {
            cache.strong.set(true, 1)
            expect(cache.strong.get(true)).to.equal(1)
        })
    })
})
