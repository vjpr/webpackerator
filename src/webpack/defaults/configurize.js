let configurize

try {
  global.__CLIENT__ = false
  configurize = require('configurize')
} catch (e) {
  // workaround when `npm link`'ed for development
  const prequire = require('parent-require')
  configurize = prequire('configurize')
}

const {addVendor, addAlias} = require('./util')

export default function(webpack, opts, config) {

  // Configurize
  const configurizeBrowserPath = configurize.getBrowserConfigPath()
  addAlias(config, {'configurize.browser.js': configurizeBrowserPath})
  addAlias(config, {'.configurize.browser.js': configurizeBrowserPath})

  // TODO(vjpr): Could also use the IgnorePlugin.
  // Fix Electon dep if not in Electon environment.
  addAlias(config, {'app': require.resolve('empty')})

}
