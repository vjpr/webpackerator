export default function(webpack, opts, config) {

  const {StatsWriterPlugin} = require('webpack-stats-plugin')
  config.plugin('StatsWriterPlugin', StatsWriterPlugin, [{
    filename: 'webpack-stats.json',
    fields: null,
  }])

}
