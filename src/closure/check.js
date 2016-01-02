import getType from "../type.js"
import alias from "./alias.js"
import * as base from "./types/base.js"

function makeDecorator(check) {
    return function (func, _, desc) {
        if (arguments.length !== 3 || typeof desc !== "object") {
            return alias(check(func), func)
        }

        desc.value = alias(check(desc.value), desc.value)
    }
}

function verifyType(expected, found, name) {
    if (!expected.test(found)) {
        throw new TypeError(`Expected ${name} to be of type ${expected
            } but found ${getType(found)}`)
    }

    return found
}

export function Params() {
    const args = []
    for (let i = 0; i < arguments.length; i++) {
        args.push(base.parse(arguments[i]))
    }
    return makeDecorator(f => function () {
        for (let i = 0; i < args.length; i++) {
            verifyType(args[i], arguments[i], `argument ${i}`)
        }

        /* eslint-disable no-invalid-this */
        return f.apply(this, arguments)
        /* eslint-enable no-invalid-this */
    })
}

export function This(type) {
    type = base.parse(type)
    return makeDecorator(f => function () {
        /* eslint-disable no-invalid-this */
        verifyType(type, this, "`this`")
        return f.apply(this, arguments)
        /* eslint-enable no-invalid-this */
    })
}

export function Returns(type) {
    type = base.parse(type)
    return makeDecorator(f => function () {
        /* eslint-disable no-invalid-this */
        return verifyType(type, f.apply(this, arguments), "return type")
        /* eslint-enable no-invalid-this */
    })
}

export function is(value, type) {
    return base.parse(type).test(value)
}

export function as(value, type) {
    return verifyType(base.parse(type), value, "value")
}

export class Type {
    constructor() {
        return this.init(...arguments)
    }
}
