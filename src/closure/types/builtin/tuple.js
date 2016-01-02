import * as base from "../base.js"
import Checker from "../checker.js"
import seq from "./seq.js"

export class Tuple extends Checker {
    constructor(args) {
        super(undefined, false)

        const list = []
        for (let i = 0; i < args.length; i++) {
            list.push(base.parse(args[i]))
        }
        this.list = list
    }

    toString() {
        return `[${seq(this.list)}]`
    }

    test(value) {
        if (!Array.isArray(value) || this.list.length !== value.length) {
            return false
        }

        for (let i = 0; i < this.list.length; i++) {
            if (!this.list[i].test(value[i])) return false
        }

        return true
    }
}
