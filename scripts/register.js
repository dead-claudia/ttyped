/* eslint-disable */
var path = require("path").resolve(__dirname, "../.babelrc")
var babelrc = JSON.parse(require("fs").readFileSync(path))
babelrc.plugins.push(require("babel-plugin-transform-es2015-modules-commonjs"))
require("babel-core/register")(babelrc)
