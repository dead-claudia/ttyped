import * as closure from "../../src/closure/index.js"
import {expect} from "chai"

describe.skip("closure/index", () => {
    describe("get type", () => {
        it("exists", () => {
            expect(closure).to.have.ownProperty("type")
        })
    })

    describe("class Type", () => {
        it("exists", () => {
            expect(closure.Type).to.be.a("function")
        })

        it("throws when instantiated directly", () => {
            expect(() => new closure.Type()).to.throw()
        })

        it("throws when called", () => {
            // Call indirectly
            expect(() => (0, closure.Type)()).to.throw()
        })

        it("throws when called as member", () => {
            /* eslint-disable new-cap */
            expect(() => closure.Type()).to.throw()
            /* eslint-enable new-cap */
        })

        it("throws when instantiated from subclass without init", () => {
            class Sub extends closure.Type {}
            expect(() => new Sub()).to.throw()
        })
    })

    it("returns a function when initialized", () => {
        expect(closure.type).to.be.a("function")
    })

    it("contains get type", () => {
        expect(closure.type).to.have.ownProperty("type")
    })

    it("contains check()", () => {
        expect(closure.type.check).to.equal(closure.check)
    })

    it("contains Type()", () => {
        expect(closure.type.Type).to.equal(closure.Type)
    })

    it("can be used to assert a type at runtime", () => {
        const obj = {}
        const {type} = closure
        expect(type.as(obj, "Object")).to.equal(obj)
        expect(() => type.as(obj, "Array")).to.throw(TypeError)
    })

    it("retains the correct lengths", () => {
        const {type} = closure
        expect(type).to.have.length(0)
        expect(type.as).to.have.length(2)
        expect(type.add).to.have.length(3)

        const decorator = type("Number")
        expect(decorator).to.have.length(1)
        expect(decorator((x, y) => x + y)).to.have.length(2)
    })

    it("returns the correct value", () => {
        const {type} = closure
        const func = type("*")(x => x)
        const obj = {}
        expect(func(obj)).to.equal(obj)
    })

    it("fails on improper types", () => {
        const {type} = closure
        const func = type("Number")(x => x + 1)
        expect(() => func("foo")).to.throw(TypeError)
    })

    it("doesn't fail on correct types", () => {
        const {type} = closure
        const func = type("Number")(x => x + 1)
        func(1)
    })

    it("fails on invalid syntax", () => {
        const {type} = closure
        expect(() => type("!!1!!1!!11!")(x => x + 1)).to.throw()
    })

    it("can add to the type", () => {
        const {type} = closure
        type.add("Foo", "Number", x => x === 0)
        const func = type("Foo")(x => x + 1)
        func(0)
    })

    it("checks missing arguments", () => {
        const {type} = closure
        const func = type("Number")(x => x * 2)
        expect(() => func()).to.throw(TypeError)
    })

    it("checks two arguments", () => {
        const {type} = closure
        const func = type("Number", "String")((x, y) => [x * 2, y])

        func(0, "string")
        expect(() => func(0)).to.throw(TypeError)
        expect(() => func(0, 1)).to.throw(TypeError)
        expect(() => func("string", 1)).to.throw(TypeError)
        expect(() => func("string", "string")).to.throw(TypeError)
    })

    it("checks three arguments", () => {
        const {type} = closure
        const func = type("Number", "String", "[Boolean]")((x, y, list) =>
            [x * 2, y].concat(list))

        func(0, "string", [])
        func(0, "string", [true])
        func(0, "string", [false])

        expect(() => func(0, 1)).to.throw(TypeError)
        expect(() => func("string", 1)).to.throw(TypeError)
        expect(() => func("string", "string")).to.throw(TypeError)
        expect(() => func(0, "string", ["foo"])).to.throw(TypeError)
    })

    it("checks `this` argument", () => {
        const {type} = closure
        const func = type("this::Number", "Number")(function (x) {
            return this + x // eslint-disable-line no-invalid-this
        })

        expect(func.call(1, 2)).to.equal(3)

        expect(() => func.call(0, "string")).to.throw(TypeError)
        expect(() => func.call("string", 1)).to.throw(TypeError)
        expect(() => func.call("string", "string")).to.throw(TypeError)
        expect(() => func.call(0, "string", ["foo"])).to.throw(TypeError)
    })

    it("checks rest arguments", () => {
        const {type} = closure
        const func = type("String", "...Number")((x, ...ys) =>
            `${x}: ${ys.join(" + ")}`)

        expect(func("Foo", 1, 2, 3)).to.equal("Foo: 1 + 2 + 3")

        expect(() => func(0, "string")).to.throw(TypeError)
        expect(() => func("string", 1, "foo")).to.throw(TypeError)
        expect(() => func("string", "string", "string")).to.throw(TypeError)
        expect(() => func("string", "string", 1, 2, 3, 4)).to.throw(TypeError)
        expect(() => func(0, 0)).to.throw(TypeError)
    })

    it("checks rest arguments in middle", () => {
        const {type} = closure
        const func = type("String", "...Number", "String")((x, ...ys) =>
            `${x}: ${ys.slice(0, -1).join(" + ")} - ${ys.pop()}`)

        expect(func("Foo", 1, 2, 3, "Bar")).to.equal("Foo: 1 + 2 + 3 - Bar")

        expect(() => func(0, "string")).to.throw(TypeError)
        expect(() => func("string", "string", 1, "foo")).to.throw(TypeError)
        expect(() => {
            func("string", 1, 2, 3, 4, 5, "string", "string")
        }).to.throw(TypeError)
        expect(() => func("string", "string", "string")).to.throw(TypeError)
        expect(() => func("string", "string", 1, 2, 3, 4, 5))
            .to.throw(TypeError)
        expect(() => func(0, 0)).to.throw(TypeError)
    })

    it("can be made into a decorator", () => {
        const {type} = closure
        const obj = {
            constant: 10,
            foo(x, y) {
                return this.constant + x + y
            },
        }

        const desc = Object.getOwnPropertyDescriptor(obj, "foo")
        type("Number", "Number")(obj, "foo", desc)
        Object.defineProperty(obj, "foo", desc)

        expect(obj.foo(1, 2)).to.equal(13)

        expect(() => obj.foo(0, "string")).to.throw(TypeError)
        expect(() => obj.foo("string", 1)).to.throw(TypeError)
        expect(() => obj.foo("string", "string")).to.throw(TypeError)
        expect(() => obj.foo(0, "string", ["foo"])).to.throw(TypeError)
    })
})
