//region Imports
import _ from 'lodash'
const {addVendor} = require('./util')
//endregion

module.exports = (webpack, opts, config) => {

  if (opts.enableHotModuleReplacement) {

    // Necessary for hot reloading with IE.
    // TODO(vjpr): Need to resolve it. Otherwise it won't be found unless in app's node_modules.
    //config.merge({entry: {main: ['eventsource-polyfill']}})
    //addVendor(config, ['eventsource-polyfill'])

    addVendor(config, [
      //'webpack-dev-server', // NOTE: This brings in `express`. We don't want that.
      'webpack-dev-server/client',
      `webpack-dev-server/client?${opts.devServerUrl}`, // TODO(vjpr): This seems redundant. Having it in main entry point and here.
      //'webpack/hot/only-dev-server', // NOTE: Including this will break hot-updates!
    ])

    // This will try to GET hot updates from the `opts.devServerUrl`.
    config.merge({entry: {main: [`webpack-dev-server/client?${opts.devServerUrl}`]}})

    config.plugin('HotModuleReplacementPlugin', webpack.HotModuleReplacementPlugin)

    // a. Do not reload page if hot update fails.
    // NOTE: We use require.resolve because we want to use the local
    //   node_modules instead of the root.
    const onlyDevServer = require.resolve('webpack/hot/only-dev-server')
    config.merge({entry: {main: [onlyDevServer]}})

    // b. Do reload on fail.
    //config.merge({entry: {main: ['webpack/hot/dev-server']}})

    config.merge({
      devServer: {
        // Enable special support for Hot Module Replacement
        // Page is no longer updated, but a 'webpackHotUpdate' message is send to the content
        // Use 'webpack/hot/dev-server' as additional module in your entry point
        // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.
        hot: true,
      }
    })

  }

}
