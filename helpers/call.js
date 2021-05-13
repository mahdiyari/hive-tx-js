const axios = require('axios')
const config = require('../config')

/**
 * Make calls to hive node
 * @param {string}method - e.g. condenser_api.get_dynamic_global_properties
 * @param {Array}params - an array
 * @param {Number}timeout - optional - default 10 seconds
 */
const call = async (method, params = [], timeout = 10) => {
  let resolved = 0
  return new Promise((resolve, reject) => {
    axios
      .post(
        config.node,
        JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: 1
        })
      )
      .then(res => {
        if (res && res.status === 200) {
          resolved = 1
          resolve(res.data)
        }
      })
    setTimeout(() => {
      if (!resolved) {
        reject(new Error('Network timeout.'))
      }
    }, timeout * 1000)
  })
}

module.exports = call
