const _ = require('lodash')
const {parseStyleLoaders} = require('./style')
const autoprefixer = require('autoprefixer')
import path, {join} from 'path'
const styleLoaderName = require('./style-loader-name')

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

  ////////////////////////////////////////////////////////////////////////////////

  // TODO(vjpr): Should be in bootstrap-loader.
  const sassResources = [
      join(process.cwd(), './modules/bootstrap-config/pre-customizations.scss'),
      require.resolve('bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss'),
      //'node_modules/bootstrap-sass/assets/stylesheets/bootstrap/mixins',
      join(process.cwd(), './modules/bootstrap-config/variables.scss'), // TODO(vjpr): Remove this.
      join(process.cwd(), './modules/bootstrap-config/customizations.scss'),
    ]

  ////////////////////////////////////////////////////////////////////////////////

  let queries = [
    [styleLoaderName, {}],
    //
    // TODO(vjpr)
    // Note: For prerendering with extract-text-webpack-plugin you should use
    // css-loader/locals instead of style-loader!css-loader in the prerendering
    // bundle. It doesn't embed CSS but only exports the identifier mappings.
    //
    // TODO(vjpr): importLoaders might have to be adjusted if we remove loaders.
    ['css-loader', _.merge({}, cssOpts, {importLoaders: 3})],
    ['postcss-loader', {}],
    ['sass-loader', {}],
    // TODO(vjpr): Not sure...
    ['sass-resources-loader', {resources: sassResources}],
  ]

  if (opts.useSassResources) {
    queries = changeLoaderOpts(queries, 'sass-resources-loader', null)
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
    exclude: undefined,
    queries: changeLoaderOpts(queries, 'css-loader', [null, {module: true}]),
  }, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

  // https://github.com/webpack/style-loader#reference-counted-api
  config.loader('useable.scss', {
    test: /\.useable\.scss$/,
    exclude: undefined,
    queries: changeLoaderOpts(queries, styleLoaderName, [`${styleLoaderName}/useable`, {}]),
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

