function cliArgs(opts) {

  const _ = require('lodash')
  const yargs = require('yargs')

  // TODO(vjpr): List gulp tasks for webpack. Maybe use yargs commands.
  const argv = yargs.usage('webpack', {
    env: {
      description: 'Environment',
      alias: 'e',
      choices: ['production', 'development', 'test'],
      // No default because we will use process.env.NODE_ENV, process.env.TEST, etc. in parseOpts.
      //default: 'development',
    },
  }).argv

  opts = _.defaultsDeep({}, opts, {
    env: argv.env,
    devServerPort: argv.port,
  })

  return opts

}

// Allow a task to set the environment.
// TODO(vjpr): This is crazy. Must be a better way.
function gulpTaskArgs(gulp, opts) {
  const _ = require('lodash')
  return _.defaultsDeep({}, opts, {env: gulp.env})
}

export default function(gulp, opts = {}) {

  let compiler = null
  let webpackConfig = null

  gulp.task('webpack:get-config', (done) => {
    const webpackeratorUtils = require('../webpack')

    opts = gulpTaskArgs(gulp, opts)
    opts = cliArgs(opts)
    opts = webpackeratorUtils.parseOpts(opts)
    webpackConfig = webpackeratorUtils.getConfig(opts)
    compiler = webpackeratorUtils.getCompiler(webpackConfig)
    done()
  })

  gulp.task('webpack:dev-server', gulp.series('webpack:get-config', function webpackDevServer(done) {
    const webpackeratorUtils = require('../webpack')

    webpackeratorUtils.startWebpackDevServer(compiler, webpackConfig.devServer, opts, done)
  }))

  gulp.task('webpack:build', gulp.series('webpack:get-config', function webpackBuild(done) {
    const webpackeratorUtils = require('../webpack')

    webpackeratorUtils.build(compiler, opts, done)
  }))

  // TODO(vjpr)
  gulp.task('webpack:assets:copy-files', function() {
    return gulp.src(opts.webpack.srcFilesToCopy, {base: '.'})
      .pipe(gulp.dest(opts.webpack.buildDir))
  })
  // ---

  gulp.task('webpack', gulp.series('webpack:get-config', (done) => {
    yargs.showHelp()
    done()
  }))

}
