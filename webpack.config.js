
module.exports = function(webpack, opts) {
  var Config = require('webpack-configurator')
  var defaultConfig = require('babelator/defaults/webpack.config.js')(opts)
  var config = new Config(defaultConfig)
  // TODO: Customize here...
  return config.resolve()
}
