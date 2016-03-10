//region Imports
import _ from 'lodash'
import path from 'path'
import cwd from 'cwd'
//endregion

module.exports = (webpack, opts, config) => {

  //////////////////////////////////////////////////////////////////////////////

  //config.plugin('SourceMapDevToolPlugin', webpack.SourceMapDevToolPlugin, [
  //  '[file].map', // options
  //  null, // sourceMappingURLComment
  //  '[absolute-resource-path]', //moduleFilenameTemplate
  //  '[absolute-resource-path]' //fallbackModuleFilenameTemplate
  //])

  //////////////////////////////////////////////////////////////////////////////

  // NOTE: Dedupe plugin causes bug in vendor bundle.

  // Resolve entry points from npm and Bower package description files.
  //config.plugin('webpack-resolver', webpack.ResolverPlugin, [[
  //  new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main']),
  //  new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('package.json', ['main']),
  //], ['normal', 'loader']])

  //////////////////////////////////////////////////////////////////////////////

  // Pause when syntax error encountered. TODO(vjpr): Really??
  //if (DEV) config.plugin(webpack.NoErrorsPlugin)

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

  //config.plugin(webpack.WatchIgnorePlugin, [[/\.json$/]])

  //////////////////////////////////////////////////////////////////////////////

  //if (DEV) {
  //  const {StatsWriterPlugin} = require('webpack-stats-plugin')
  //  config.plugin('StatsWriterPlugin', StatsWriterPlugin, [{filename: 'webpack-stats.json', fields: null}])
  //}

  ////////////////////////////////////////////////////////////////////////////////

  // TODO(vjpr)
  //VersionRetrievalPlugin

  //////////////////////////////////////////////////////////////////////////////

  //config.plugin('LoggingPlugin', LoggingPlugin, [])

  //////////////////////////////////////////////////////////////////////////////


}
