//region Imports
const _ = require('lodash')
const cwd = require('cwd')
const getEntryPoints = require('./get-live-framework-entry-points')
const {addVendor, addAlias} = require('../util')
//endregion

export default function(webpack, opts, config) {

  opts = _.defaults({}, opts, {
    mainEntryPoint: './lib/client',
  })

  if (!opts.liveLocator) {
    console.error('You must set `opts.liveLocator` to `require("live/locator")` when using `webpackerator/lib/webpack/defaults/extras/live`')
    process.exit(1)
  }

  config.merge({entry: {main: getEntryPoints(opts)}})

  if (opts.mainEntryPoint !== false)
    config.merge({entry: {main: [opts.mainEntryPoint]}})

  // Live
  addVendor(config, [
    'live',
    'live/init',
  ])

  // Configurize
  addAlias(config, {'configurize.browser.js': cwd('configurize.browser.js')})

  config.plugin('DefinePlugin', webpack.DefinePlugin, (current) => {
    if (!current.length) return current[0] = {}
    _.merge(current[0], {
      __SERVER__: false,
      __CLIENT__: true,
    })
    return current
  })

}
