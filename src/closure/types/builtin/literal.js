import getType from "../../../type.js"
import Checker from "../checker.js"
import Cache from "../../../cache/strong.js"

const strong = new Cache()

function is(a, b) {
    return a === b || a !== a && b !== b // eslint-disable-line no-self-compare
}

export default class Literal extends Checker {
    constructor(value) {
        super(undefined, true)
        const res = strong.get(value)
        if (res != null) return res
        strong.set(value, this)
        this.value = value
    }

    toString() {
        return getType(this.value)
    }

    test(value) {
        return is(this.value, value)
    }
}
