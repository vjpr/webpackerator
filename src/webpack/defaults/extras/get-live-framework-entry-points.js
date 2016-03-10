//region Imports
const cwd = require('cwd')
const path = require('path')
const fs = require('fs')
const prettyjson = require('prettyjson')
const repeat = require('core-js/fn/string/repeat.js')
const moment = require('moment')
const debug = require('debug')('webpackerator:debug')
//endregion

// locator - to avoid having `live` as a dependency when npm linking.
module.exports = function(opts) {

  if (!opts.liveLocator) {
    console.error('You must set `opts.liveLocator` to `require("live/locator")` when using `webpackerator/lib/webpack/defaults/extras/live`')
    process.exit(1)
  }

  const pluginIndex = loadPlugins(opts.liveLocator)

  return [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'babel-polyfill',
    // NOTE(vjpr): bootstrap-loader is now in vendor bundle.
    //(DEV ? 'bootstrap-loader' : 'bootstrap-loader/extractStyles'),
    pluginIndex, // We require the file from `live/pluginLoader`.
    './lib/client.js',
  ]

}

function loadPlugins(liveLocator) {

  // TODO(vjpr): Change to just `generated`.
  const filename = './modules/generated/live-browser-plugin-requires-generated.js'
  // TODO: Allow specifying a chunk name (when using multiple entry points).
  // Some config setting from the module. E.g. `config.get(module).entry`.
  const files = liveLocator({
    files: ['live.browser'],
  })
  debug(repeat('-', 80))
  debug('Found browser plugin files')
  debug(prettyjson.render(files))
  debug(repeat('-', 80))
  writePluginRequiresToFile(filename, files)
  return filename

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
