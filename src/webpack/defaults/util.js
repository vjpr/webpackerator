const _ = require('lodash')
const safeResolve = require('safe-resolve')
const resolveFrom = require('resolve-from')

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

      let out

      // NOTE: This was not working on Ubuntu 16.04 in a capistrano-like deploy. Strange.
      //out = safeResolve(a)

      try {
        out = require.resolve(a)
      } catch (err) {
        // TODO(vjpr): Check for module not found error.
        return null
      }

      if (!out) {
        // TODO(vjpr): process.cwd() should be replaced with resolve.fallback.
        out = resolveFrom(process.cwd(), a)
      }

      if (!out) throw new Error('Cannot resolve module.')

      global.__live_perf_dedupe_disable__ = false

      if (b) out = out + '?' + b

      return out
    } catch (e) {
      console.log({e})
      // TODO(vjpr): Maybe instead of throwing an error immediately, count them up and show all at once.
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
