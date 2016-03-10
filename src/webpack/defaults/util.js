//region Imports
const _ = require('lodash')
//endregion

export function addVendor(config, obj) {
  if (!Array.isArray(obj)) obj = [obj]
  config.merge(_.set({}, 'entry.vendor', obj))
}

export function addAlias(config, obj) {
  config.merge(_.set({}, 'resolve.alias', obj))
}
