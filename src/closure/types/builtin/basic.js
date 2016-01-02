import Checker from "../checker.js"

function basic(name, test) {
    return new class extends Checker {
        constructor() { super(undefined, true) }
        test(value) { return test(value) }
        toString() { return `Type.${name}` }
    }
}

// Can't just export them here with the correct names, because they screw with
// Babel's global references, and Babel isn't smart enough to rename anything.
const AnyType = basic("Any", x => x != null)
const BooleanType = basic("Boolean", x => typeof x === "boolean")
const FunctionType = basic("Function", x => typeof x === "function")
const NullType = basic("Null", x => x === null)
const NumberType = basic("Number", x => typeof x === "number")
const ObjectType = basic("Object", x => typeof x === "object" && x !== null)
const StringType = basic("String", x => typeof x === "string")
const SymbolType = basic("Symbol", x => typeof x === "symbol")
const UndefinedType = basic("Undefined", x => x === undefined)

export {
    AnyType as Any,
    BooleanType as Boolean,
    FunctionType as Function,
    NullType as Null,
    NumberType as Number,
    ObjectType as Object,
    StringType as String,
    SymbolType as Symbol,
    UndefinedType as Undefined,
}
