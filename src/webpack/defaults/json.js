module.exports = (webpack, opts, config) => {

  config.loader('json', {
    test: /\.json/,
    loader: 'json-loader',
  })

}
