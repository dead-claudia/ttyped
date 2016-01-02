/*
 * Note: if WeakMap doesn't exist, then erroneously passed non-objects are not
 * checked for. This is mostly for speed, since the entire closure-based part of
 * this library relies on this to make sure its types are created persistently.
 *
 * Also, note that if weak maps aren't supported, the capacity for the weak
 * export is hard-capped to 5000 entries instead, and cleared to 1000. In this
 * event, they're always recreated on demand, so even though it will affect
 * performance, it shouldn't clear the list frequently in most applications.
 */

// TODO: make these scale on demand
const capacity = 5000
const reset = 5000

export default typeof WeakMap === "function" ? WeakMap : class WeakCache {
    constructor() {
        this._last = null
        this._index = 0
        this._keys = []
        this._values = []
    }

    _getIndex(item, init) {
        if (item === this._last) return this._index

        let i = this._keys.indexOf(this._last = item)
        if (i === -1) {
            i = this._keys.length
            // Save memory here by not keeping everything cached
            if (init && i > capacity) {
                this._keys = this._keys.slice(0, i - reset)
                this._values = this._values.slice(0, i - reset)
                i = reset
            }
        }
        return this._index = i
    }

    get(item) {
        return this._values[this._getIndex(item, false)]
    }

    set(item, value) {
        this._values[this._getIndex(item, true)] = value
    }
}
