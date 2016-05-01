//region Imports
const {addVendor} = require('../util')
//endregion

// For the `bootstrap-loader` module.

module.exports = function(webpack, opts, config) {

  // bootstrap-sass@3
  const boostrapJavascriptRegex = /bootstrap-sass\/assets\/javascripts\//

  // bootstrap@3
  //const boostrapJavascriptRegex = /bootstrap\/js\//

  // bootstrap@4
  //const boostrapJavascriptRegex = /bootstrap\/dist\/js\/umd\//

  config.loader('bootstrap-webpack:import-jquery', {
    test: boostrapJavascriptRegex,
    loader: 'imports?jQuery=jquery',
  })

  config.merge({
    // TODO(vjpr): This is a bad dependency.
    sassResources: ['./modules/bootstrap-config/variables.scss'],
  })

  addVendor(config, [
    'bootstrap-sass',
    'bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss',
    'bootstrap-sass/assets/stylesheets/bootstrap/_mixins.scss',
    'bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.eot',
    'bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff2',
    'bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff',
    'bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.ttf',
    'bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.svg',
  ])

  //////////////////////////////////////////////////////////////////////////////
  // How is bootstrap-loader initialized?
  //////////////////////////////////////////////////////////////////////////////

  // NOTE(vjpr): `bootstrap-loader` is in the vendor bundle, and should be in your project's main entry point like so:-
  //
  //     process.env.NODE_ENV === 'production' ? require('bootstrap-loader/extractStyles') : require('bootstrap-loader')
  //

  // NOTE(vjpr): When `webpackerator` is `npm linked`, an error will be thrown saying that `extract-text-webpack-plugin` must be used with ExtractTextWebpackPlugin installed in config.
  // Not sure exactly what causes this, but be careful.

  //config.merge({entry: {main: [(opts.notProd ? 'bootstrap-loader' : 'bootstrap-loader/extractStyles')]}})

  addVendor(config, [(opts.notProd ? 'bootstrap-loader' : 'bootstrap-loader/extractStyles')])

}
