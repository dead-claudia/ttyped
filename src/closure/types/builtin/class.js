import getName from "../../../name.js"
import Checker from "../checker.js"

export default class Class extends Checker {
    constructor(type) {
        const res = super(type)
        if (res != null) return res
        this.type = type
    }

    toString() {
        return getName(this.type)
    }

    test(value) {
        return value instanceof this.type
    }
}
