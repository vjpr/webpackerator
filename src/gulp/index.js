//region Imports
const gutil = require('gulp-util')
const webpack = require('webpack')
const _ = require('lodash')
const cwd = require('cwd')
const replaceFile = require('./util/replaceFile')
const webpackerator = require('../webpack')
//endregion

const files = {}

function cliArgs(opts) {

  const yargs = require('yargs')

  // TODO(vjpr): List gulp tasks for webpack. Maybe use yargs commands.
  const argv = yargs.usage('webpack', {
    env: {
      description: 'Environment',
      alias: 'e',
      choices: ['production', 'development'],
      default: 'development',
    }
  }).argv

  opts = _.defaultsDeep({}, opts, {
    env: argv.env
  })

  return opts

}

export default function(gulp, opts = {}) {

  let compiler = null
  let webpackConfig = null

  gulp.task('webpack:get-config', (done) => {
    opts = cliArgs(opts)
    opts = webpackerator.parseOpts(opts)
    webpackConfig = webpackerator.getConfig(opts)
    compiler = webpackerator.getCompiler(webpackConfig)
    done()
  })

  gulp.task('webpack:dev-server', gulp.series('webpack:get-config', function webpackDevServer(done) {
    webpackerator.startWebpackDevServer(compiler, webpackConfig.devServer, opts, done)
  }))

  gulp.task('webpack:build', gulp.series('webpack:get-config', function webpackBuild(done) {
    webpackerator.build(compiler, opts, done)
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
