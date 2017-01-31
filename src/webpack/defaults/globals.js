import _ from 'lodash'
const debug = require('debug')('webpackerator:debug')

module.exports = (webpack, opts, config) => {

  // NOTE: The defines get set somewhere else. This allows us to modify them
  // without restarting webpack dev server.
  // Globals are also defined in `live/init`.
  config.plugin('DefinePlugin', webpack.DefinePlugin, (current) => {
    if (!current.length) current[0] = {}
    _.merge(current[0], {
      __SERVER__: false,
      __CLIENT__: true,
      // TODO(vjpr): This should be set in configurize to allow runtime changes.
      //__DEVTOOLS__: DEV, // Dev tools in DEV env.
      //__DEVTOOLS__: opts.reactDevTools, // DEBUG
      //__DEVTOOLS__: !(process.env.NODE_ENV === 'production'), // DEBUG
      'process.env': {
        // NOTE: Lots of libs like react depend on this. This is why we should not set it to `test`.
        NODE_ENV: JSON.stringify(opts.isProd ? 'production' : 'development')
      },
      // For `chalkline` module which depends on `process.stdout.isTTY`.
      'process.stdout': {

      },
      // For compatibility with Node.js.
      // TODO(vjpr): Could probably do it better if we thought about it for a bit.
      'global.__CLIENT__': true,
      'global.__LIVE_DISABLE_BABEL__': true,
    })
    debug('Defining globals: ', current[0])
    return current
  })

}
