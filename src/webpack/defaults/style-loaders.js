//region Imports
const {Config} = require('../..')
//endregion

module.exports = (webpack, opts) => {

  const config = new Config

  const {DEV, TEST} = opts.helpers

  //////////////////////////////////////////////////////////////////////////////

  config.loader('css', {
    test: /\.css$/,
    loader: getCSSLoaders(DEV, null),
  })

  //////////////////////////////////////////////////////////////////////////////

  config.loader('less', {
    test: /\.less$/,
    loader: getCSSLoaders(DEV, 'less'),
  })

  return config.resolve()

}

////////////////////////////////////////////////////////////////////////////////

//AUTOPREFIXER_LOADER = "autoprefixer-loader?{browsers:#{JSON.stringify([
//  'Android 2.3',
//  'Android >= 4',
//  'Chrome >= 20',
//  'Firefox >= 24',
//  'Explorer >= 8',
//  'iOS >= 6',
//  'Opera >= 12',
//  'Safari >= 6'])}}"

const AUTOPREFIXER_LOADER = 'autoprefixer-loader'

////////////////////////////////////////////////////////////////////////////////

//const ReactStylePlugin = require('react-style-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

////////////////////////////////////////////////////////////////////////////////

//STYLE_LOADER = 'style-loader/useable'
const STYLE_LOADER = 'style-loader'

////////////////////////////////////////////////////////////////////////////////

// TODO!
// Note: For prerendering with extract-text-webpack-plugin you should use
// css-loader/locals instead of style-loader!css-loader in the prerendering
// bundle. It doesn't embed CSS but only exports the identifier mappings.

function getCSSLoaders(DEV, additionalLoaders) {

  const CSS_LOADER = DEV ?
    //'css-loader'
    //'css-loader?module&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
    //'css-loader?importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
    'css-loader?localIdentName=[name]__[local]___[hash:base64:5]'
    :
    'css-loader?minimize'

  //TODO: POSTCSS_LOADER ?
  //let cssLoaders = `${CSS_LOADER}!${AUTOPREFIXER_LOADER}`
  let cssLoaders = `${CSS_LOADER}`
  if (additionalLoaders) {
    cssLoaders += '!'
    cssLoaders += additionalLoaders
  }
  if (!DEV) {
    const loader = ExtractTextPlugin.extract(STYLE_LOADER, cssLoaders)
    return loader
  } else {
    return `${STYLE_LOADER}!${cssLoaders}`
  }

}

////////////////////////////////////////////////////////////////////////////////
