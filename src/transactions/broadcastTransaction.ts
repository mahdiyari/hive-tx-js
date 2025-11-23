// @ts-nocheck
import { config } from '../config'
import { call } from '../helpers/call'

/** Broadcast signed transaction */
export const broadcastTransaction = async (
  signedTransaction: any,
  timeout = config.timeout,
  retry = config.retry
): Promise<any> => {
  const result = await call(
    'condenser_api.broadcast_transaction',
    [signedTransaction],
    timeout,
    retry
  )
  return result
}
