import { config } from '../config.js'
import { call } from '../helpers/call.js'

/** Broadcast signed transaction */
export const broadcastTransaction = async (signedTransaction, timeout = config.timeout, retry = config.retry) => {
  const result = await call('condenser_api.broadcast_transaction', [
    signedTransaction
  ], timeout, retry)
  return result
}
