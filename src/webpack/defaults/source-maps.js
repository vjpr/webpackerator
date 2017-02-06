import _ from 'lodash'
import webpack from 'webpack'

module.exports = function(webpack, opts, config) {

  opts = _.defaults({}, opts, {
    //sourceMap: null,
    //sourceMap: 'eval',
    //sourceMap: 'source-map',
    //sourceMap: 'cheap-source-map',
    //sourceMap: 'cheap-module-source-map',
    //sourceMap: 'eval-cheap-module-source-map',
    // NOTE: The `#` prefix is for https://github.com/webpack/webpack/issues/91.
    sourceMap: '#inline-eval-cheap-source-map',
    //sourceMap: '#inline-source-map',
    //sourceMap: 'source-map'
  })

  // Source maps for user code.

  const devtool = opts.notProd ? opts.sourceMap : null

  config.merge({
    devtool,
  })

  // Source maps for library code.

  // NOTE: If you see "Cannot resolve file or dir..." then it could be
  //   because the sourceRoot inside the `.map` files is incorrect.

  // NOTE: If we try to run this without source maps enabled we get an error from `source-map` module.
  if (devtool) {

    config.preLoader('source-map', {
      test: /\.js$/,
      // TODO(vjpr): This may affect performance so only use for source files
      //   that have source maps we care about. E.g. `live-*`.
      include: [/node_modules/],
      //include: (p) => {},
      loader: 'source-map-loader',
    })

  }

  // Use this plugin for configuring how source maps are generated.

  //config.plugin(webpack.SourceMapDevToolPlugin, [{
  //  //// asset matching
  //  //test: string | RegExp | Array,
  //  //include: string | RegExp | Array,
  //  //exclude: string | RegExp | Array,
  //  //
  //  //// file and reference
  //  //filename: string,
  //  //append: false | string,
  //  //
  //  //// sources naming
  //  //moduleFilenameTemplate: string,
  //  //fallbackModuleFilenameTemplate: string,
  //  //
  //  //// quality/performance
  //  //module: bool,
  //  //columns: bool,
  //  //lineToLine: bool | object
  //}])

}
