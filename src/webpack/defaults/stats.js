//region Imports
import path, {join} from 'path'
//endregion

export default function(webpack, opts, config) {

  let filename
  if (opts.compileVendorDll) {
    filename = 'webpack-assets-vendor-dll.json'
  } else if (opts.isDebug) {
    filename = 'webpack-assets.json'
  } else if (opts.isProd) {
    filename = 'webpack-assets.prod.json'
  }

  const AssetsPlugin = require('assets-webpack-plugin')
  config.plugin('AssetsPlugin', AssetsPlugin, [{
    path: opts.buildDir,
    filename,
  }])

}

//////////////////////////////////////////////////////////////////////////////

// Not working.

//const {StatsWriterPlugin} = require('webpack-stats-plugin')
//config.plugin('StatsWriterPlugin', StatsWriterPlugin, [{
//  filename: 'webpack-stats.json',
//  //fields: null,
//}])


//////////////////////////////////////////////////////////////////////////////

// Write stats file for debugging.
//function() {
//  //const id = require('uniqueid')
//  const callback = function(stats) {
//    require('fs').writeFileSync(
//      //require('path').join(process.cwd(), `tmp/${id({prefix: 'stats'})}.json`),
//      require('path').join(process.cwd(), `tmp/stats.json`),
//      JSON.stringify(stats.toJson()))
//  }
//  this.plugin('done', _.once(callback))
//}

////////////////////////////////////////////////////////////////////////////////
