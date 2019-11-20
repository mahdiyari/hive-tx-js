try {
  var fetch = !fetch ? require('node-fetch') : fetch
} catch (e) {
  // DO NOTHING
}
const config = require('../config')

/**
 * Make calls to steem node
 * @param method - e.g. condenser_api.get_dynamic_global_properties
 * @param params - an array
 */
const call = async (method, params = []) => {
  let res = await fetch(config.node, {
    method: 'post',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: 1
    })
  })
  if (res && !res.ok) {
    throw new Error(res ? res.status : 'Network error')
  }
  res = await res.json()
  return res
}

module.exports = call
