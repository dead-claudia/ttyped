"use strict"

/*
 * Note: the default export, if WeakMap doesn't exist, then erroneously passed
 * objects are not checked for. This is mostly for speed, as reading from and
 * writing to the cache has to be quick. It's called by most decorators, so if
 * it's slow, it will noticeably slow down the startup of libraries/applications
 * that depend on this when in debug mode (the release variants are no-ops).
 *
 * Also, note that if weak maps aren't supported, the capacity is hard-capped
 * instead.
 */

function MapCache(map) {
    this._map = map
}

MapCache.prototype.get = function (item) {
    return this._map.get(item)
}

MapCache.prototype.set = function (item, value) {
    this._map.set(item, value)
}

// A variant of ListCache that caches a lot less.
function LimitedListCache() {
    this._last = null
    this._index = 0
    this._keys = []
    this._values = []
}

LimitedListCache.prototype._getIndex = function (item, init) {
    if (item === this._last) {
        return this._index
    } else {
        var i = this._keys.indexOf(item)
        if (i === -1) {
            i = this._keys.length
            // Save memory here by not keeping everything cached
            if (init && i > 10000) {
                this._keys = this._keys.slice(i - 100)
                this._values = this._values.slice(i - 100)
                i = 100
            }
        }
        this._last = item
        return this._index = i
    }
}

LimitedListCache.prototype.get = function (item) {
    return this._values[this._getIndex(item, false)]
}

LimitedListCache.prototype.set = function (item, value) {
    this._values[this._getIndex(item, true)] = value
}

function ListCache() {
    this._last = null
    this._index = 0
    this._keys = []
    this._values = []
}

ListCache.prototype._getIndex = function (item) {
    if (item === this._last) {
        return this._index
    } else {
        var i = this._keys.indexOf(item)
        if (i === -1) i = this._keys.length
        this._last = item
        return this._index = i
    }
}

ListCache.prototype.get = function (item) {
    return this._values[this._getIndex(item)]
}

ListCache.prototype.set = function (item, value) {
    this._values[this._getIndex(item)] = value
}

if (typeof WeakMap === "function") {
    exports.weak = new MapCache(new WeakMap())
} else if (typeof Map === "function") {
    exports.weak = new MapCache(new Map())
} else {
    exports.weak = new LimitedListCache()
}

if (typeof Map === "function") {
    exports.strong = new MapCache(new Map())
} else if (typeof WeakMap === "function") {
    exports.strong = new ListCache()
} else {
    exports.strong = module.exports
}
