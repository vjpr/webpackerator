import _ from 'lodash'

export default function(webpack, opts, config) {

  // Fix critical dependency issue.
  config.merge(_.set({}, 'module.noParse', [/moment.js/]))
  config.plugin('MomentContextReplacementPlugin', webpack.ContextReplacementPlugin, [/moment[\/\\]locale$/, /en/])

}
