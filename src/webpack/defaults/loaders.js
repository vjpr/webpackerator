//region Imports
const {Config} = require('../..')
//endregion

module.exports = (webpack, opts) => {

  const config = new Config

  const {DEV, TEST, MODULE_DIRS} = opts.helpers

  //////////////////////////////////////////////////////////////////////////////

  config.loader('coffee', {
    test: /\.(iced|coffee)$/,
    loaders: ['react-hot', 'iced-coffee-loader'],
  })

  //////////////////////////////////////////////////////////////////////////////

  // TODO(vjpr): Use webpack-configurator resolver.
  const babelLoader = () => {
    let out = []
    if (DEV) out = out.concat(['react-hot'])
    out = out.concat([
      //ReactStylePlugin.loader(),
      'babel-loader?stage=0&optional[]=runtime&blacklist=flow'
      //'flowcheck'
      //'babel-loader?stage=0&externalHelpers'
    ])
    return out
  }

  config.loader('babel', {
    name: 'babel-loader', // So we can remove it from `wallaby.js` if we want to.
    test: /\.js$/,
    loaders: babelLoader(),
    exclude: [/bower_components/, /node_modules/],
    include: MODULE_DIRS //, /react-hot-loader/],
    //include: [/live-[^\/]*\/(?!node_modules)/, modulesDir, /color-cod/] //, /react-hot-loader/],
    // TODO(vjpr): We must call babel on any patched modules where we are modifying the source.
    // This is pretty painful

    // TODO: Caching.
    //cacheDirectory: null,
    //cacheIdentifier: null,
  })

  //////////////////////////////////////////////////////////////////////////////

  config.loader('babel-leaflet', {
    test: /\.js$/,
    loaders: ['babel-loader?stage=0&optional[]=runtime&blacklist=flow'],
    include: /node_modules\/react-leaflet/,
  })

  //////////////////////////////////////////////////////////////////////////////

  config.loader('json', {
    test: /\.json/,
    loader: 'json-loader',
  })

  //////////////////////////////////////////////////////////////////////////////

  config.loader('images', {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loaders: [
      'file?hash=sha512&digest=hex&name=[hash].[ext]'
      //'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
    ],
  })

  //////////////////////////////////////////////////////////////////////////////

  config.loader('fonts', {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&minetype=application/font-woff',
  })

  //////////////////////////////////////////////////////////////////////////////

  config.loader('files', {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader',
  })

  //////////////////////////////////////////////////////////////////////////////

  return config.resolve()

}

const oldLoaders = [
  //      test: /\.scss$/
  //      loader: "#{CSS_LOADERS}!sass"
  //    ,
  //      test: /\.sass$/
  //      loader: "#{CSS_LOADERS}!sass?indentedSyntax=true"
  //    ,
  //    ,
  //      test: /\.ts$/
  //      loader: 'typescript-loader'
  //      query: typescriptCompiler: 'jsx-typescript'
  //    ,
  //      test: /\.cjsx$/
  //      loaders: ['react-hot', 'jsx-loader', 'iced-coffee-loader']
  //    ,
  //      test: /\.(iced\.md|litcoffee)$/
  //      loader: 'iced-coffee-loader?literate=true'
]
