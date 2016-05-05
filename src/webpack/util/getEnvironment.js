//region Imports
const _ = require('lodash')
//endregion

export default function getEnvironment(env) {

  if (_(['production', 'development', 'test']).includes(env)) {

    // 1. Try set from `opts` parameter.
    // This may be from cli, gulp global, or direct call of `parseOpts` from a test.

    console.log('Setting env from opts (cli, `gulp.env`, or `parseOpts(opts)`):', env)

  } else if (process.env.NODE_ENV && _(['production', 'development', 'test']).includes(process.env.NODE_ENV)) {

    // 2. process.env.NODE_ENV
    // TODO(vjpr): If we are using `.env`, process.env.NODE_ENV might be set inside that file.

    env = process.env.NODE_ENV
    console.log('Setting env from `process.env.NODE_ENV`:', env)

  } else if (Boolean(process.env.TEST)) { // TODO(vjpr): Deprecate.

    // 3. process.env.TEST

    env = 'test'
    console.log('Setting env from `process.env.TEST`:', env)

  } else {

    // 4. If env is not set, set to `development`.

    env = 'development'
    console.log('No env specified. Setting default:', env)

  }

  return env

}
