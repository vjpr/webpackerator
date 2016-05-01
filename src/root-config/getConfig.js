//region Imports
const _ = require('lodash')
const {join} = require('path')
const cwd = require('cwd')
const fs = require('fs')
const debug = require('debug')('root-config')
//endregion

// Try to get the config from some preset locations.
function getConfigPath(configName) {

  if (!configName) throw new Error('You must provide a config name to root-config.')

  const envName = process.env[`${_.upperCase(configName)}_CONFIG_PATH`] // FOO_CONFIG_PATH
  debug('Trying:', 'process.env')
  if (envName) return envName

  {
    const file = join(cwd(), '.' + configName + '.js') // .foo.js
    debug('Trying:', file)
    if (fs.existsSync(file)) return file
  }

  {
    const file = join(cwd(), configName + '.js') // foo.js
    debug('Trying:', file)
    if (fs.existsSync(file)) return file
  }

  {
    const file = join(cwd(), 'tools', configName + '.js') // tools/foo.js
    debug('Trying:', file)
    if (fs.existsSync(file)) return file
  }

  // TODO(vjpr): __filename should be a ide link. There is a module I made for that.
  console.warn(`No ${configName} config file found. See ${__filename}.`)

  return null

}

export default function(configName) {
  const configPath = getConfigPath(configName)
  const config = configPath ? require(configPath) : {}
  return {config, configPath}
}
