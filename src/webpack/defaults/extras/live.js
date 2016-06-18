const _ = require('lodash')
const cwd = require('cwd')
const getEntryPoints = require('../../util/get-live-framework-entry-points')
const {addVendor, addAlias} = require('../util')

export default function(webpack, opts, config) {

  opts = _.defaults({}, opts, {
    mainEntryPoint: null,
  })

  if (!opts.liveLocator) {
    console.error('You must set `opts.liveLocator` to `require("live/locator")` when using `webpackerator/lib/webpack/defaults/extras/live`')
    process.exit(1)
  }

  config.merge({entry: {main: getEntryPoints(opts)}})

  if (opts.mainEntryPoint)
    config.merge({entry: {main: [opts.mainEntryPoint]}})

  // Live
  addVendor(config, [
    'live',
    'live/init',
  ])

  config.plugin('DefinePlugin', webpack.DefinePlugin, (current) => {
    if (!current.length) return current[0] = {}
    _.merge(current[0], {
      __SERVER__: false,
      __CLIENT__: true,
    })
    return current
  })

}
