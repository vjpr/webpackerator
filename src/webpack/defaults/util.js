const _ = require('lodash')

export function addVendor(config, obj) {
  if (!Array.isArray(obj)) obj = [obj]

  // TODO(vjpr): This method needs to be by linked to the `resolve.fallback` option in main.js.
  // Resolve vendor to paths.
  obj = obj.map((p) => {
    try {
      const out = require.resolve(p)
      return out
    } catch (e) {
      throw new Error(`Could not resolve module '${p}' from context '${module.filename}'`)
    }
  })
  config.merge(_.set({}, 'entry.vendor', obj))
}

export function addAlias(config, obj) {
  config.merge(_.set({}, 'resolve.alias', obj))
}

export function getVendor(config, obj) {
  return config._config.entry.vendor
}
