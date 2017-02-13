const _ = require('lodash')
const {parseStyleLoaders} = require('./style')
const styleLoaderName = require('./style-loader-name')

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
    name: 'css-loader',
    test: /\.css$/,
    queries: [
      [styleLoaderName, {}],
      ['css-loader', cssOpts],
    ]
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

}
