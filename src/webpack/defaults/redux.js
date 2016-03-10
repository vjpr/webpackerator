//region Imports
const {addVendor, addAlias} = require('./util')
//endregion

// redux-starter.
export default function(webpack, opts, config) {

  addVendor(config, [
    'autobind-decorator',
    'react-redux',
    'redux-devtools',
    'redux-devtools-log-monitor',
    'redux-devtools-dock-monitor',
    'redux-devtools-diff-monitor',
    'redux-devtools-filterable-log-monitor',
    'react-router',
    'history',
    'react-bootstrap',
    'reselect',
    'react-router-redux',
    'react-router-bootstrap',
  ])

}
