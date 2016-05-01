export default function(webpack, opts, config) {

  // TODO(vjpr): Rearrange arrays that are position sensitive.

  // TODO(vjpr): Main entry.

  // These two are split only because we might want to move vendor out of the finalize script.

  // Vendor needs all vendored libs to check if we need to rebuild the vendor dll.
  require('./vendor').default(webpack, opts, config)

  require('./vendor').finalize(webpack, opts, config)

}
