//region Imports
const {Config} = require('../..')
const webpack = require('webpack')
const cwd = require('cwd')
const {join} = require('path')
const _ = require('lodash')
//endregion

module.exports = function(webpack, opts) {
  const config = new Config

  // Mutually exclusive environments.
  const {DEV, TEST, PROD} = opts.helpers
  const {HMR, CWD, DEV_SERVER_URL, MODULE_DIRS, ALIAS} = opts.helpers

  const sourceMap =
    'eval'
  //'source-map'
  //'cheap-source-map'
  //'cheap-module-source-map'
  //'eval-cheap-module-source-map'
  //'#inline-source-map'

  config.merge({
    cache: DEV,
    context: cwd(),
    watch: DEV,
    devtool: DEV ? sourceMap : null,
    debug: DEV,
  })

  // Stats
  //////////////////////////////////////////////////////////////////////////////

  config.merge({
    stats: {
      colors: true,
      reasons: DEV,
      errorDetails: true,
    }
  })

  // Output
  //////////////////////////////////////////////////////////////////////////////

  config.merge({

    output: {

      path: join(CWD, 'build/'),

      pathinfo: DEV,

      // Web server will serve files in the `devServer.contentBase` at this endpoint URL.
      // NOTE(vjpr): We must set this when running dev server otherwise
      //   our asssets will be relative to our production web server
      //   which *might* be running on a different port.
      publicPath: DEV ? `${DEV_SERVER_URL}/` : '/assets/',

      filename: '[name].bundle.js',

    },

  })

  // Module
  //////////////////////////////////////////////////////////////////////////////

  config.merge({

    module: {

      //
      // Contexts
      //

      // Disable handling of unknown requires
      unknownContextRegExp: /$^/,
      unknownContextCritical: false,

      // Disable handling of requires with a single expression
      exprContextRegExp: /$^/,
      exprContextCritical: false,

      wrappedContextCritical: true,

      // --

      //preLoaders:
      //  test: /\.js$/
      //  exclude: /node_modules/
      //  loader: 'eslint-loader'
      //]

      //noParse: [
      //join 'node_modules', 'socket.io-client'
      ///node_modules\/react\//
      ///node_modules\/react-router\//
      //]

    },

  })

  // Externals
  //////////////////////////////////////////////////////////////////////////////

  config.merge({

    externals: {
      leaflet: 'L',
      //'react': 'React',
    },

  })

  // Entry
  //////////////////////////////////////////////////////////////////////////////

  // Main
  ///////////

  config.merge((current) => {

    let out = []
    if (DEV) out = out.concat(`webpack-dev-server/client?${DEV_SERVER_URL}`)
    if (DEV && HMR) {
      out = out.concat('webpack/hot/only-dev-server') // Do not reload page if hot update fails.
      //out = out.concat('webpack/hot/dev-server') // Do reload on fail.
    }
    //out = out.concat(LiveWebpack.getEntryPoints()) // TODO(vjpr)
    return _.set({}, 'entry.main', out)

  })

  // Vendor
  ///////////

  config.merge({

    entry: {
      vendor: [
        'react',
        'core-js',
        'core-js/library',
        'react-bootstrap',
        'lodash',
        'react-dnd'
      ]
    }

  })

  // Resolve
  //////////////////////////////////////////////////////////////////////////////

  config.merge({

    resolve: {
      // Allow specifiying which files not to bundle in package.json.
      packageAlias: 'browser',
      // Allows us to require without extensions.
      extensions: ['', '.js', '.coffee'],
      // NOTE: Shared with node.js. using `app-module-path` module.
      modulesDirectories: MODULE_DIRS,
      alias: Object.assign({}, ALIAS, {
        // Allows use of `require.ensure` in Node.js.
        'isomorphic-ensure': 'isomorphic-ensure/mock',
        'raw-loader': 'isomorphic-ensure/mock',
        'json-loader': 'isomorphic-ensure/mock',
        'TweenLite': 'gsap/src/uncompressed/TweenLite',
      }),
    },

  })

  // Node
  //////////////////////////////////////////////////////////////////////////////

  config.merge({

    node: {
      fs: 'empty',
      // Because of problems with `debug` module.
      net: 'empty',
      global: 'window',
    },

  })

  return config.resolve()

}
