export default typeof Map === "function" ? Map : class StrongCache {
    constructor() {
        this._last = null
        this._index = 0
        this._keys = []
        this._values = []
    }

    _getIndex(item) {
        if (item === this._last) return this._index

        let i = this._keys.indexOf(this._last = item)
        if (i === -1) i = this._keys.length
        return this._index = i
    }

    get(item) {
        return this._values[this._getIndex(item)]
    }

    set(item, value) {
        this._values[this._getIndex(item)] = value
    }
}
