//region Imports
const {addVendor} = require('./util')
//endregion

export default function(webpack, opts, config) {

  // Webpackerator defaults.
  addVendor(config, [
    'webpackerator',
    'socket.io-client',
    'core-js',
    'core-js/library',
    'core-js/library/es6/reflect',
    'core-js/library/fn/dict',
    'core-js/shim',
    'core-js/fn/string/repeat.js',
    'core-js/library/fn/number/is-integer.js',
    'core-js/library/fn/is-iterable.js',
    'component-emitter', // For webpack-dev-server.
  ])

}

