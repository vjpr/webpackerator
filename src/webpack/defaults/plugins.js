import _ from 'lodash'
import path from 'path'
import cwd from 'cwd'

module.exports = (webpack, opts, config) => {

  // https://github.com/bholloway/resolve-url-loader/issues/33#issuecomment-249830601
  // This LoaderOptionsPlugin simulates the options which where previously given to the plugin via loader.options.
  config.plugin('LoaderOptionsPlugin', webpack.LoaderOptionsPlugin, [{
    context: process.cwd(), // TODO(vjpr): Needed?
    debug: true,  // TODO(vjpr): Needed?
    options: {
      //context: __dirname,
      context: process.cwd(),
      //debug: true,
      output: {
        // NOTE Without this resolve-url-plugin failed.
        // https://github.com/bholloway/resolve-url-loader/issues/36

        // TODO(vjpr): This should be shared with main.js.
        path: path.join(process.cwd(), 'build')
      }
    }
  }])

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
