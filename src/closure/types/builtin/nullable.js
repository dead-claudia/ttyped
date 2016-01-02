import Checker from "../checker.js"

export default class Nullable extends Checker {
    constructor(type) {
        const res = super(type)
        if (res != null) return res
        this.type = type
    }

    toString() {
        return `Nullable(${this.type})`
    }

    test(value) {
        return value == null || this.type.test(value)
    }
}
