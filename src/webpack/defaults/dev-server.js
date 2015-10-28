module.exports = function(webpack, opts) {

  //var Config = require('webpack-configurator')
  //var config = new Config

  const {CWD, HMR} = opts.helpers

  return {

    devServer: {

      // http server options
      ////////////////////////////////////////////////////////////////////////////

      port: 8081,
      host: 'localhost',
      displayUrl: 'webpack-dev-server/index.html',

      // general options
      ////////////////////////////////////////////////////////////////////////////

      //contentBase: join CWD, 'build/' // TODO(vjpr): Why?
      contentBase: CWD,
      // or: contentBase: 'http://localhost/',

      hot: HMR,
      // Enable special support for Hot Module Replacement
      // Page is no longer updated, but a 'webpackHotUpdate' message is send to the content
      // Use 'webpack/hot/dev-server' as additional module in your entry point
      // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

      // Set this as true if you want to access dev server from arbitrary url.
      // This is handy if you are using a html5 router.
      historyApiFallback: false,

      // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
      // Use '*' to proxy all paths to the specified server.
      // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
      // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
      //proxy: {
      //  '*': 'http://localhost:9090',
      //},

      // webpack-dev-middleware options
      ////////////////////////////////////////////////////////////////////////////

      // It suppress error shown in console, so it has to be set to false.
      quiet: false,

      // It suppress everything except error, so it has to be set to false as well
      // to see success build.
      noInfo: false,

      lazy: true,

      filename: 'bundle.js',

      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
      },

      publicPath: '/assets/',

      headers: {'X-Custom-Header': 'yes'},

      // Config for minimal console.log mess.
      stats: {
        colors: true,
        timings: true,
        chunks: true,
        chunkModules: false,
        version: false,
        assets: false,
        hash: false,
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

  }

}
