import Checker from "../checker.js"

export default class List extends Checker {
    constructor(type) {
        const res = super(type)
        if (res != null) return res
        this.type = type
    }

    toString() {
        return `List(${this.type})`
    }

    test(value) {
        if (!Array.isArray(value)) return false
        for (let i = 0; i < value.length; i++) {
            if (!this.type.test(value[i])) return false
        }
        return true
    }
}
