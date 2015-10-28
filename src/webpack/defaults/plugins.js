//region Imports
import _ from 'lodash'
const {Config} = require('../..')
//endregion

module.exports = (webpack, opts) => {

  const config = new Config

  const {DEV, PROD, HMR} = opts.helpers

  //////////////////////////////////////////////////////////////////////////////

  config.plugin('DefinePlugin', webpack.DefinePlugin, (current) => {
    const defines = {
      __SERVER__: false,
      __CLIENT__: true,
    }
    const allDefines = _.merge({}, defines) // TODO(vjpr): LiveWebpack.getDefines())
    console.log('Defining globals: ', allDefines)
    return [allDefines]
  })

  //////////////////////////////////////////////////////////////////////////////

  // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
  // TODO(vjpr): May need to be disabled because of problem with vendor and hot plugin.
  config.plugin('CommonsChunkPlugin', webpack.optimize.CommonsChunkPlugin, [{name: 'vendor'}])

  if (DEV && HMR) config.plugin('HotModuleReplacementPlugin', webpack.HotModuleReplacementPlugin)

  //////////////////////////////////////////////////////////////////////////////

  if (PROD) {
    const ExtractTextPlugin = require('extract-text-webpack-plugin')
    config.plugin('ExtractTextPlugin', ExtractTextPlugin, ['[name].bundle.css', {allChunks: true}])
  }

  //////////////////////////////////////////////////////////////////////////////

  const clientSideIgnores = ['iced-coffee-script', 'config', 'fs-extra']
  const regex = `^(${clientSideIgnores.join('|')})$`
  config.plugin('IgnorePlugin', webpack.IgnorePlugin, [new RegExp(regex)])

  //////////////////////////////////////////////////////////////////////////////

  config.plugin('ContextReplacementPlugin', webpack.ContextReplacementPlugin, [/moment[\/\\]locale$/, /en/])

  //////////////////////////////////////////////////////////////////////////////

  const ProgressBarPlugin = require('progress-bar-webpack-plugin')
  config.plugin('ProgressBarPlugin', ProgressBarPlugin, [])

  //////////////////////////////////////////////////////////////////////////////

  // NOTE: Dedupe plugin causes bug in vendor bundle.

  // Resolve entry points from npm and Bower package description files.
  //config.plugin('webpack-resolver', webpack.ResolverPlugin, [[
  //  new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main']),
  //  new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('package.json', ['main']),
  //], ['normal', 'loader']])

  //////////////////////////////////////////////////////////////////////////////

  // TODO(vjpr): BowerWebpackPlugin!

  //////////////////////////////////////////////////////////////////////////////

  //new ReactStylePlugin 'bundle.css'

  //////////////////////////////////////////////////////////////////////////////

  // Pause when syntax error encountered. TODO(vjpr): Really??
  //if (DEV) config.plugin(webpack.NoErrorsPlugin)

  //////////////////////////////////////////////////////////////////////////////

  // For dead code removal to allow conditionals that
  // prevent dynamic requires used in Node.js code which slows
  // everything down because of the size of contexts.
  // TODO(vjpr): Check speed.
  //if (PROD) config.plugin(webpack.optimize.UglifyJsPlugin, [{minimize: false])

  //////////////////////////////////////////////////////////////////////////////

  // Write stats file for debugging.
  //function() {
  //  //const id = require('uniqueid')
  //  const callback = function(stats) {
  //    require('fs').writeFileSync(
  //      //require('path').join(process.cwd(), `tmp/${id({prefix: 'stats'})}.json`),
  //      require('path').join(process.cwd(), `tmp/stats.json`),
  //      JSON.stringify(stats.toJson()))
  //  }
  //  this.plugin('done', _.once(callback))
  //}

  //////////////////////////////////////////////////////////////////////////////

  if (PROD) {
    //config.plugin('DedupePlugin', webpack.optimize.DedupePlugin)
    //config.plugin('UglifyJsPlugin', webpack.optimize.UglifyJsPlugin) // TODO(vjpr): Disabled to fix `__.type.global()` bug.
    //config.plugin('AggressiveMergingPlugin', webpack.optimize.AggressiveMergingPlugin)
  }

  //////////////////////////////////////////////////////////////////////////////

  //config.plugin(webpack.WatchIgnorePlugin, [[/\.json$/]])

  //////////////////////////////////////////////////////////////////////////////

  //const {StatsWriterPlugin} = require('webpack-stats-plugin')
  //out.push(new StatsWriterPlugin({filename: 'webpack-stats.json'}))

  //////////////////////////////////////////////////////////////////////////////

  return config.resolve()

}
