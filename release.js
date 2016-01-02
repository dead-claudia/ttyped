/* eslint strict: [2, "function"] */
// This is the release version. It's a pure standalone library, independent of
// the rest of the modules.

(function (global, factory) {
    /* eslint-disable no-undef */
    "use strict"
    if (typeof module === "object" && module.exports) {
        module.exports = factory()
    } else if (typeof define === "function" && define.amd) {
        define("ttyped", factory)
    } else {
        global.ttyped = factory()
    }
    /* eslint-enable no-undef */
})(this, function () {
    "use strict"

    // When types are not checked, this is used. This static function is always
    // used to speed up the release version. This should preferably not screw
    // with performance-sensitive code.
    function decorator(func, _, desc) {
        if (arguments.length < 3 || typeof desc !== "object") {
            return func
        }
    }

    function decorate() {
        return decorator
    }

    function Noop() {}
    Noop.prototype = null

    function creator(name, create) { // eslint-disable-line no-unused-vars
        return Noop
    }

    return {
        as: function (value, type) { // eslint-disable-line no-unused-vars
            return value
        },

        is: function (value, type) { // eslint-disable-line no-unused-vars
            return true
        },

        Type: function () {
            return this.init.apply(this, arguments)
        },

        newType: creator,
        newCached: creator,

        Types: {
            any: new Noop(),
            boolean: new Noop(),
            function: new Noop(),
            null: new Noop(),
            number: new Noop(),
            object: new Noop(),
            string: new Noop(),
            symbol: new Noop(),
            undefined: new Noop(),
        },

        And: Noop,
        Hash: Noop,
        List: Noop,
        Nullable: Noop,
        Opt: Noop,
        Or: Noop,

        Args: decorate,
        Arguments: decorate,
        Context: decorate,
        Ctx: decorate,
        Param: decorate,
        Params: decorate,
        Return: decorate,
        Returns: decorate,
        This: decorate,
    }
})
