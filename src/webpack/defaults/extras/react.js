const _ = require('lodash')
const {addVendor, addAlias} = require('../util')

export default function(webpack, opts, config) {

  config.merge(_.set({}, 'module.noParse', [/react\/dist\/react.js/]))

  // NOTE: This was to ensure 1 version of react was in use...but we should do this in the resolve plugin.

  // TODO(vjpr): This was causing some issues with PeerDepRedirectPlugin
  //addAlias(config, {'react$': 'react/dist/react.js'})
  //addAlias(config, {'react-dom$': 'react-dom/dist/react-dom.js'})

  // TODO(vjpr): If this is added then there are multiple versions of react when using PeerDepPlugin.
  //addVendor(config, 'react')
}
