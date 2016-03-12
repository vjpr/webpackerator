//region Imports
const _ = require('lodash')
const {addVendor, addAlias} = require('../util')
//endregion

export default function(webpack, opts, config) {

  config.merge(_.set({}, 'module.noParse', [/react\/dist\/react.js/]))
  addAlias(config, {'react$': 'react/dist/react.js'})
  addAlias(config, {'react-dom$': 'react-dom/dist/react-dom.js'})
  addVendor(config, 'react')
}
