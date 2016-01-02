import Checker from "./checker.js"
import Cache from "../../cache/weak.js"

class BasicType extends Checker {
    constructor(factory, args) {
        super(undefined, true)
        this.creator = factory.creator.apply(null, args)
    }

    toString() {
        return this.factory.name
    }

    test() {
        return this.creator.apply(null, arguments)
    }
}

class BasicFactory {
    constructor(name, creator) {
        this.name = name
        this.creator = creator
    }

    type(...args) {
        return new BasicType(this, args)
    }
}

export function newType(name, create) {
    const factory = new BasicFactory(name, create)
    return function () {
        return factory.type(...arguments)
    }
}

const weak = new Cache()

const CacheWrapper = {
    get(key) {
        if (typeof key !== "object") {
            throw new Error("Expected key to be an object")
        }
        return weak.get(key)
    },

    set(key, value) {
        if (typeof key !== "object") {
            throw new Error("Expected key to be an object")
        }
        weak.set(key, value)
    },
}

class CachedType extends Checker {
    constructor(factory, args) {
        super(undefined, false)
        this.creator = factory.creator.apply(CacheWrapper, args)
    }

    toString() {
        return this.factory.name
    }

    test() {
        return this.creator.apply(null, arguments)
    }
}

class CachedFactory {
    constructor(name, creator) {
        this.name = name
        this.creator = creator
    }

    type(...args) {
        return new CachedType(this, args)
    }
}

export function newCached(name, create) {
    const factory = new CachedFactory(name, create)
    return function () {
        return factory.type(...arguments)
    }
}
