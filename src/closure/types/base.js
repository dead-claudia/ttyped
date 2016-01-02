import Checker from "./checker.js"
import Tuple from "./builtin/tuple.js"
import Literal from "./builtin/literal.js"
import Record from "./builtin/record.js"
import Class from "./builtin/class.js"

export function parse(arg) {
    if (typeof arg === "function") return new Class(arg)
    if (typeof arg !== "object") return new Literal(arg)
    if (arg instanceof Checker) return arg
    if (Array.isArray(arg)) return new Tuple(arg)
    return new Record(arg)
}

export function parseList() {
    const list = []
    for (let i = 0; i < arguments.length; i++) {
        list.push(parse(arguments[i]))
    }
    return list
}
