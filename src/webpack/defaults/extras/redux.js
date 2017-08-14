const {addVendor, addAlias} = require('../util')

// redux-starter.
export default function(webpack, opts, config) {

  addVendor(config, [
    'autobind-decorator',
    'react-redux',
    'redux-devtools',
    //'redux-devtools-log-monitor',
    //'redux-devtools-dock-monitor',
    //'redux-devtools-diff-monitor',
    //'redux-devtools-filterable-log-monitor',
    //'history',
    'react-bootstrap',
    'reselect',

    // NOTE: If we are using a resolver plugin, we want to choose which versions to load...
    //'react-router',

    'react-router-redux',
    'react-router-bootstrap',
  ])

}
