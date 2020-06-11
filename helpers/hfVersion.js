const call = require('./call')

/** return hf version */
const getHFVersion = async () => {
  const res = await call('condenser_api.get_hardfork_version')
  if (!res) {
    throw new Error("Couldn't resolve hardfork version")
  }
  if (res && (!res.id || !res.result)) {
    throw new Error('Bad response @ hf version')
  }
  return res.result
}

module.exports = getHFVersion
