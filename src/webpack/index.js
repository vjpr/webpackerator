//region Imports
const WebpackDevServer = require('webpack-dev-server')
const cwd = require('cwd')
const logging = require('./logging')
const _ = require('lodash')
const webpack = require('webpack')
const chalk = require('chalk')
const debug = require('debug')('webpackerator:debug')
const log = require('debug')('webpackerator:log')
const gutil = require('gulp-util')
//endregion

class WebpackeratorUtils {

  // TODO(vjpr): Make static.
  parseOpts(opts) {

    // `[process.cwd]/webpackerator.js` config.
    ////////////////////////////////////////////////////////////////////////////

    const requireSource = chalk.bold(`require('${cwd('webpackerator.js')}').config`)
    log(`Reading webpackerator config from:`, requireSource)
    opts = _.defaultsDeep({}, opts, require(cwd('webpackerator.js')).config)

    // Environment
    ////////////////////////////////////////////////////////////////////////////

    if (_(['production', 'development', 'test']).includes(opts.env)) {

      // 1. Try set from `opts` parameter.
      // This may be from cli, gulp global, or direct call of `parseOpts` from a test.

      console.log('Setting env from opts (cli, `gulp.env`, or `parseOpts(opts)`):', opts.env)

    } else if (process.env.NODE_ENV && _(['production', 'development', 'test']).includes(process.env.NODE_ENV)) {

      // 2. process.env.NODE_ENV
      // TODO(vjpr): If we are using `.env`, process.env.NODE_ENV might be set inside that file.

      opts.env = process.env.NODE_ENV
      console.log('Setting env from `process.env.NODE_ENV`:', opts.env)

    } else if (Boolean(process.env.TEST)) { // TODO(vjpr): Deprecate.

      // 3. process.env.TEST

      opts.env = 'test'
      console.log('Setting env from `process.env.TEST`:', opts.env)

    } else {

      // 4. If env is not set, set to `development`.

      opts.env = 'development'
      console.log('No env specified. Setting default:', opts.env)

    }

    ////////////////////////////////////////////////////////////////////////////
    // process.env.NODE_ENV
    ////////////////////////////////////////////////////////////////////////////

    process.env.NODE_ENV = opts.env

    ////////////////////////////////////////////////////////////////////////////
    // Convenience
    ////////////////////////////////////////////////////////////////////////////

    const isProd = opts.env === 'production'
    const notProd = !isProd
    const isTest = opts.env === 'test'
    const notTest = !isTest
    const isDev = opts.env === 'development'
    const notDev = !isDev

    ////////////////////////////////////////////////////////////////////////////

    // Gulp-specific config.
    // TODO(vjpr): Does this still make sense?
    ////////////////////////////////////////////////////////////////////////////

    const makeDll = process.env.MAKE_DLL

    ////////////////////////////////////////////////////////////////////////////
    // dev-server defaults
    ////////////////////////////////////////////////////////////////////////////

    const devServerHost = 'localhost'

    // TODO(vjpr): Find next available dev-server port.
    // However, this may mean we have to recompile dll...
    const devServerPort = 8081

    //const devServerUrl = devServerHost + ':' + devServerPort

    // This is the default path webpack-dev-server uses.
    const devServerUrl = '/sockjs-node'

    // If using our dev-server proxying module.
    //const devServerUrl = '/webpack-dev-server-proxy/sockjs-node'

    // Uses relative server path.
    // Used for setting webpack hot module reloading socket.io path.
    //const devServerUrl = ''

    ////////////////////////////////////////////////////////////////////////////

    opts = _.defaultsDeep({}, opts, {
      notProd, // TODO(vjpr): NODE_ENV should be set automatically.
      isProd,
      isTest,
      notTest,
      isDev,
      notDev,
      env: null,
      cwd: cwd(),
      beforeCompile: (compiler) => {},
      buildDir: 'build',
      buildPath: cwd('build/'),
      roots: ['modules', 'node_modules', 'bower_components'],  // TODO(vjpr): Should be taken from .liverc.

      devServerHost,
      devServerPort,
      devServerUrl,

      mainEntryPoint: './lib/client.js',
      filesToCopy: ['./index.html', './assets/**/*.*'],
      reactDevTools: true,
      stats: {colors: true, chunks: true},
      showStatsAfterBuild: true, // Not dev-server. // We must always show errors!
      liveLocator: null,
      minifyJs: isProd,
      minifyCss: isProd,
      compileVendorDll: Boolean(notTest && makeDll),
      vendorChunkOrDll: (notProd && notTest) ? 'dll' : 'chunk', // dll or chunk
      enableHotModuleReplacement: notProd,
      //devServerUrl: 'http://localhost:8081',
      //webpack: {logging: {timings: true}},
      //cacheDirectory: null,
      // TODO(vjpr): Deprecate - should use plugins instead.
      //beforeCompile: (compiler) => logging(compiler, opts.webpack),
      //beforeCompile: (compiler) => {},
    })

    return opts

  }

  getConfig(opts) {

    // `webpackerator.js`.
    ////////////////////////////////////////////////////////////////////////////

    log('Using webpackerator:', cwd('webpackerator.js'))
    const module = require(cwd('webpackerator.js'))
    const webpackConfig = module(webpack, opts)

    // Print resolved config.
    ////////////////////////////////////////////////////////////////////////////

    debug(this.prettifyWebpackConfig(webpackConfig))

    return webpackConfig

  }

  getCompiler(webpackConfig) {

    const webpack = require('webpack')
    return webpack(webpackConfig)

  }

  startWebpackDevServer(compiler, devServerConfig, opts, done) {

    opts.beforeCompile(compiler)
    new WebpackDevServer(compiler, devServerConfig)
      .listen(devServerConfig.port, devServerConfig.host, (e, stats)  => {
        if (e) throw new gutil.PluginError('webpack:dev-server', e)
        return log('[webpack-dev-server]', `http://${devServerConfig.host}:${devServerConfig.port}/${devServerConfig.displayUrl}`)
        //done() // Never finish.
      })

  }

  build(compiler, opts, done) {

    opts.beforeCompile(compiler)
    compiler.run((e, stats) => {
      if (e) throw new gutil.PluginError('webpack:compile', e)
      if (opts.showStatsAfterBuild) {
        console.log(stats.toString(opts.stats))
      }
      log('webpack:compile', stats.toString(opts.stats))
      done()
    })

  }

  prettifyWebpackConfig(config) {
    const prettyConfig = _.clone(config, true)
    // TODO(vjpr): This function needs to be ignored by eslint because IntelliJ auto-format messes it up.
    prettyConfig.plugins = config.plugins && config.plugins.map(p => {
      return {name: p.constructor.name, settings: p}
    })
    return require('prettyjson').render(prettyConfig)
  }

}

module.exports = new WebpackeratorUtils

