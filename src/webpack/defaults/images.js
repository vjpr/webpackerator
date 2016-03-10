module.exports = (webpack, opts, config) => {

  config.loader('images', {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loaders: [
      'file?hash=sha512&digest=hex&name=[hash].[ext]'
      //'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
    ],
  })

}
