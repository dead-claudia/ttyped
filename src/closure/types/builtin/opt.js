import Checker from "../checker.js"

export default class Opt extends Checker {
    constructor(type) {
        const res = super(type)
        if (res != null) return res
        this.type = type
    }

    toString() {
        return `Opt(${this.type})`
    }

    test(value) {
        return value === undefined || this.type.test(value)
    }
}
