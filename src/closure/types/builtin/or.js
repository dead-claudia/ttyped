import Checker from "../checker.js"
import seq from "./seq.js"

export default class Or extends Checker {
    constructor(list) {
        super(undefined, true)
        this.list = list
    }

    toString() {
        return `Or(${seq(this.list)})`
    }

    test(value) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].test(value)) return true
        }
        return false
    }
}
