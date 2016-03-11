//region Imports
import _ from 'lodash'
const {addVendor} = require('./util')
//endregion

module.exports = function(webpack, opts, config) {

  opts = _.defaults({}, opts, {
    devServerPort: 8081,
    devServerHost: 'localhost',
    devServerDisplayUrl: 'webpack-dev-server/index.html',
    devServerContentBase: opts.cwd,
  })

  addVendor(config, [
    'webpack-dev-server',
    'webpack-dev-server/client',
    'webpack-dev-server/client?/webpack-dev-server-proxy/sockjs-node',
    //'webpack/hot/only-dev-server', // NOTE: Including this will break hot-updates!
  ])

  config.merge({

    devServer: {

      // http server options
      ////////////////////////////////////////////////////////////////////////////

      port: opts.devServerPort,
      host: opts.devServerHost,
      displayUrl: opts.devServerDisplayUrl,

      // general options
      ////////////////////////////////////////////////////////////////////////////

      //contentBase: join CWD, 'build/' // TODO(vjpr): Why?
      contentBase: opts.devServerContentBase,
      // or: contentBase: 'http://localhost/',

      hot: undefined, // See `./react-hot.js`.

      // Set this as true if you want to access dev server from arbitrary url.
      // This is handy if you are using a html5 router.
      historyApiFallback: false,

      // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
      // Use '*' to proxy all paths to the specified server.
      // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
      // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
      //proxy: {
      //  '*': 'http://localhost:3000',
      //},

      // webpack-dev-middleware options
      ////////////////////////////////////////////////////////////////////////////

      // It suppress error shown in console, so it has to be set to false.
      quiet: false,

      // It suppress everything except error, so it has to be set to false as well
      // to see success build.
      noInfo: false,

      //lazy: true,

      //filename: 'bundle.js',

      // See https://github.com/webpack/watchpack#api.
      watchOptions: {
        //aggregateTimeout: 300,
        poll: undefined, // Use native watching methods.
      },

      // E.g.
      // http://<host>:<port>/<publicPath>/foo.js -> (from filesystem) <contentBase>/foo.js
      publicPath: '/build/',

      headers: {'X-Custom-Header': 'yes'},

      // Config for minimal console.log mess.
      //stats: 'errors-only',

      stats: {
        colors: true,
        timings: true,
        chunks: true,

        // Disable logs.
        chunkModules: false,
        version: false,
        assets: false,
        hash: false,

        // Enable logs.
        //chunkModules: true,
        //version: true,
        //assets: true,
        //hash: true,
      },

      // other options
      ////////////////////////////////////////////////////////////////////////////

      //compress
      //setup
      //features
      //https
      //key
      //cert
      //ca

    }

  })

}
