//region Imports
const getEntryPoints = require('./get-live-framework-entry-points')
const {addVendor} = require('../util')
//endregion

export default function(webpack, opts, config) {

  if (!opts.liveLocator) {
    console.error('You must set `opts.liveLocator` to `require("live/locator")` when using `webpackerator/lib/webpack/defaults/extras/live`')
    process.exit(1)
  }

  config.merge({entry: {main: getEntryPoints(opts)}})

  // TODO(vjpr): Does this need to be in lib, and not in modules?
  //   I think its here just because we want it next to `server.js`.
  config.merge({entry: {main: ['./lib/client.js']}})

  // Live
  addVendor(config, [
    'live',
    'live/init',
  ])

}
