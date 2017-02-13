const _ = require('lodash')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const styleLoaderName = require('./style-loader-name')

function getOpts(opts) {
  return _.defaults({}, opts, {
    minifyCss: opts.isProd,
    useExtractTextPlugin: opts.isProd,
  })
}

export let extractTextPlugin

export default function(webpack, opts, config) {

  opts = getOpts(opts)

  extractTextPlugin = new ExtractTextPlugin({
    filename: '[name].bundle.css',
    //id: 1, // Deprecated in v2.
    allChunks: true,
    //allChunks: false,
    //disable: !DEV,
    // TODO(vjpr): Cache-busting - need to use the stats plugin.
    //filename: '[hash]-[chunkhash]-[contenthash]-[name]',
    // --
  })

  if (opts.useExtractTextPlugin)
    config.merge({plugins: [extractTextPlugin]})

}

// `[ ['style', {}], ['css', {minimize: true}] ]` -> `style!css?{minimize:true}`
export function makeLoadersQueryString(queries) {
  return queries.map(([name, options], i) => {
    // TODO(vjpr): Ensure `options` is an object to prevent zalgo.
    const loaderHasProps = Object.keys(options).length
    return name + (loaderHasProps ? '?' + JSON.stringify(options) : '')
  })
}

//
// E.g.
// Dev => style!css!sass
// Prod (when extracting to CSS files) => css!sass
// Prod (when allChunks=false, non-primary chunks are not extracted) => style!css!sass
//
export function parseStyleLoaders(opts) {

  opts = _.defaults({}, opts, {
    extractTextPlugin: extractTextPlugin,
    useExtractTextPlugin: false,
  })

  return (config) => {
    if (opts.useExtractTextPlugin)
      _(config.queries).remove(([name]) => name === styleLoaderName).value()
    const loaders = makeLoadersQueryString(config.queries)
    config.loader = opts.useExtractTextPlugin
      ? opts.extractTextPlugin.extract({
        fallback: styleLoaderName,
        use: loaders,
      })
      : loaders
    return config
  }

}
