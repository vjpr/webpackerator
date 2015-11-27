const files = {}

function cliArgs(opts) {

  const _ = require('lodash')
  const yargs = require('yargs')

  // TODO(vjpr): List gulp tasks for webpack. Maybe use yargs commands.
  const argv = yargs.usage('webpack', {
    env: {
      description: 'Environment',
      alias: 'e',
      choices: ['production', 'development'],
      default: 'development',
    },
  }).argv

  opts = _.defaultsDeep({}, opts, {
    env: argv.env
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
    console.log(opts)
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

  gulp.task('webpack:bootstrap', (done) => {
    const replaceFile = require('./util/replaceFile')
    const cwd = require('cwd')

    async.forEachOf(files, function (value, key, done) {
      const dest = cwd(key)
      replaceFile(dest, value, done)
    }, done)
  })

}

files['webpack.config.js'] = `
console.warn('Please use webpackerator.js instead. It allows config variables to be passed in.')
process.exit()
`

files['webpackerator.js'] = `
// The default webpackerator gulp tasks call this function to get the config.
module.exports = function(webpack, opts) {
  var w = require('webpackerator')()
  var defaultConfig = require('webpackerator/defaults/webpackerator.js')(webpack, opts)
  w.merge(defaultConfig)
  // TODO: Customize here...
  return w.resolve()
}

// The default webpackerator gulp tasks use this for common configuration.
// You can also modify opts in the above function.
// See \`webpackerator/src/webpack/index\`.
module.exports.config = {

}
`
