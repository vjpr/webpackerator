//region Imports
const {addVendor} = require('./util')
//endregion

export default function(webpack, opts, config) {

  // Webpackerator defaults.
  addVendor(config, [
    'socket.io-client',
    'webpackerator',
    'webpack-dev-server',
    'webpack-dev-server/client',
    'webpack-dev-server/client?/webpack-dev-server-proxy/sockjs-node',
    //'webpack/hot/only-dev-server', // NOTE: Including this will break hot-updates!
    //'babel-runtime/helpers', // TODO: This throws an error but it is actually fine...
    'babel-runtime/core-js/number/is-integer.js',
    'babel-runtime/helpers/defineProperty.js',
    'babel-runtime/helpers/objectWithoutProperties.js',
    'babel-runtime/helpers/slicedToArray.js',
    'babel-runtime/core-js/is-iterable.js',
    'babel-runtime/helpers/toConsumableArray.js',
    'babel-polyfill', // maybe
    'eventsource-polyfill', // maybe
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

