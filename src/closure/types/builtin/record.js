import {escape as escapeStr, hasOwn} from "../../../util.js"
import base from "../base.js"
import Checker from "../checker.js"

export default class Record extends Checker {
    constructor(object) {
        super(undefined, false)

        this.keys = Object.keys(object)
        this.values = []

        for (let i = 0; i < this.keys.length; i++) {
            this.values.push(base.parse(object[this.keys[i]]))
        }
    }

    toString() {
        let name = ""
        for (let i = 0; i < this.keys.length; i++) {
            name += `, ${escapeStr(this.keys[i])}: ${this.values[i]}`
        }
        return `{${name.slice(2)}}`
    }

    test(value) {
        if (typeof value !== "object" || value == null) return false
        if (Object.keys(value).length !== this.keys.length) return false

        for (let i = 0; i < this.keys.length; i++) {
            if (!hasOwn.call(value, this.keys[i])) return false
        }

        for (let i = 0; i < this.keys.length; i++) {
            if (!this.values[i].test(value[this.keys[i]])) return false
        }

        return true
    }
}
