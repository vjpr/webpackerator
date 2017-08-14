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
      join(process.cwd(), './modules/react-toolbox-config/index.scss'),
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
    ['postcss-loader', {config: {path: join(process.cwd(), 'tools/postcss.config.js')}}],
    ['sass-loader', {}],
    // TODO(vjpr): Not sure...
    // TODO(vjpr): Different resources should be used for different contexts/files.
    // E.g. bootstrap vs. react-toolbox.
    ['sass-resources-loader', {resources: sassResources}],
  ]

  if (opts.useSassResources) {
    queries = changeLoaderOpts(queries, 'sass-resources-loader', null)
  }

  // TODO(vjpr): Not sure this will work with latest postcss-loader.
  if (opts.usePostCss) {
    const postCssCssNext = require('postcss-cssnext')
    config.merge({
      postcss: function() { return [autoprefixer, postCssCssNext] },
    })
  } else {
    queries = changeLoaderOpts(queries, 'postcss-loader', null)
  }

  // TODO(vjpr): Move to separate file.
  //config.loader('react-toolbox css', {
  //  test: /\.css$/,
  //  include: [/node_modules\/react-toolbox/],
  //  queries: changeLoaderOpts(queries, 'css-loader', [null, {module: true}]),
  //}, parseStyleLoaders({useExtractTextPlugin: opts.useExtractTextPlugin}))

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

