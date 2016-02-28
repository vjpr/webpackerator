// To allow predefined plugins to be toggled from `[cwd]/webpackerator.js`.

//region Imports
const _ = require('lodash')
const s = require('string')
const chalk = require('chalk')
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

}
