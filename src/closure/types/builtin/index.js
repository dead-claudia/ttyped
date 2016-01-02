import * as base from "../base.js"
import * as Types from "./basic.js"

export {Types}

function wrap(parser, C) {
    return function () { return new C(parser(...arguments)) }
}

import Literal from "./literal.js"
export const Is = wrap(x => x, Literal)

import OptType from "./opt.js"
export const Opt = wrap(base.parse, OptType)

import NullableType from "./nullable.js"
export const Nullable = wrap(base.parse, NullableType)

import OrType from "./or.js"
export const Or = wrap(base.parseList, OrType)

import AndType from "./and.js"
export const And = wrap(base.parseList, AndType)

import ListType from "./list.js"
export const List = wrap(base.parse, ListType)

import HashType from "./hash.js"
export const Hash = wrap(base.parse, HashType)
