const call = require('../helpers/call')

/** Broadcast signed transaction */
const broadcastTransactionNoResult = async signedTransaction => {
  const result = await call('condenser_api.broadcast_transaction', [
    signedTransaction
  ])
  return result
}

module.exports = broadcastTransactionNoResult
