import {toString} from "../../../util.js"
import Checker from "../checker.js"

function isPlainObject(object) {
    if (object == null ||
            typeof object !== "object" ||
            toString.call(object) !== "[object Object]") {
        return false
    }

    const proto = Object.getPrototypeOf(object)
    return proto == null || proto === Object.prototype
}

export default class Hash extends Checker {
    constructor(type) {
        const res = super(type)
        if (res != null) return res
        this.type = type
    }

    toString() {
        return `Hash(${this.type})`
    }

    test(value) {
        if (!isPlainObject(value)) return false
        const keys = Object.keys(value)
        for (let i = 0; i < keys.length; i++) {
            if (!this.type.test(value[keys[i]])) return false
        }
        return true
    }
}
