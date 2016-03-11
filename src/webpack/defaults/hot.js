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

    // This will try to GET hot updates from the `opts.devServerUrl`.
    config.merge({entry: {main: [`webpack-dev-server/client?${opts.devServerUrl}`]}})

    config.plugin('HotModuleReplacementPlugin', webpack.HotModuleReplacementPlugin)

    // a. Do not reload page if hot update fails.
    config.merge({entry: {main: ['webpack/hot/only-dev-server']}})
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
