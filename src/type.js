import getName from "./name.js"
import {toString} from "./util.js"

export default function getType(object) {
    if (typeof object === "boolean") return "boolean"
    if (typeof object === "function") return "function"
    if (typeof object === "number") return "number"
    if (typeof object === "string") return "string"
    if (typeof object === "symbol") return "symbol"
    if (typeof object === "undefined") return "`undefined`"
    if (object === null) return "`null`"
    if (Array.isArray(object)) return "array"

    const string = toString.call(object)
    if (string !== "[object Object]") return string.slice(8, -1)

    const func = object.constructor
    if (func === Object || func == null) return "object"

    const name = getName(func)
    return name !== "<anonymous>" ? name : "object"
}
