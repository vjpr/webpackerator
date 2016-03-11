//region Imports
import _ from 'lodash'
//endregion

module.exports = (webpack, opts, config) => {

  if (opts.enableHotModuleReplacement) {

    config.merge({
      entry: {
        main: [
          // This will try to GET hot updates from the `opts.devServerUrl`.
          `webpack-dev-server/client?${opts.devServerUrl}`
        ]
      }
    })

    config.merge({
      entry: {
        main: [
          // necessary for hot reloading with IE.
          'eventsource-polyfill',
        ]
      }
    })

    config.plugin('HotModuleReplacementPlugin', webpack.HotModuleReplacementPlugin)

    config.merge({
      entry: {
        main: ['webpack/hot/only-dev-server'], // Do not reload page if hot update fails.
        //main: ['webpack/hot/dev-server'], // Do reload on fail.
      }
    })

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
