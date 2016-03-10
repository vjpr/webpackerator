module.exports = function(webpack, opts, config) {

  config.loader('fonts:woff', {test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'})
  config.loader('fonts:ttf', {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'})
  config.loader('fonts:eot', {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'})
  config.loader('fonts:svg', {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'})

}
