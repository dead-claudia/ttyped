import Cache from "../../cache/weak.js"
const weak = new Cache()

export default class Checker {
    constructor(value, skip) {
        if (skip) return
        const res = weak.get(value)
        if (res != null) return res
        weak.set(value, this)
    }
}
