"use strict"

var getName = require("./name.js")
var util = require("./util.js")

function getComplexType(object) {
    var toString = util.toString(object)
    if (toString !== "[object Object]") return toString.slice(8, -1)

    var func = object.constructor
    if (func === Object) return "object"

    var name = getName(func)
    return name != null ? name : "object"
}

exports.getType = getType
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
