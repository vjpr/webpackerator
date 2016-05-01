// @flow weak
//region Imports
import path, {join} from 'path'
import cwd from 'cwd'
import _ from 'lodash'
import fs from 'fs'
import fse from 'fs-extra'
import {getVendor} from './util'
import hash from 'object-hash'
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
    vendorManifestPath: join(opts.buildPath, 'vendor-manifest.json'),
  })
}

const pleaseRebuildMessage = 'Run `MAKE_DLL=1 gulp webpack:build`'

export default function(webpack, opts, config) {

  opts = getOpts(opts)

  const vendorModuleNamesPath = join(opts.buildPath, 'vendor-module-names.json')

  ////////////////////////////////////////////////////////////////////////////////

  // We build in only one of the "build modes" below at a time.

  if (opts.compileVendorDll === true) {

    ////////////////////////////////////////////////////////////////////////////
    // Compiling: dll
    ////////////////////////////////////////////////////////////////////////////

    //
    // We are precompiling the vendor dll in this webpack run.
    //

    // See function `finalize` below to ensure we only compile the vendor bundle as dll.

    config.plugin('DllPlugin', webpack.DllPlugin, [{
      path: join(opts.buildPath, '[name]-manifest.json'), // TODO(vjpr): Replace with build dir.
      name: '[name]_library',
      type: undefined,
      context: undefined,
    }])

    fse.writeJsonSync(vendorModuleNamesPath, getVendorModules(config))

  } else if (opts.vendorChunkOrDll === 'chunk') {

    ////////////////////////////////////////////////////////////////////////////
    // Using: chunk
    ////////////////////////////////////////////////////////////////////////////

    //
    // We are using a commons chunk of vendor. (So we don't need a separate compile step for the dll)
    //

    // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    // TODO(vjpr): May need to be disabled because of problem with vendor and hot plugin.
    // !DEV because of DllPlugin.
    config.plugin('CommonsChunkPlugin', webpack.optimize.CommonsChunkPlugin, [{name: 'vendor'}])

  } else if (opts.vendorChunkOrDll === 'dll') {

    ////////////////////////////////////////////////////////////////////////////
    // Using: dll
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
        console.error(`Cannot find manifest for vendor dll (${opts.vendorManifestPath}) not found. ` + pleaseRebuildMessage)
        process.exit(1)
        manifest = undefined
      }

      warnIfVendoredPackagesHaveChanged(config, vendorModuleNamesPath)

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

////////////////////////////////////////////////////////////////////////////////

// We need to warn user to rebuild vendor dll if any of there
// dependencies change. We need to check versions of vendored deps.
function warnIfVendoredPackagesHaveChanged(config, vendorModuleNamesPath) {
  const jsondiffpatch = require('jsondiffpatch')
  const last = fse.readJsonSync(vendorModuleNamesPath)
  const current = getVendorModules(config)
  if (_.difference(last, current).length) {
    console.error('Your vendor packages have changed (see diff below). ', pleaseRebuildMessage)
    const delta = jsondiffpatch.diff(last, current)
    jsondiffpatch.console.log(delta)
    process.exit(1)
  }
}

function getVendorModules(config) {
  const vendor = getVendor(config)
  // Create a hash of the set (sort array first) of vendor packages.
  //const vendorHash = hash(vendor, {unorderedArrays: true})
  //console.log(manifest)
  return vendor
}

////////////////////////////////////////////////////////////////////////////////

export function finalize(webpack, opts, config) {

  if (opts.compileVendorDll) {

    config.merge(current => {

      // We don't need to compile the main bundle when compiling a vendor dll.
      delete current.entry.main

      current.output.filename = '[name].dll.js'

      current.output.library = '[name]_library'

      return current

    })

  } else {

    // Delete vendor if we are in dev to prevent it building when using dev server.
    if (opts.vendorChunkOrDll === 'dll') {

      config.merge(current => {

        delete current.entry.vendor

        return current

      })

    }

  }

}
