//region Imports
const _ = require('lodash')
//endregion

module.exports = function(compiler, opts) {

  opts = _.defaultsDeep({}, opts, {
    webpack: {
      logging: {
        progressBar: false,
        verbose: false,
        timings: false,
      }
    }
  })


  if (opts.webpack.logging.progressBar) {
    progressBar(compiler)
  }

  if (opts.webpack.logging.verbose) {

    const ProgressPlugin = require('webpack/lib/ProgressPlugin')
    let start
    compiler.apply(new ProgressPlugin(function(percentage, msg) {
      console.log((percentage * 100).toFixed(0) + '%', msg, new Date - start + 'ms')
      start = new Date
    }))

  }

  if (opts.webpack.logging.timings) {
    timings(compiler)
  }

}

function progressBar(compiler) {

  var ProgressBar = require('progress')

  var bar = new ProgressBar(':bar', {total: 100})

  const ProgressPlugin = require('webpack/lib/ProgressPlugin')
  compiler.apply(new ProgressPlugin(function(percentage, msg) {
    console.log((percentage * 100).toFixed(0) + '%', msg, new Date - start + 'ms')
  }))

}

function timings(compiler) {

  // Log compilation.
  const timing = {}
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('build-module', function(mod) {
      timing[mod.resource] = new Date
      //console.log(mod.userRequest)
      //console.log(mod.resource)
    })
    compilation.plugin('succeed-module', function(mod) {
      const duration = new Date - timing[mod.resource]
      let str = s(duration + 'ms').padRight(5).s
      str = chalk.green(str)
      console.log(str, mod.userRequest)
    })
  })

}
