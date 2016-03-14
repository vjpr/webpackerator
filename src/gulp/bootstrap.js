const files = {}

// Babelator takes care of this now.
//export async function installModules() {
//
//  //region Imports
//  const {addNpmDependenciesToPackageJson, installNpmDependencies} = require('npm-install-prompt')
//  //endregion
//
//  // TODO(vjpr): Set to current versions from npm.
//  let devDependencies = [
//    ['babel-preset-react-hmre', '1.1.1'],
//  ]
//
//  let dependencies = [
//    ['babel-loader'],
//  ]
//
//  await addNpmDependenciesToPackageJson({
//    devDependencies,
//    dependencies,
//    reject: {
//      devDependencies: ['babel-preset-react', 'babel-preset-es2015', 'babel-preset-stage-0'],
//      dependencies: ['babel-preset-react', 'babel-preset-es2015', 'babel-preset-stage-0'],
//    },
//  })
//
//  await installNpmDependencies({devDependencies, dependencies})
//
//}

export async function makeFiles(opts) {

  //region Imports
  const replaceFile = require('./util/replaceFile')
  const cwd = require('cwd')
  const async = require('async')
  const {confirm} = require('inquirer-promise')
  const _ = require('lodash')
  const {promisify} = require('bluebird')
  //endregion

  // Maybe pass this in from somewhere. Collect facts first. Then run all tasks.
  const useLive = await confirm('Use Live? (See https://github.com/live-js/live)')

  const locals = {useLive: useLive}

  //////////////////////////////////////////////////////////////////////////////
  // Files
  //////////////////////////////////////////////////////////////////////////////

  for (const key in files) {
    let val = files[key]
    const dest = cwd(key)
    val = _.isFunction(val) ? val(locals) : val
    await promisify(replaceFile)(dest, val)
  }

  // TODO(vjpr): Install webpack, webpack-dev-server, etc.
  // defaults/babel -> babel-core
  // defaults/webpackerator -> webpack, webpack-dev-server
  // Will need to install modules that all the defaults depend on. Prob use something similar to babelator.

}

// NOTE: There is something that accesses webpack.config.js which I forgot right now.
files['webpack.config.js'] = `console.warn('Something tried to access webpack.config.js. Please use webpackerator.js instead. It allows config variables to be passed in.')
//process.exit()
`

files['webpackerator.js'] = (locals) => `// The default webpackerator gulp tasks call this function to get the config.
module.exports = function(webpack, opts) {
  const Config = require('webpackerator').Config
  const config = new Config
  require('webpackerator/defaults/webpackerator.js')(webpack, opts, config)
  config.merge({entry: {main: './src/client.js'}})
  ${locals.useLive ? `require('webpackerator/lib/webpack/defaults/extras/live')(webpack, opts, config)` : ``}
  // TODO: Customize config here. See https://github.com/lewie9021/webpack-configurator.
  const json = config.resolve()
  return json
}

// The default webpackerator gulp tasks use this for common configuration.
// You can also modify opts in the \`module.exports\` function.
// See \`webpackerator/src/webpack/index.js#parseOpts\`.
module.exports.config = {
  ${locals.useLive ? `liveLocator: require('live/locator'),` : ``}
}
`

files['configurize.browser.js'] = `module.exports = {}`

const liveMain = `
if (module.hot) module.hot.accept()

require('live/init')()

// Enable if you want to use bootstrap-loader.
//process.env.NODE_ENV === 'production'
//  // NOTE: This is also set in vendor bundle.
//  ? require('bootstrap-loader/extractStyles')
//  : require('bootstrap-loader')

const live = require('live')

live({
  modules: {
    //enabled: ['foo'],
    disabled: null,
  },
  beforeStart: (live) => {
    live.after('start', async () => {
      console.log('Started!')
    })
  }
})
`

const liveMainSimple = `
if (module.hot) module.hot.accept()
require('live/init')()
require('live')()
`

files['src/client.js'] = locals => {
  if (locals.useLive) {
    return liveMainSimple
  } else {
    return `console.log('hello world')\n`
  }
}

files['index.html'] = `<html>
<head>
  <script src="/build/vendor.dll.js" type="application/javascript"></script>
  <script src="/build/main.bundle.js" type="application/javascript"></script>
</head>
<body>Works!</body>
</html>
`
