//region Imports
const _ = require('lodash')
const qs = require('qs')
const cwd = require('cwd')
const {addVendor} = require('./util')
//endregion

function getOpts(opts) {
  return _.defaults({}, opts, {
    reactHotReload: false, // TODO(vjpr): Deprecated. See `react-hot.js`.
    reactHMRE: opts.notProd,
    // TODO(vjpr): Super dangerous!!! Make it very easy to disable.
    // null means enabled (use default, which is the system temp dir).
    // undefined or omitted means disabled.
    // Do not use `true`.
    //cacheDirectory: null,
    cacheDirectory: cwd('tmp/babel-webpack-cache'),
    // TODO(vjpr): What is this? Might be for legacy plugin?
    hotReload: undefined,
    roots: [],
  })
}

module.exports = (webpack, opts, config) => {

  opts = getOpts(opts)

  config.loader('babel', {

    name: 'babel-loader', // So we can remove it from `wallaby.js` if we want to.

    test: [/\.js$/, /\.browser\.js$/],

    loaders: [
      opts.hotReload ? 'react-hot' : null,
      'babel?' + getBabelQueryString(opts),
    ].filter(Boolean),

    exclude: /(bower_components|node_modules)/,

    // We must manually include when using `npm link`ed packages, otherwise it will attempt to transpile these linked packages.
    // See more: https://github.com/gaearon/react-hot-loader/blob/master/docs/Troubleshooting.md#module-not-found-error-cannot-resolve-module-react-hot
    include: babelIncludeDirs(opts).filter(v => !v.endsWith('node_modules')),

  })

  addVendor(config, 'babel-preset-react-hmre')

}

function getBabelQueryString(opts) {

  return qs.stringify({

    plugins: undefined,

    presets: [
      'live',
      opts.reactHMRE ? 'react-hmre' : null,
    ].filter(Boolean),

    cacheDirectory: opts.cacheDirectory,

    cacheIdentifier: undefined, // Set for cache busting.

  }, {arrayFormat: 'brackets', encode: false, delimiter: ',', strictNullHandling: true})

}

function babelIncludeDirs(opts) {

  return opts.roots // TODO(vjpr): MODULE_DIRS contains `node_modules` which is bad!
    //.concat(['generated']) // TODO(vjpr): This can be removed - we don't use it anymore. But maybe we should instead of having `generated` inside `modules`.
    .map(v => process.cwd() + '/' + v) // Full paths.

}
