/* eslint-disable new-cap */
import * as release from "../release.js"
import {expect} from "chai"
import * as sinon from "sinon"

describe("release", () => {
    it("exists", () => {
        expect(release).to.be.an("object")
    })

    const {Types} = release || {}

    describe("Types", () => {
        it("exists", () => {
            expect(Types).to.be.an("object")
        })

        it("has all its members", () => {
            expect(Types.any).to.be.an("object")
            expect(Types.boolean).to.be.an("object")
            expect(Types.function).to.be.an("object")
            expect(Types.number).to.be.an("object")
            expect(Types.object).to.be.an("object")
            expect(Types.string).to.be.an("object")
            expect(Types.symbol).to.be.an("object")
            expect(Types.undefined).to.be.an("object")
            expect(Types.null).to.be.an("object")
        })
    })

    describe("as()", () => {
        it("exists", () => {
            expect(release.as).to.be.a("function").with.length(2)
        })

        it("returns the original value", () => {
            const obj = {}
            expect(release.as(obj, Types.object)).to.equal(obj)
        })
    })

    describe("class Type", () => {
        it("exists", () => {
            expect(release.Type).to.be.a("function").with.length(0)
        })

        it("can't be called directly", () => {
            expect(() => release.Type()).to.throw()
            expect(() => (0, release.Type)()).to.throw()
            expect(() => new release.Type()).to.throw()
        })

        it("requires an `init` method", () => {
            class F extends release.Type {}
            expect(() => new F()).to.throw()
        })

        it("can be called from a subclass", () => {
            class F extends release.Type {
                init() {}
            }
            new F()
        })
    })

    describe("is()", () => {
        it("exists", () => {
            expect(release.is).to.be.a("function").with.length(2)
        })

        it("always returns `true`", () => {
            expect(release.is("string", Types.number)).to.be.true
        })
    })

    it("has all the logical combinators", () => {
        expect(release.And).to.be.a("function")
        expect(release.Hash).to.be.a("function")
        expect(release.List).to.be.a("function")
        expect(release.Nullable).to.be.a("function")
        expect(release.Opt).to.be.a("function")
        expect(release.Or).to.be.a("function")
    })

    describe("newType()", () => {
        it("exists", () => {
            expect(release.newType).to.be.a("function")
        })

        it("creates actual types", () => {
            expect(release.newType("Foo", () => x => x)).to.be.a("function")
        })

        it("doesn't actually call any functions", () => {
            const spy = sinon.spy(() => () => {})
            release.newType("Foo", spy)()
            expect(spy).to.not.be.called
        })

        it("doesn't assert anything", () => {
            const Foo = release.newType("Foo", () => () => false)
            release.as(true, Foo())
        })
    })

    describe("newCached()", () => {
        it("exists", () => {
            expect(release.newCached).to.be.a("function")
        })

        it("creates actual types", () => {
            expect(release.newCached("Foo", () => x => x)).to.be.a("function")
        })

        it("doesn't actually call any functions", () => {
            const spy = sinon.spy(() => () => {})
            release.newCached("Foo", spy)()
            expect(spy).to.not.be.called
        })

        it("doesn't assert anything", () => {
            const Foo = release.newCached("Foo", () => () => false)
            release.as(true, Foo())
        })
    })

    describe("Args()", () => {
        const {Args} = release || {}

        it("exists", () => {
            expect(Args).to.be.a("function")
        })

        it("returns the original function", () => {
            function func() {}
            expect(Args(Types.number, Types.number)(func)).to.equal(func)
        })

        it("always validates when called as a function", () => {
            const func = Args(Types.number, Types.number)(x => x)
            expect(func("Wrong!")).to.equal("Wrong!")
        })

        it("always validates when applied as a decorator", () => {
            const obj = {func(x) { return x }}

            const desc = Object.getOwnPropertyDescriptor(obj, "func")
            Args(Types.number, Types.number)(obj, "func", desc)
            Object.defineProperty(obj, "func", desc)

            expect(obj.func("Wrong!")).to.equal("Wrong!")
        })
    })

    describe("Arguments()", () => {
        const {Arguments} = release || {}

        it("exists", () => {
            expect(Arguments).to.be.a("function")
        })

        it("returns the original function", () => {
            function func() {}
            expect(Arguments(Types.number, Types.number)(func)).to.equal(func)
        })

        it("always validates when called as a function", () => {
            const func = Arguments(Types.number, Types.number)(x => x)
            expect(func("Wrong!")).to.equal("Wrong!")
        })

        it("always validates when applied as a decorator", () => {
            const obj = {func(x) { return x }}

            const desc = Object.getOwnPropertyDescriptor(obj, "func")
            Arguments(Types.number, Types.number)(obj, "func", desc)
            Object.defineProperty(obj, "func", desc)

            expect(obj.func("Wrong!")).to.equal("Wrong!")
        })
    })

    describe("Context()", () => {
        const {Context} = release || {}

        it("exists", () => {
            expect(Context).to.be.a("function")
        })

        it("returns the original function", () => {
            function func() {}
            expect(Context(Types.number)(func)).to.equal(func)
        })

        it("always validates when called as a function", () => {
            const func = Context(Types.number)(function () {
                return this // eslint-disable-line no-invalid-this
            })
            expect(func.call("Wrong!")).to.equal("Wrong!")
        })

        it("always validates when applied as a decorator", () => {
            const obj = {func() { return this }}

            const desc = Object.getOwnPropertyDescriptor(obj, "func")
            Context(Types.number)(obj, "func", desc)
            Object.defineProperty(obj, "func", desc)

            expect(obj.func.call("Wrong!")).to.equal("Wrong!")
        })
    })

    describe("Ctx()", () => {
        const {Ctx} = release || {}

        it("exists", () => {
            expect(Ctx).to.be.a("function")
        })

        it("returns the original function", () => {
            function func() {}
            expect(Ctx(Types.number)(func)).to.equal(func)
        })

        it("always validates when called as a function", () => {
            const func = Ctx(Types.number)(function () {
                return this // eslint-disable-line no-invalid-this
            })
            expect(func.call("Wrong!")).to.equal("Wrong!")
        })

        it("always validates when applied as a decorator", () => {
            const obj = {func() { return this }}

            const desc = Object.getOwnPropertyDescriptor(obj, "func")
            Ctx(Types.number)(obj, "func", desc)
            Object.defineProperty(obj, "func", desc)

            expect(obj.func.call("Wrong!")).to.equal("Wrong!")
        })
    })

    describe("Param()", () => {
        const {Param} = release || {}

        it("exists", () => {
            expect(Param).to.be.a("function")
        })

        it("returns the original function", () => {
            function func() {}
            expect(Param(Types.number, Types.number)(func)).to.equal(func)
        })

        it("always validates when called as a function", () => {
            const func = Param(Types.number, Types.number)(x => x)
            expect(func("Wrong!")).to.equal("Wrong!")
        })

        it("always validates when applied as a decorator", () => {
            const obj = {func(x) { return x }}

            const desc = Object.getOwnPropertyDescriptor(obj, "func")
            Param(Types.number, Types.number)(obj, "func", desc)
            Object.defineProperty(obj, "func", desc)

            expect(obj.func("Wrong!")).to.equal("Wrong!")
        })
    })

    describe("Params()", () => {
        const {Params} = release || {}

        it("exists", () => {
            expect(Params).to.be.a("function")
        })

        it("returns the original function", () => {
            function func() {}
            expect(Params(Types.number)(func)).to.equal(func)
        })

        it("always validates when called as a function", () => {
            const func = Params(Types.number, Types.number)(x => x)
            expect(func("Wrong!")).to.equal("Wrong!")
        })

        it("always validates when applied as a decorator", () => {
            const obj = {func(x) { return x }}

            const desc = Object.getOwnPropertyDescriptor(obj, "func")
            Params(Types.number, Types.number)(obj, "func", desc)
            Object.defineProperty(obj, "func", desc)

            expect(obj.func("Wrong!")).to.equal("Wrong!")
        })
    })

    describe("Return()", () => {
        const {Return} = release || {}

        it("exists", () => {
            expect(Return).to.be.a("function")
        })

        it("returns the original function", () => {
            function func() {}
            expect(Return(Types.number)(func)).to.equal(func)
        })

        it("always validates when called as a function", () => {
            const func = Return(Types.number)(x => x)
            expect(func("Wrong!")).to.equal("Wrong!")
        })

        it("always validates when applied as a decorator", () => {
            const obj = {func(x) { return x }}

            const desc = Object.getOwnPropertyDescriptor(obj, "func")
            Return(Types.number)(obj, "func", desc)
            Object.defineProperty(obj, "func", desc)

            expect(obj.func("Wrong!")).to.equal("Wrong!")
        })
    })

    describe("Returns()", () => {
        const {Returns} = release || {}

        it("exists", () => {
            expect(Returns).to.be.a("function")
        })

        it("returns the original function", () => {
            function func() {}
            expect(Returns(Types.number)(func)).to.equal(func)
        })

        it("always validates when called as a function", () => {
            const func = Returns(Types.number)(x => x)
            expect(func("Wrong!")).to.equal("Wrong!")
        })

        it("always validates when applied as a decorator", () => {
            const obj = {func(x) { return x }}

            const desc = Object.getOwnPropertyDescriptor(obj, "func")
            Returns(Types.number)(obj, "func", desc)
            Object.defineProperty(obj, "func", desc)

            expect(obj.func("Wrong!")).to.equal("Wrong!")
        })
    })

    describe("This()", () => {
        const {This} = release || {}

        it("exists", () => {
            expect(This).to.be.a("function")
        })

        it("returns the original function", () => {
            function func() {}
            expect(This(Types.number)(func)).to.equal(func)
        })

        it("always validates when called as a function", () => {
            const func = This(Types.number)(function () {
                return this // eslint-disable-line no-invalid-this
            })
            expect(func.call("Wrong!")).to.equal("Wrong!")
        })

        it("always validates when applied as a decorator", () => {
            const obj = {func() { return this }}

            const desc = Object.getOwnPropertyDescriptor(obj, "func")
            This(Types.number)(obj, "func", desc)
            Object.defineProperty(obj, "func", desc)

            expect(obj.func.call("Wrong!")).to.equal("Wrong!")
        })
    })
})
