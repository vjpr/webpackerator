/* @flow weak */
//region Imports
import path from 'path'
import cwd from 'cwd'
import _ from 'lodash'
import fs from 'fs'
//endregion

type Opts = {
  helpers: Object;
  compileVendorDll: boolean;
  vendorChunkOrDll: 'dll' | 'chunk';
  buildPath: string;
  localProjectPath: string;
  vendorManifestPath: string;
}

function getOpts(opts): Opts {
  return _.defaults({}, opts, {
    compileVendorDll:  false,
    vendorChunkOrDll: null, // dll or chunk
    buildPath: null,
    localProjectPath: opts.cwd,
    vendorManifestPath: path.join(opts.buildPath, 'vendor-manifest.json'),
  })
}

export default function(webpack, opts, config) {

  opts = getOpts(opts)

  //
  // We are precompiling the vendor dll in this webpack run.
  //

  if (opts.compileVendorDll === true) {

    config.plugin('DllPlugin', webpack.DllPlugin, [{
      path: path.join(opts.buildPath, '[name]-manifest.json'), // TODO(vjpr): Replace with build dir.
      name: '[name]_library',
      type: undefined,
      context: undefined,
    }])

  } else if (opts.vendorChunkOrDll === 'chunk') {

    // Chunk
    ////////////////////////////////////////////////////////////////////////////

    //
    // We are using a commons chunk of vendor. (So we don't need a separate compile step for the dll)
    //

    // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    // TODO(vjpr): May need to be disabled because of problem with vendor and hot plugin.
    // !DEV because of DllPlugin.
    config.plugin('CommonsChunkPlugin', webpack.optimize.CommonsChunkPlugin, [{name: 'vendor'}])

  } else if (opts.vendorChunkOrDll === 'dll') {

    // Dll
    ////////////////////////////////////////////////////////////////////////////

    //
    // We are referencing the precompiled vendor dll.
    //

    if (opts.compileVendorDll === false) {

      let manifest
      try {
        manifest = JSON.parse(fs.readFileSync(opts.vendorManifestPath, 'utf8'))
      } catch (e) {
        // TODO(vjpr): Maybe throw a warning or error that build needs to be run with MAKE_DLL.
        console.error('Please build `vendor-manifest.json`. Run `MAKE_DLL=1 gulp webpack:build`')
        process.exit(1)
        manifest = undefined
      }
      config.plugin('DllReferencePlugin', webpack.DllReferencePlugin, [{
        //scope: undefined,
        //context: buildPath,
        context: opts.localProjectPath,
        manifest: manifest,
        name: undefined, // Taken from `manifest` file.
        sourceType: 'var',
        type: undefined, // require
        scope: undefined,
        content: undefined,
      }])

    }

  }

}
