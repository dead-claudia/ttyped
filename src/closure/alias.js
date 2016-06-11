import getName from "../name.js"
import identifierRegexp from "./identifier-regexp.js"

let trySetProps

if ((() => {
    function f() {}
    try {
        Object.defineProperties(f, {
            length: {configurable: true, enumerable: true, value: 1},
            name: {configurable: true, enumerable: true, value: "foo"},
            displayName: {configurable: true, enumerable: true, value: "foo"},
        })
        // Check if they're silently ignored
        return f.length === 1 && f.name === "foo" && f.displayName === "foo"
    } catch (_) {
        return false
    }
})()) {
    // ES6 standardized `Function#name`, and `Function#displayName` is a
    // common non-standard extension.
    trySetProps = function (target, func) {
        Object.defineProperties(target, {
            length: Object.getOwnPropertyDescriptor(func, "length"),
            name: Object.getOwnPropertyDescriptor(func, "name"),
        })

        const desc = Object.getOwnPropertyDescriptor(func, "displayName")

        if (desc != null) {
            Object.defineProperty(target, "displayName", desc)
        }

        return target
    }
} else if ((() => {
    try {
        return global.Function("return!0")() // eslint-disable-line no-new-func
    } catch (_) {
        return false
    }
})()) {
    // Fake the function length via code generation, setting the name if it's a
    // valid identifier.
    trySetProps = function (target, func) {
        let res = ""
        let len = func.length
        while (len !== 0) {
            res += `,x${len--}`
        }
        const name = getName(func)
        if (identifierRegexp.test(name)) {
            const inner = name === "f" ? "_" : "f"
            /* eslint-disable no-new-func */
            return new global.Function(inner, `
                return function ${name}(${res.slice(1)}) {
                    return ${inner}.apply(this, arguments)
                }
            `)(target)
            /* eslint-enable no-new-func */
        } else {
            // Skip setting the name.
            /* eslint-disable no-new-func */
            return new global.Function("f", `
                return function (${res.slice(1)}) {
                    return f.apply(this, arguments)
                }
            `)(target)
            /* eslint-enable no-new-func */
        }
    }
} else {
    // Ignore if it's not ES6 and CSP is enabled - there's no hope here
    trySetProps = function (target) {
        return target
    }
}

export default function alias(target, func) {
    if (typeof func !== "function") {
        throw new TypeError("Expected a function argument")
    }

    return trySetProps(target, func)
}
