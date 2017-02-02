import _ from 'lodash'

export default function(webpack, opts, config) {

  // Fix critical dependency issue.

  // NOTE: If added to noParse it will complain about `require` not existing.
  //config.merge(_.set({}, 'module.noParse', [/colors.js/]))

  //config.plugin('ColorsContextReplacementPlugin', webpack.ContextReplacementPlugin, [/colors$/, /^$/])

}
