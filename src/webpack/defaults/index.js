module.exports = function(webpack, opts) {
  var {Config} = require('../..')
  var config = new Config
  config.merge(require('./dev-server')(webpack, opts))
  config.merge(require('./plugins')(webpack, opts))
  config.merge(require('./loaders')(webpack, opts))
  config.merge(require('./style-loaders')(webpack, opts))
  config.merge(require('./main')(webpack, opts))
  const merged = config.resolve()
  return merged
}
