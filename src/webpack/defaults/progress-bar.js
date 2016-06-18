import _ from 'lodash'

module.exports = (webpack, opts, config) => {

  const ProgressBarPlugin = require('progress-bar-webpack-plugin')
  config.plugin('ProgressBarPlugin', ProgressBarPlugin, [])

}
