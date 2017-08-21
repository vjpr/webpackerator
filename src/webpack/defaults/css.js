const _ = require('lodash')
const {parseStyleLoaders} = require('./style')
const styleLoaderName = require('./style-loader-name')
const {join} = require('path')

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
    // TODO(vjpr): Do we need to ignore node_modules?
    exclude: [
      /node_modules\/react-toolbox/,
      /modules\/react-toolbox-config/,
      /flexboxgrid/,
    ],
    queries: [
      [styleLoaderName, {}],
      ['css-loader', cssOpts],
      //['postcss-loader', {config: {path: join(process.cwd(), 'tools/postcss.config.js')}}],
    ]
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

  config.loader('pcss', {
    name: 'postcss-loader',
    test: /\.pcss$/,
    // TODO(vjpr): Do we need to ignore node_modules?
    queries: [
      [styleLoaderName, {}],
      ['css-loader', cssOpts],
      ['postcss-loader', {config: {path: join(process.cwd(), 'tools/postcss.config.js')}}],
    ]
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

  // TODO(vjpr): Move to separate file.
  config.loader('react-toolbox css', {
    name: 'css-loader',
    test: /\.css$/,
    // TODO(vjpr): Does this work?
    include: [/node_modules\/react-toolbox/, /modules\/react-toolbox-config/],
    queries: [
      [styleLoaderName, {}],
      ['css-loader', {...cssOpts, module: true, importLoaders: 1}],
      ['postcss-loader', {config: {path: join(process.cwd(), 'tools/postcss.config.js')}}],
    ]
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

  //config.loader('flexbox css', {
  //  name: 'css-loader',
  //  test: /\.css$/,
  //  // TODO(vjpr): Do we need to ignore node_modules?
  //  include: [/flexboxgrid/],
  //  queries: [
  //    [styleLoaderName, {}],
  //    ['css-loader', {...cssOpts, module: true}],
  //  ]
  //}, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

}
