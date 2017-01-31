module.exports = function(webpack, opts, config) {

  require('./dev-server')(webpack, opts, config)
  require('./plugins')(webpack, opts, config)
  require('./optimize')(webpack, opts, config)
  require('./babel')(webpack, opts, config)
  require('./main')(webpack, opts, config)
  require('./configurize')(webpack, opts, config)
  require('./source-maps')(webpack, opts, config)
  // TODO(vjpr): Ordering!
  //require('./bootstrap-loader')(webpack, opts, config)

  require('./style').default(webpack, opts, config)
  require('./css')(webpack, opts, config)
  require('./scss')(webpack, opts, config)
  require('./less')(webpack, opts, config)

  require('./json')(webpack, opts, config)
  require('./images')(webpack, opts, config)
  require('./globals')(webpack, opts, config)
  require('./progress-bar')(webpack, opts, config)
  require('./hot')(webpack, opts, config)
  require('./fonts')(webpack, opts, config)

  //require('./webpackerator')(webpack, opts, config)
  //require('./react')(webpack, opts, config)
  //require('./redux')(webpack, opts, config)

  // NOTE: Should be last.
  // TODO(vjpr): Not sure it matters anymore actually.
  require('./stats')(webpack, opts, config)

}
