import { call } from "../helpers/call.js"

/** Broadcast signed transaction */
export const broadcastTransaction = async signedTransaction => {
  const result = await call('condenser_api.broadcast_transaction', [
    signedTransaction
  ])
  return result
}
