const {addVendor} = require('../util')
import path, {join} from 'path'

// For the `bootstrap-loader` module.

const bootstrapLoaderName = '@vjpr/bootstrap-loader'

export default function(webpack, opts, config) {

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

  // TODO(vjpr): Should sass-resource-loader use webpack resolve settings?
  config.merge({
    // TODO(vjpr): These are bad dependency. Revisit.
    //
    // From https://github.com/shakacode/sass-resources-loader:
    //  - Do not include anything that will be actually rendered in CSS, because it will be added to every imported SASS file.
    //  - Do not use SASS @import inside resources files. Add imported files directly in sassResources array in webpack config instead.
    //
    sassResources: [
      join(process.cwd(), './modules/bootstrap-config/pre-customizations.scss'),
      require.resolve('bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss'),
      //'node_modules/bootstrap-sass/assets/stylesheets/bootstrap/mixins',
      join(process.cwd(), './modules/bootstrap-config/variables.scss'), // TODO(vjpr): Remove this.
      join(process.cwd(), './modules/bootstrap-config/customizations.scss'),
    ],
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

  // Instead of the following we include the file using a require statement in code.
  //config.merge({entry: {main: [(opts.notProd ? 'bootstrap-loader' : 'bootstrap-loader/extractStyles')]}})

  addVendor(config, [(opts.notProd ? bootstrapLoaderName : `${bootstrapLoaderName}/extractStyles`)])

}

export function finalize(webpack, opts, config) {

  // Move bootstrap-loader to the top.
  config.merge(current => {
    const el = `${bootstrapLoaderName}/extractStyles`
    if (current.entry.vendor.some(item => item === el)) {
      current.entry.vendor = current.entry.vendor.filter(item => item !== el)
      current.entry.vendor.unshift(el)
    }
    return current
  })

}
