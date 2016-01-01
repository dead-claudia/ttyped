"use strict"

var toString = require("./util.js").toString
var getName = require("./name.js")

// Copied from node-util and specialized for the following options:
// showHidden: false
// depth: 2
// colors: false
// customInspect: false
//
// https://github.com/defunctzombie/node-util

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isRegExp(re) {
    return isObject(re) && toString(re) === "[object RegExp]"
}

function isObject(arg) {
    return typeof arg === "object" && arg !== null
}

function isDate(d) {
    return isObject(d) && toString(d) === "[object Date]"
}

function isError(e) {
    return isObject(e) &&
        (toString(e) === "[object Error]" || e instanceof Error)
}

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 */
function inspect(obj) {
    return formatValue([], obj, 2)
}
module.exports = inspect

function arrayToHash(array) {
    var hash = {}

    array.forEach(function (val) {
        hash[val] = true
    })

    return hash
}

function formatFunctionBase(value) {
    var name = getName(value)
    name = name !== "<anonymous>" ? ": " + name : ""
    return "[Function" + name + "]"
}

function formatOutput(seen, value, recursed, visible, keys, array) {
    if (array) {
        return formatArray(seen, value, recursed, visible, keys)
    } else {
        return keys.map(function (key) {
            return formatProperty(seen, value, recursed, visible, key, array)
        })
    }
}

function getBase(value) {
    // Make functions say that they are functions
    if (typeof value === "function") {
        return formatFunctionBase(value)
    }

    // Make RegExps say that they are RegExps
    if (isRegExp(value)) {
        return " " + RegExp.prototype.toString.call(value)
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
        return " " + Date.prototype.toUTCString.call(value)
    }

    // Make error with message first say the error
    if (isError(value)) {
        return " " + formatError(value)
    }

    return ""
}

function recursionTooDeep(value) {
    if (isRegExp(value)) {
        return RegExp.prototype.toString.call(value)
    } else {
        return "[Object]"
    }
}

// Some type of object without properties can be shortcutted.
function tryShortcut(keys, value) {
    // IE doesn't make error fields non-enumerable
    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
    if (isError(value) &&
            (keys.indexOf("message") >= 0 ||
            keys.indexOf("description") >= 0)) {
        return formatError(value)
    }

    if (keys.length === 0) {
        if (typeof value === "function") {
            return formatFunctionBase(value)
        }
        if (isRegExp(value)) {
            return RegExp.prototype.toString.call(value)
        }
        if (isDate(value)) {
            return Date.prototype.toString.call(value)
        }
        if (isError(value)) {
            return formatError(value)
        }
    }
}

function formatValue(seen, value, recursed) {
    // Primitive types cannot have properties
    var primitive = formatPrimitive(value)
    if (primitive) return primitive

    // Look up the keys of the object.
    var keys = Object.keys(value)
    var visible = arrayToHash(keys)

    var res = tryShortcut(keys, value)
    if (res !== undefined) return res

    var base = getBase(value)
    var array = false
    var braces = ["{", "}"]

    // Make Array say that they are Array
    if (Array.isArray(value)) {
        array = true
        braces = ["[", "]"]
    }

    if (keys.length === 0 && (!array || value.length === 0)) {
        return braces[0] + base + braces[1]
    }

    if (recursed < 0) {
        return recursionTooDeep(value)
    }

    seen.push(value)

    var output = formatOutput(seen, value, recursed, visible, keys, array)

    seen.pop()

    return reduceToSingleString(output, base, braces)
}

function formatPrimitive(value) {
    if (value === undefined) {
        return "undefined"
    }

    if (typeof value === "string") {
        var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "")
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + "'"
        return simple
    }
    if (typeof value === "number") {
        return "" + value
    }
    if (typeof value === "boolean") {
        return "" + value
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
        return "null"
    }
}

function formatError(value) {
    return "[" + Error.prototype.toString.call(value) + "]"
}

function formatArray(seen, value, recursed, visible, keys) {
    var output = []
    for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(seen, value, recursed, visible,
                    String(i), true))
        } else {
            output.push("")
        }
    }
    keys.forEach(function (key) {
        if (!key.match(/^\d+$/)) {
            output.push(formatProperty(seen, value, recursed, visible,
                    key, true))
        }
    })
    return output
}

function formatRecurse(seen, desc, array, recursed) {
    if (desc.get) {
        if (desc.set) {
            return "[Getter/Setter]"
        } else {
            return "[Getter]"
        }
    } else if (desc.set) {
        return "[Setter]"
    }

    if (seen.indexOf(desc.value) < 0) {
        var str = formatValue(seen, desc.value, recursed - 1)
        if (str.indexOf("\n") > -1) {
            if (array) {
                return str.split("\n").map(function (line) {
                    return "    " + line
                }).join("\n").substr(2)
            } else {
                return "\n" + str.split("\n").map(function (line) {
                    return "     " + line
                }).join("\n")
            }
        } else {
            return str
        }
    } else {
        return "[Circular]"
    }
}

function getPropertyName(hasOwn, visible, key) {
    if (!hasOwnProperty(visible, key)) {
        return "[" + key + "]"
    }

    var name = JSON.stringify("" + key)
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        return name.substr(1, name.length - 2)
    } else {
        return name.replace(/'/g, "\\'")
                   .replace(/\\"/g, '"')
                   .replace(/(^"|"$)/g, "'")
    }
}

function formatProperty(seen, value, recursed, visible, key, array) {
    var desc = Object.getOwnPropertyDescriptor(value, key) || {
        value: value[key],
    }

    var str = formatRecurse(seen, desc, array, recursed)
    var hasOwn = hasOwnProperty(visible, key)

    if (hasOwn && array && key.match(/^\d+$/)) {
        return str
    }

    return getPropertyName(hasOwn, visible, key) + ": " + str
}

function reduceToSingleString(output, base, braces) {
    var numLinesEst = 0
    var length = output.reduce(function (prev, cur) {
        numLinesEst++
        if (cur.indexOf("\n") >= 0) numLinesEst++
        return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1
    }, 0)

    if (length > 60) {
        return braces[0] +
               (base === "" ? "" : base + "\n ") +
               " " +
               output.join(",\n    ") +
               " " +
               braces[1]
    }

    return braces[0] + base + " " + output.join(", ") + " " + braces[1]
}
