const WebpackDevServer = require('webpack-dev-server')
const cwd = require('cwd')
const logging = require('./logging')
const _ = require('lodash')
const webpack = require('webpack')
const chalk = require('chalk')
const debug = require('debug')('webpackerator:debug')
const log = require('debug')('webpackerator:log')
const gutil = require('gulp-util')
const getConfig = require('modules/root-config').default
const getEnvironment = require('./util/getEnvironment')

class WebpackeratorUtils {

  // TODO(vjpr): Make static.
  parseOpts(opts) {

    // Config
    ////////////////////////////////////////////////////////////////////////////

    const {config, configPath} = getConfig('webpackerator')
    if (configPath) {
      log(`Reading webpackerator config from:`,
        chalk.bold(configPath) + '#config')
      opts = _.defaultsDeep({}, opts, config.config)
    } else {
      log(`Using default webpackerator config from:`, chalk.bold(__filename))
    }


    // Environment
    ////////////////////////////////////////////////////////////////////////////

    opts.env = getEnvironment(opts.env)

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

      mainEntryPoint: null,
      filesToCopy: ['./index.html', './assets/**/*.*'],
      reactDevTools: true,
      stats: {
        colors: true,
        chunks: true,
        errorDetails: true,
        reasons: true,
        modules: true, // TODO(vjpr): This was disabled before...does it impact performance?
      },
      showStatsAfterBuild: false, // Not dev-server. // We must always show errors!
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

    // TODO(vjpr): This should be synchronized with parseOpts.
    const {configPath} = getConfig('webpackerator')

    const module = require(configPath)

    console.log(opts, require.resolve('webpack'))

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

    // TODO(vjpr): `webpack/lib/RequestShortener` adds tildes for `node_modules`.
    //   This breaks clickable terminal links. We should override it.
    //   Actually, its okay, it provides un unshortened link too.

    try {
      new WebpackDevServer(compiler, devServerConfig)
        .listen(devServerConfig.port, devServerConfig.host, (e, stats) => {
          if (e) throw new gutil.PluginError('webpack:dev-server', e)
          return log('[webpack-dev-server]',
            `http://${devServerConfig.host}:${devServerConfig.port}/${devServerConfig.displayUrl}`)
          //done() // Never finish.
        })
    } catch (e) {
      console.log(e.message)
      console.log(e)
    }

  }

  build(compiler, opts, done) {

    opts.beforeCompile(compiler)
    compiler.run((e, stats) => {
      // FATAL
      if (e) {
        throw new gutil.PluginError('webpack:compile', e)
      }
      // WARNING
      const jsonStats = stats.toJson()
      console.log('errors', jsonStats.errors)
      if (stats.hasWarnings()) {
        // TODO(vjpr): Always show warnings regardless of settings.
        console.warn('WARNING:')
        jsonStats.warnings.map(w => console.log(w, '\n'))
      }
      // STATS
      // TODO(vjpr): Duplication.
      log('webpack:compile', stats.toString(opts.stats))
      if (opts.showStatsAfterBuild) {
        // Stats are the timings, chunks emitted, etc.
        // It can be pretty verbose
        console.log(stats.toString(opts.stats))
      }
      // SOFT ERRORS
      if (stats.hasErrors()) {
        // "soft errors" - module not found, etc.
        // TODO(vjpr): `stats.errorDetails` enabled should print when using toString.
        //   But we should show an error message here too.
        console.log(jsonStats.errors)
        throw new Error(jsonStats.errors)
      }

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

