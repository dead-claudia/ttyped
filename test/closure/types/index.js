import * as t from "../../../src/closure/types/index.js"
import {expect} from "chai"

describe("closure/types", () => {
    it("exists", () => {
        expect(t).to.be.an("object")
    })

    context("Types", () => {
        it("exists", () => {
            expect(t.Types).to.be.an("object")
        })
    })

    context("Is", () => {
        it("exists", () => {
            expect(t.Is).to.be.a("function")
        })
    })

    context("Opt", () => {
        it("exists", () => {
            expect(t.Opt).to.be.a("function")
        })
    })

    context("Nullable", () => {
        it("exists", () => {
            expect(t.Nullable).to.be.a("function")
        })
    })

    context("Or", () => {
        it("exists", () => {
            expect(t.Or).to.be.a("function")
        })
    })

    context("And", () => {
        it("exists", () => {
            expect(t.And).to.be.a("function")
        })
    })

    context("List", () => {
        it("exists", () => {
            expect(t.List).to.be.a("function")
        })
    })

    context("Hash", () => {
        it("exists", () => {
            expect(t.Hash).to.be.a("function")
        })
    })

    context("newType", () => {
        it("exists", () => {
            expect(t.newType).to.be.a("function")
        })
    })

    context("newCached", () => {
        it("exists", () => {
            expect(t.newCached).to.be.a("function")
        })
    })
})
