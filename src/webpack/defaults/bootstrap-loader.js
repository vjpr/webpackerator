//region Imports
const {addVendor} = require('./util')
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
    sassResources: ['./modules/bootstrap-config/variables.scss'],
  })

  addVendor(config, [(opts.notProd ? 'bootstrap-loader' : 'bootstrap-loader/extractStyles')])

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

  //config.merge({
  //  entry: {
  //    main: [
  //      // NOTE(vjpr): bootstrap-loader is now in vendor bundle, and your project's `src/client`.
  //      //(DEV ? 'bootstrap-loader' : 'bootstrap-loader/extractStyles'),
  //    ]
  //  }
  //})


}
