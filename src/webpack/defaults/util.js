const _ = require('lodash')

export function addVendor(config, obj) {
  if (!Array.isArray(obj)) obj = [obj]

  // TODO(vjpr): This method needs to be by linked to the `resolve.fallback` option in main.js.
  // Resolve vendor to paths.
  obj = obj.map((p) => {
    try {
      // NOTE: When using `live-perf` to dedupe, this can cause `require.resolve` to resolve differently than when `gulp webpack:build` was called.
      global.__live_perf_dedupe_disable__ = true

      // TODO(vjpr): Remove query string.
      const [a, b] = p.split('?')

      let out = require.resolve(a)
      global.__live_perf_dedupe_disable__ = false

      if (b) out = out + '?' + b

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
