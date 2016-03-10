const chalk = require('chalk')
const s = require('string')
class LoggingPlugin {

  constructor(opts) {
    this.opts = opts
  }

  apply(compiler) {

    let time

    // Log compilation.
    const timing = {}
    compiler.plugin('compilation', function(compilation) {

      //compilation.plugin('build-module', function(mod) {
      //  if (!mod.userRequest) {
      //    console.log(mod)
      //  } else {
      //    timing[mod.resource] = new Date
      //    console.log('userRequest', mod.userRequest)
      //    console.log('resource', mod.resource)
      //  }
      //})
      //compilation.plugin('succeed-module', function(mod) {
      //  const duration = new Date - timing[mod.resource]
      //  let str = s(duration + 'ms').padRight(5).s
      //  str = chalk.green(str)
      //  console.log(str, mod.userRequest)
      //})
      //compilation.plugin('revive-modules', (c) => {
      //  console.log('revive-modules')
      //})
      //compilation.plugin('normal-module-loader', (c) => {
      //  console.log('normal-module-loader')
      //})

      time = +new Date

      compilation.plugin('seal', function() {
        console.log('seal', +new Date - time)
        time = +new Date
      })
      compilation.plugin('optimize', function() {
        console.log('optimize', +new Date - time)
        time = +new Date
      })
      compilation.plugin('before-hash', function() {
        console.log('before-hash', +new Date - time)
        time = +new Date
      })
      compilation.plugin('before-chunk-assets', function() {
        console.log('before-chunk-assets', +new Date - time)
        time = +new Date
      })
      compilation.plugin('additional-chunk-assets', function() {
        console.log('additional-chunk-assets', +new Date - time)
        time = +new Date
      })
      compilation.plugin('optimize-chunk-assets', function(chunks, callback) {
        console.log('optimize-chunk-assets', +new Date - time)
        time = +new Date
        callback()
      })
      compilation.plugin('optimize-assets', function(assets, callback) {
        console.log('optimize-assets', +new Date - time)
        time = +new Date
        callback()
      })


    })

    compiler.plugin('emit', function(compilation, callback) {
      console.log('emit', +new Date - time)
      time = +new Date
      callback()
    })

    compiler.plugin('done', () => {
      console.log('done', +new Date - time)
      time = +new Date
    })

  }

}

