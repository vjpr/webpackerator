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

  //config.plugin(webpack.WatchIgnorePlugin, [[/\.json$/]])

  //////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////

  // TODO(vjpr)
  //VersionRetrievalPlugin

  //////////////////////////////////////////////////////////////////////////////

  //config.plugin('LoggingPlugin', LoggingPlugin, [])

  //////////////////////////////////////////////////////////////////////////////


}
