"use strict"

var util = require("./util.js")

exports.getName = getName
function isName(name) {
    return typeof name === "string" && name !== ""
}

function getName(func) {
    if (isName(func.name)) return func.name
    if (isName(func.displayName)) return func.displayName
    return "<anonymous>"
}

function getComplexType(object) {
    var toString = util.toString(object)
    if (toString !== "[object Object]") return toString.slice(8, -1)

    var func = object.constructor
    if (func === Object) return "object"

    var name = getName(func)
    return name != null ? name : "object"
}

module.exports = getType
function getType(object) {
    if (typeof object === "boolean") return "boolean"
    if (typeof object === "function") return "function"
    if (typeof object === "number") return "number"
    if (typeof object === "string") return "string"
    if (typeof object === "symbol") return "symbol"
    if (typeof object === "undefined") return "`undefined`"
    if (object === null) return "`null`"
    return getComplexType(object)
}
