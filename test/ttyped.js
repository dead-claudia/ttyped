"use strict"

var ttyped = require("../.")
var expect = require("chai").expect

describe("ttyped", function () {
    if (global.toString === Object.prototype.toString) return
    describe("get type", function () {
        it("exists", function () {
            expect(ttyped).to.have.ownProperty("type")
        })
    })

    describe("check()", function () {
        it("exists", function () {
            expect(ttyped.check).to.be.a("function")
        })
    })

    describe("class Type", function () {
        it("exists", function () {
            expect(ttyped.Type).to.be.a("function")
        })

        it("throws when instantiated directly", function () {
            expect(function () {
                new ttyped.Type()
            }).to.throw()
        })

        it("throws when called", function () {
            expect(function () {
                // Call indirectly
                (0, ttyped.Type)()
            }).to.throw()
        })

        it("throws when called as ttyped member", function () {
            expect(function () {
                ttyped.Type()
            }).to.throw()
        })

        it("throws when instantiated from subclass without init", function () {
            function Sub() {
                ttyped.Type.call(this)
            }

            Sub.prototype = Object.create(ttyped.Type.prototype)
            Sub.prototype.constructor = Sub

            expect(function () {
                return new Sub()
            }).to.throw()
        })
    })

    describe("type~release", function () {
        before(function () {
            ttyped.check(false)
        })

        it("returns a function when initialized", function () {
            expect(ttyped.type).to.be.a("function")
        })

        it("contains get type", function () {
            expect(ttyped.type).to.have.ownProperty("type")
        })

        it("contains check()", function () {
            expect(ttyped.type.check).to.equal(ttyped.check)
        })

        it("contains Type()", function () {
            expect(ttyped.type.Type).to.equal(ttyped.Type)
        })

        it("doesn't assert types", function () {
            var obj = {}
            var type = ttyped.type
            expect(type.as(obj, "Object")).to.equal(obj)
            expect(type.as(obj, "Array")).to.equal(obj)
        })

        it("retains the correct lengths", function () {
            var type = ttyped.type
            expect(type).to.have.length(0)
            expect(type.as).to.have.length(2)
            expect(type.add).to.have.length(3)

            var decorator = type("Number")
            expect(decorator).to.have.length(1)

            var func = decorator(function (x, y) {
                return x + y
            })

            expect(func).to.have.length(2)
        })

        it("returns the correct value", function () {
            var type = ttyped.type
            var func = type("*")(function (x) { return x })
            var obj = {}
            expect(func(obj)).to.equal(obj)
        })

        it("doesn't fail on improper types", function () {
            var type = ttyped.type
            var func = type("Number")(function (x) {
                return x + 1
            })

            expect(function () {
                func("foo")
            }).to.not.throw()
        })

        it("doesn't fail on correct types", function () {
            var type = ttyped.type

            expect(function () {
                var func = type("Number")(function (x) {
                    return x + 1
                })

                func(1)
            }).to.not.throw()
        })

        it("doesn't fail on invalid syntax", function () {
            var type = ttyped.type
            expect(function () {
                var func = type("!!1!!1!!11!")(function (x) {
                    return x + 1
                })

                func(1)
            }).to.not.throw()
        })

        it("can add to the type", function () {
            var type = ttyped.type
            expect(function () {
                type.add("Type", "Number", function () { return true })
            }).to.not.throw()
        })
    })

    describe("type~debug", function () {
        before(function () {
            ttyped.check(true)
        })

        it("returns a function when initialized", function () {
            expect(ttyped.type).to.be.a("function")
        })

        it("contains get type", function () {
            expect(ttyped.type).to.have.ownProperty("type")
        })

        it("contains check()", function () {
            expect(ttyped.type.check).to.equal(ttyped.check)
        })

        it("contains Type()", function () {
            expect(ttyped.type.Type).to.equal(ttyped.Type)
        })

        it("can be used to assert a type at runtime", function () {
            var obj = {}
            var type = ttyped.type
            expect(type.as(obj, "Object")).to.equal(obj)
            expect(function () {
                type.as(obj, "Array")
            }).to.throw(TypeError)
        })

        it("retains the correct lengths", function () {
            var type = ttyped.type
            expect(type).to.have.length(0)
            expect(type.as).to.have.length(2)
            expect(type.add).to.have.length(3)

            var decorator = type("Number")
            expect(decorator).to.have.length(1)

            var func = decorator(function (x, y) {
                return x + y
            })

            expect(func).to.have.length(2)
        })

        it("returns the correct value", function () {
            var type = ttyped.type
            var func = type("*")(function (x) { return x })
            var obj = {}
            expect(func(obj)).to.equal(obj)
        })

        it("fails on improper types", function () {
            var type = ttyped.type
            var func = type("Number")(function (x) {
                return x + 1
            })

            expect(function () {
                func("foo")
            }).to.throw(TypeError)
        })

        it("doesn't fail on correct types", function () {
            var type = ttyped.type

            var func = type("Number")(function (x) {
                return x + 1
            })

            func(1)
        })

        it("fails on invalid syntax", function () {
            var type = ttyped.type
            expect(function () {
                type("!!1!!1!!11!")(function (x) {
                    return x + 1
                })
            }).to.throw()
        })

        it("can add to the type", function () {
            var type = ttyped.type
            type.add("Foo", "Number", function (x) { return x === 0 })
            var func = type("Foo")(function (x) {
                return x + 1
            })

            expect(function () {
                func(0)
            }).to.not.throw()
        })

        it("checks missing arguments", function () {
            var type = ttyped.type
            var func = type("Number")(function (x) {
                return x * 2
            })

            expect(function () {
                func()
            }).to.throw(TypeError)
        })

        it("checks two arguments", function () {
            var type = ttyped.type
            var func = type("Number", "String")(function (x, y) {
                return [x * 2, y]
            })

            func(0, "string")

            expect(function () {
                func(0)
            }).to.throw(TypeError)

            expect(function () {
                func(0, 1)
            }).to.throw(TypeError)

            expect(function () {
                func("string", 1)
            }).to.throw(TypeError)

            expect(function () {
                func("string", "string")
            }).to.throw(TypeError)
        })

        it("checks three arguments", function () {
            var type = ttyped.type
            var func = type("Number", "String", "[Boolean]")(
            function (x, y, list) {
                return [x * 2, y].concat(list)
            })

            func(0, "string", [])
            func(0, "string", [true])
            func(0, "string", [false])

            expect(function () {
                func(0, 1)
            }).to.throw(TypeError)

            expect(function () {
                func("string", 1)
            }).to.throw(TypeError)

            expect(function () {
                func("string", "string")
            }).to.throw(TypeError)

            expect(function () {
                func(0, "string", ["foo"])
            }).to.throw(TypeError)
        })

        it("checks `this` argument", function () {
            var type = ttyped.type
            var func = type("this::Number", "Number")(function (x) {
                return this + x // eslint-disable-line no-invalid-this
            })

            expect(func.call(1, 2)).to.equal(3)

            expect(function () {
                func.call(0, "string")
            }).to.throw(TypeError)

            expect(function () {
                func.call("string", 1)
            }).to.throw(TypeError)

            expect(function () {
                func.call("string", "string")
            }).to.throw(TypeError)

            expect(function () {
                func.call(0, "string", ["foo"])
            }).to.throw(TypeError)
        })

        it("checks rest arguments", function () {
            var type = ttyped.type
            var func = type("String", "...Number")(function (x) {
                return x + ": " + Array.prototype.slice.call(arguments, 1)
                    .join(" + ")
            })

            expect(func("Foo", 1, 2, 3)).to.equal("Foo: 1 + 2 + 3")

            expect(function () {
                func(0, "string")
            }).to.throw(TypeError)

            expect(function () {
                func("string", 1, "foo")
            }).to.throw(TypeError)

            expect(function () {
                func("string", "string", "string")
            }).to.throw(TypeError)

            expect(function () {
                func("string", "string", 1, 2, 3, 4, 5)
            }).to.throw(TypeError)

            expect(function () {
                func(0, 0)
            }).to.throw(TypeError)
        })

        it("checks rest arguments in middle", function () {
            var type = ttyped.type
            var func = type("String", "...Number", "String")(function (x) {
                return x + ": " + Array.prototype.slice.call(arguments, 1, -1)
                    .join(" + ") + " - " + arguments[arguments.length - 1]
            })

            expect(func("Foo", 1, 2, 3, "Bar")).to.equal("Foo: 1 + 2 + 3 - Bar")

            expect(function () {
                func(0, "string")
            }).to.throw(TypeError)

            expect(function () {
                func("string", "string", 1, "foo")
            }).to.throw(TypeError)

            expect(function () {
                func("string", 1, 2, 3, 4, 5, "string", "string")
            }).to.throw(TypeError)

            expect(function () {
                func("string", "string", "string")
            }).to.throw(TypeError)

            expect(function () {
                func("string", "string", 1, 2, 3, 4, 5)
            }).to.throw(TypeError)

            expect(function () {
                func(0, 0)
            }).to.throw(TypeError)
        })

        it("can be made into a decorator", function () {
            var type = ttyped.type
            var obj = {
                constant: 10,
                foo: function (x, y) {
                    return this.constant + x + y
                },
            }

            var desc = Object.getOwnPropertyDescriptor(obj, "foo")
            type("Number", "Number")(obj, "foo", desc)
            Object.defineProperty(obj, "foo", desc)

            expect(obj.foo(1, 2)).to.equal(13)

            expect(function () {
                obj.foo(0, "string")
            }).to.throw(TypeError)

            expect(function () {
                obj.foo("string", 1)
            }).to.throw(TypeError)

            expect(function () {
                obj.foo("string", "string")
            }).to.throw(TypeError)

            expect(function () {
                obj.foo(0, "string", ["foo"])
            }).to.throw(TypeError)
        })
    })
})
