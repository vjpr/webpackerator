//region Imports
const WebpackDevServer = require('webpack-dev-server')
const cwd = require('cwd')
const logging = require('./logging')
const _ = require('lodash')
const webpack = require('webpack')
const chalk = require('chalk')
const debug = require('debug')('webpackerator:debug')
const log = require('debug')('webpackerator:log')
//endregion

class WebpackeratorUtils {

  // TODO(vjpr): Make static.
  parseOpts(opts) {

    // `process.cwd/webpackerator.js` config.

    const requireSource = chalk.bold(`require('${cwd('webpackerator.js')}').config`)
    log(`Reading webpackerator config from:`, requireSource)
    opts = _.defaultsDeep({}, opts, require(cwd('webpackerator.js')).config)

    // Gulp-specific config.

    opts = _.defaultsDeep({}, opts, {
      moduleDirectories: ['modules', 'node_modules', 'bower_components'],  // TODO(vjpr): Should be taken from .liverc.
      // TODO(vjpr): Deprecate - should use plugins instead.
      //beforeCompile: (compiler) => logging(compiler, opts.webpack),
      beforeCompile: (compiler) => {},
      env: null,
      hmr: true,
      cwd: cwd(),
      devServerUrl: 'http://localhost:8081',
      buildDir: 'build',
      filesToCopy: ['./index.html', './assets/**/*.*'],
    })

    return opts

  }

  getConfig(opts) {

    // Create helpers.
    ////////////////////////////////////////////////////////////////////////////
    // TODO(vjpr): Share across code base.

    _.defaultsDeep(opts, {helpers: this.getHelpers(opts)})

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
      log('webpack:compile', stats.toString({colors: true}))
      done()
    })

  }

  prettifyWebpackConfig(config) {
    const prettyConfig = _.clone(config, true)
    prettyConfig.plugins = config.plugins && config.plugins.map(p => {
      return {name: p.constructor.name, settings: p}
    })
    return require('prettyjson').render(prettyConfig)
  }

  // TODO(vjpr): Refactor these away! They are from legacy webpack configs.
  getHelpers(opts) {
    return {
      DEV: opts.env === 'development',
      TEST: opts.env === 'test',
      PROD: opts.env === 'production',

      HMR: opts.hmr,
      CWD: opts.cwd,
      DEV_SERVER_URL: opts.devServerUrl,
      MODULE_DIRS: opts.moduleDirectories,
      ALIAS: {},
      BUILD_DIR: opts.buildDir
    }
  }

}

module.exports = new WebpackeratorUtils

