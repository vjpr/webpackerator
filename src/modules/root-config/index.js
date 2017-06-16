const _ = require('lodash')
const {join} = require('path')
const cwd = require('cwd')
const fs = require('fs')
const debug = require('debug')('root-config')

// Try to get the config from some preset locations.
export function getConfigPath(configName, ext = '.js') {

  if (!configName) throw new Error('You must provide a config name to root-config.')

  const envName = process.env[`${_.upperCase(configName)}_CONFIG_PATH`] // FOO_CONFIG_PATH
  debug('Trying:', 'process.env')
  if (envName) return envName

  {
    const file = join(cwd(), '.' + configName + ext) // .foo.js
    debug('Trying:', file)
    if (fs.existsSync(file)) return file
  }

  {
    const file = join(cwd(), configName + ext) // foo.js
    debug('Trying:', file)
    if (fs.existsSync(file)) return file
  }

  {
    const file = join(cwd(), 'tools', '.' + configName + ext) // tools/.foo.js
    debug('Trying:', file)
    if (fs.existsSync(file)) return file
  }

  {
    const file = join(cwd(), 'tools', configName + ext) // tools/foo.js
    debug('Trying:', file)
    if (fs.existsSync(file)) return file
  }

  // TODO(vjpr): __filename should be a ide link. There is a module I made for that.
  console.warn(`No ${configName} config file found. See ${__filename}.`)

  return null

}

export default function(configName, ext) {
  const configPath = getConfigPath(configName, ext)
  const config = configPath ? require(configPath) : {}
  return {config, configPath}
}
