//region Imports
const _ = require('lodash')
const {parseStyleLoaders} = require('./style')
//endregion

const getOpts = (opts) =>
  _.defaults({}, opts, {
    minifyCss: opts.isProd,
    useExtractTextPlugin: opts.isProd,
  })

// For existing plain css files from other libraries.
export default function(webpack, opts, config) {

  opts = getOpts(opts)

  const cssOpts = {
    module: false,
    minimize: opts.minifyCss,
    importLoaders: 0,
  }

  config.loader('css', {
    test: /\.css$/,
    queries: [
      ['style', {}],
      ['css', cssOpts],
    ]
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

}
