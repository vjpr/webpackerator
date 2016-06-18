/* @flow weak */
const _ = require('lodash')
const cwd = require('cwd')
const path = require('path')
const fs = require('fs')
const prettyjson = require('prettyjson')
const repeat = require('core-js/fn/string/repeat.js')
const moment = require('moment')
const debug = require('debug')('webpackerator:debug')
const mkdirp = require('mkdirp')

// locator - to avoid having `live` as a dependency when npm linking.
module.exports = function(opts) {

  opts = _.defaults({}, opts, {
    liveLocator: null,
    livePluginManifestFileName: './generated/live-browser-plugin-requires-generated.js',
    roots: [],
    watchLivePluginFiles: opts.notTest,
  })

  if (!opts.liveLocator) {
    console.error('You must set `opts.liveLocator` to `require("live/locator")` when using `webpackerator/lib/webpack/defaults/extras/live`')
    process.exit(1)
  }

  const locator = getLocator(opts, opts.liveLocator)
  const loadPluginsPartial = _.partial(loadPlugins, locator, opts.livePluginManifestFileName)
  const livePluginManifestFileName = loadPluginsPartial()

  // TODO(vjpr): When we try to resolve the config for use elsewhere like in our web server
  //   we don't want to do this...or do we?
  if (opts.watchLivePluginFiles) watchLiveFiles(locator.getGlob(), loadPluginsPartial)

  return [livePluginManifestFileName]

}

let watching = false

function watchLiveFiles(glob, loadPlugins) {

  if (watching) return

  const chokidar = require('chokidar')
  const log = console.log.bind(console)
  //const log = debug.bind(debug)

  const watcher = chokidar.watch(glob, {ignoreInitial: true})
  watcher.on('add', path => {
    log(`Live plugin ${path} has been added`)
    loadPlugins()
  })
  watcher.on('unlink', path => {
    log(`Live plugin ${path} has been removed`)
    loadPlugins()
  })

  log('Watching for new live plugins:', glob)

  watching = true

}

function getLocator(opts, liveLocator) {
  const {PluginLocator} = liveLocator
  const locator = new PluginLocator({
    files: ['live.browser'],
    folders: opts.roots,
    exts: ['json', 'cson', 'js'],
    rootDir: process.cwd(),
  })
  return locator
}

function loadPlugins(locator, livePluginManifestFileName) {
  // TODO: Allow specifying a chunk name (when using multiple entry points).
  // Some config setting from the module. E.g. `config.get(module).entry`.
  const files = locator.locate()
  debug(repeat('-', 80))
  debug('Found browser plugin files')
  debug(prettyjson.render(files))
  debug(repeat('-', 80))
  mkdirp.sync(path.dirname(livePluginManifestFileName))
  writePluginRequiresToFile(livePluginManifestFileName, files)
  return livePluginManifestFileName
}

// Write require file.
function writePluginRequiresToFile(filename, files) {

  const dest = path.join(cwd(), filename)
  let body = 'module.exports = window.livePlugins = {}\n'
  body += files.map((file) => {
    // Files must be relative to an `modulesDirectories` entry.
    let relFile = path.relative(cwd(), file)
    relFile = getModuleDirectoriesRelativePath(relFile)
    return `window.livePlugins['${relFile}'] = require('${relFile}')`
  }).join(';\n')
  body += `;\nif (module.hot) { module.hot.accept() }\n`
  fs.writeFileSync(dest, body)

  // Change modified timestamp back 10 seconds to prevent it triggering a
  // second compile when webpack-dev-server is started.
  // 5 seconds doesn't work. Not sure why.
  const newTime = moment().subtract(10, 'seconds').unix()
  fs.utimesSync(dest, newTime, newTime)
  // --

  debug('Wrote plugin requires to file', dest)

}

// TODO(vjpr): Because of this `moduleDirectories` can ONLY be in process.cwd().
// THIS IS BAD!!!
function getModuleDirectoriesRelativePath(filename) {
  const [firstDir, ...rest] = filename.split(path.sep)
  return rest.join(path.sep)
}

//module.exports.loadPlugins = loadPlugins
//module.exports.getLocator = getLocator
