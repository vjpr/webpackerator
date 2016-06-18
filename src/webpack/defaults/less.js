const _ = require('lodash')
const {parseStyleLoaders} = require('./style')

const getOpts = (opts) =>
  _.defaults({}, opts, {
    minifyCss: opts.isProd,
    useExtractTextPlugin: opts.isProd,
  })

export default function(webpack, opts, config) {

  opts = getOpts(opts)

  const cssOpts = {
    localIdentName: '[name]__[local]___[hash:base64:5]',
    minimize: opts.minifyCss,
    module: false,
    importLoaders: 1, // TODO(vjpr): Maybe it should be 3 for the 3 loaders following this one.
  }

  config.loader('less', {
    test: /\.less$/,
    queries: [
      ['style', {}],
      ['css', cssOpts],
      ['less', {}]
    ]
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

}


