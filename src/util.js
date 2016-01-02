export const hasOwn = Object.prototype.hasOwnProperty
export const toString = Object.prototype.toString

export function escape(string) {
    return string.replace(/(["\\])/g, "\\$1")
}

// Don't want all the bloat of Node's util.inherits
export function inherits(C, Super) {
    C.prototype = Object.create(Super.prototype)
    C.prototype.constructor = C
}
