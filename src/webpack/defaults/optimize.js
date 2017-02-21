export default function(webpack, opts, config) {

  // TODO(vjpr): Use proper config var.
  if (opts.minifyJs) {

    // Removed in webpack@2.
    //config.plugin('DedupePlugin', webpack.optimize.DedupePlugin)

    // TODO(vjpr): Review issue with `__.type.global()` bug.
    config.plugin('UglifyJsPlugin', webpack.optimize.UglifyJsPlugin, [{
      sourcemap: true,
    }])
    config.plugin('AggressiveMergingPlugin', webpack.optimize.AggressiveMergingPlugin)
  }

  // For dead code removal to allow conditionals that
  // prevent dynamic requires used in Node.js code which slows
  // everything down because of the size of contexts.
  // TODO(vjpr): Check speed.
  //if (PROD) config.plugin(webpack.optimize.UglifyJsPlugin, [{minimize: false])

}
