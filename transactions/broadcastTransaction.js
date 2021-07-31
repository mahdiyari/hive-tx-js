const call = require('../helpers/call')

/** Broadcast signed transaction */
const broadcastTransaction = async signedTransaction => {
  const result = await call('condenser_api.broadcast_transaction', [
    signedTransaction
  ])
  return result
}

module.exports = broadcastTransaction
