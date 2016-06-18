const _ = require('lodash')
const {parseStyleLoaders} = require('./style')
const autoprefixer = require('autoprefixer')

const getOpts = (opts) =>
  _.defaultsDeep({}, opts, {
    minifyCss: opts.isProd,
    useExtractTextPlugin: opts.isProd,
    scss: {
      usePostCss: true,
      useSassResources: true,
    }
  })

// sass, sass-resources, and postcss.
export default function(webpack, opts, config) {

  opts = getOpts(opts)

  const cssOpts = {
    localIdentName: '[name]__[local]___[hash:base64:5]',
    minimize: opts.minifyCss,
    module: false,
    importLoaders: 3,
  }

  let queries = [
    ['style', {}],
    //
    // TODO(vjpr)
    // Note: For prerendering with extract-text-webpack-plugin you should use
    // css-loader/locals instead of style-loader!css-loader in the prerendering
    // bundle. It doesn't embed CSS but only exports the identifier mappings.
    //
    // TODO(vjpr): importLoaders might have to be adjusted if we remove loaders.
    ['css', _.merge({}, cssOpts, {importLoaders: 3})],
    ['postcss-loader', {}],
    ['sass', {}],
    ['sass-resources', {}],
  ]

  if (opts.useSassResources) {
    queries = changeLoaderOpts(queries, 'sass-resources', null)
  }

  if (opts.usePostCss) {
    config.merge({
      postcss: function() { return [autoprefixer] },
    })
  } else {
    queries = changeLoaderOpts(queries, 'postcss-loader', null)
  }

  config.loader('global.scss', {
    test: /\.scss$/,
    exclude: [/\.module\.scss$/, /bootstrap-config\//],
    queries: queries,
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

  config.loader('module.scss', {
    test: /\.module\.scss$/,
    exclude: null,
    queries: changeLoaderOpts(queries, 'css', [null, {module: true}]),
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

  // https://github.com/webpack/style-loader#reference-counted-api
  config.loader('useable.scss', {
    test: /\.useable\.scss$/,
    exclude: null,
    queries: changeLoaderOpts(queries, 'style', ['style/useable', {}]),
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))


}

// Convenience function to modify loader name or opts.
function changeLoaderOpts(queries, loaderKey, val = [null, null]) {
  // If val is null then remove the loader.
  if (val === null) return queries.filter(k => k !== loaderKey)
  // Make changes to the loader.
  const [newKey, newVal] = val
  return queries.map(([k, v]) =>
    k === loaderKey ? [newKey ? newKey : loaderKey, _.merge({}, v, newVal)] : [k, v]
  )
}

