const axios = require('axios')
const config = require('../config')

/**
 * Make calls to steem node
 * @param method - e.g. condenser_api.get_dynamic_global_properties
 * @param params - an array
 */
const call = async (method, params = []) => {
  const res = await axios.post(
    config.node,
    JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: 1
    })
  )
  if (res && res.status === 200) {
    return res.data
  }
}

module.exports = call
