import path, {join} from 'path'

// TODO(vjpr): Should be shared with `live-frontend`.
function getAssetManifestFilename({compileVendorDll, vendorChunkOrDll, env}) {
  let filename = `webpack-assets`
  if (compileVendorDll) {
    filename += '.vendor-dll'
  } else {
    filename += `.vendor-as-${vendorChunkOrDll}`
  }
  filename += `.${env}.json`
  return filename
}

export default function(webpack, opts, config) {

  const filename = getAssetManifestFilename(opts)
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
