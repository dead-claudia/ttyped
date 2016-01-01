/* eslint strict: [2, "function"] */
// This is the release version. It's a pure standalone library, independent of
// the rest of the modules.

(function (global, factory) {
    "use strict"
    /* eslint-disable no-undef */
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
        if (arguments.length < 3 || typeof desc !== "object") return func
    }

    function decorate() {
        return decorator
    }

    return {
        as: function (value, type) { // eslint-disable-line no-unused-vars
            return value
        },

        Type: function () {
            this.init.apply(this, arguments)
        },

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
