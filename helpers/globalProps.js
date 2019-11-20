const call = require('./call')

/** return global properties */
const getGlobalProps = async () => {
  const res = await call('condenser_api.get_dynamic_global_properties')
  if (!res) {
    throw new Error("Couldn't resolve global properties")
  }
  if (res && (!res.id || !res.result)) {
    throw new Error('Bad response @ global props')
  }
  return res.result
}

module.exports = getGlobalProps
