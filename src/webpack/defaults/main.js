const webpack = require('webpack')
const cwd = require('cwd')
const {join} = require('path')
const _ = require('lodash')
const prettyjson = require('prettyjson')
const debug = require('debug')('webpackerator:debug')

function getOpts(opts) {
  return _.defaults({}, opts, {
    buildPath: null,
    roots: [],
    resolveAlias: {},
  })
}

module.exports = function(webpack, opts, config) {

  opts = getOpts(opts)

  function printConfig() {
    debug('Webpack environment settings:',
      {isProd: opts.isProd, notProd: opts.notProd, isTest: opts.isTest})
  }

  printConfig()

  config.merge({
    cache: opts.notProd,
    watch: opts.notProd,
    context: cwd(),
    //debug: opts.notProd, // Removed in v2.
    // TODO(vjpr): Make this a flag.
    profile: true // DEBUG
  })

  // Stats
  //////////////////////////////////////////////////////////////////////////////

  config.merge({
    //quiet: false,
    //noInfo: false,
    stats: {
      colors: true,
      reasons: opts.notProd,
      errorDetails: true,

      //timings: true,
      //chunks: true,
      //chunkModules: true,
      //version: true,
      //assets: true,
      //hash: true,
    }
  })

  // Output
  //////////////////////////////////////////////////////////////////////////////

  const addTrailingSlash = (str) => (str.substr(-1) !== '/') ? str + '/' : str

  config.merge({

    output: {

      // We need to give Webpack a path. It does not actually need it,
      // because files are kept in memory in webpack-dev-server, but an
      // error will occur if nothing is specified. We use the buildPath
      // as that points to where the files will eventually be bundled
      // in production
      path: addTrailingSlash(opts.buildPath), // TODO(vjpr): Not sure if trailing slash needed or not.

      // Show require paths in comments in the code.
      // This slows down the build.
      pathinfo: false,

      // Web server will serve files in the `devServer.contentBase` at this endpoint URL.
      // NOTE(vjpr): We must set this when running dev server otherwise
      //   our asssets will be relative to our production web server
      //   which *might* be running on a different port.
      //publicPath: opts.notProd ? `${opts.devServerUrl}/` : '/build/',
      //publicPath: opts.notProd ? opts.buildDir : opts.buildDir,
      publicPath: opts.notProd ? `/${opts.buildDir}/` : `/${opts.buildDir}/`, // NOTE: Must have trailing slash!

      // See `./vendor#finalize` where we use a different name for vendor dll.
      filename: '[name].bundle.js',

      // IGNORE
      // When using a dll (i think?), the `hot` is missing. This makes everything serve from the same dir, which we can proxy to the webpack-dev-server.
      // See http://code.fitness/post/2016/02/webpack-public-path-and-hot-reload.html
      // Make sure to recompile the DLL when changing this.
      // Always served relative to `publicPath`.
      //hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
      //hotUpdateMainFilename: 'hot/[hash].hot-update.json',

    },

  })

  // Module
  //////////////////////////////////////////////////////////////////////////////

  config.merge({

    module: {

      // Contexts
      ///////////

      // Disable handling of unknown requires
      unknownContextRegExp: /$^/,
      unknownContextCritical: false,

      // Disable handling of requires with a single expression
      exprContextRegExp: /$^/,
      exprContextCritical: false,

      wrappedContextCritical: true,

      // PreLoaders
      ///////////

      //preLoaders:
      //  test: /\.js$/
      //  exclude: /node_modules/
      //  loader: 'eslint-loader'
      //]

    },

  })

  // Resolve
  //////////////////////////////////////////////////////////////////////////////

  /*

  This is needed because we need to support support pnpm@0.51.1 dir structure:

  your-app/node_modules/.resolutions/registry.npmjs.org/webpackerator/0.2.0-beta.0
    /package (we must walk out of this dir)
    /node_modules <--

  When npm linked, this will resolve to `<webpackerator git repo>/node_modules`.

  TODO(vjpr): It then needs to fallback to the app's `node_modules` dir.
    The issue will be the ordering. It should look in the symlinked `node_modules` first.
    Webpack 2.0 solves this with `resolve.modules`.

  */
  const findUp = require('findup-sync')
  const path = require('path')
  const pkgDir = require('pkg-dir')
  // NOTE: We need both of these because pnpm@0.53.0 will create a `node_modules/.bin` dir which will only contain bins, and no modules. We want to find the adjacent node_modules dir.
  const pkgDirPath = pkgDir.sync(__dirname)
  const webpackeratorLocalNodeModulesDir =
    path.join(pkgDirPath, 'node_modules')
  // NOTE: This will resolve to `~/dev-live/node_modules` when symlinked.
  // TODO(vjpr): Probably a little dangerous.

  // pnpm could be in two locations in 0.51.1 and 0.53.0
  // node_modules/foo/index.js
  // node_modules/foo/node_modules
  // package/index.js

  const webpackeratorPnpmNodeModulesDir = findUp('node_modules', {
    cwd: path.resolve(pkgDirPath, '..'),
  })

  console.log('Looking for webpackerator defaults in:\n',{webpackeratorLocalNodeModulesDir, webpackeratorPnpmNodeModulesDir})

  config.merge({

    resolve: {
      // Allow specifiying which files not to bundle in package.json.
      //
      // If a module misuses browser key this causes problems:
      //   E.g. [projDir]/node_modules/webpack-dev-server/node_modules/serve-index/node_modules/batch
      //
      aliasFields: ['browser'],

      extensions: ['.js'],

      // TODO(vjpr): Does it make us scan unneccessary files.
      enforceExtension: false,

      alias: Object.assign({}, opts.resolveAlias),

      //////////////////////////////////////////////////////////////////////////
      // Webpack@^1
      //modulesDirectories: ['node_modules'],
      //// NOTE: Shared with node.js. using `app-module-path` module.
      //root: opts.roots.map(v => cwd(v)),
      //fallback: [
      //  webpackeratorLocalNodeModulesDir,
      //  webpackeratorPnpmNodeModulesDir,
      //],
      //////////////////////////////////////////////////////////////////////////


      modules: [
        webpackeratorLocalNodeModulesDir,
        // TODO(vjpr): This might cause issues as it will sometimes point to a wierd place if npm linked.
        webpackeratorPnpmNodeModulesDir,
        ...opts.roots.map(v => cwd(v)),
        'node_modules',
      ].filter(Boolean),

    },

    // TODO(vjpr): Split the loaders out of webpackerator as plugins so
    //   webpackerator doesn't have to be so big.
    resolveLoader: {
      modules: [
        webpackeratorLocalNodeModulesDir,
        webpackeratorPnpmNodeModulesDir,
        'node_modules',
      ].filter(Boolean),
    }

  })

  // Node
  //////////////////////////////////////////////////////////////////////////////

  config.merge({

    node: {
      fs: 'empty',
      // Because of problems with `debug` module.
      net: 'empty',
      //global: 'window',
      global: true, // Changed for v2.
      // For webpack-dev-server vendor bundle errors.
      tls: 'empty',
      child_process: 'empty',
      process: 'mock',

    },

  })

}
