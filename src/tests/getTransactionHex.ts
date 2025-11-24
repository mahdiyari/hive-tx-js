import { sha256 } from '@noble/hashes/sha2.js'
import { TransactionType } from '../types'
import { call } from '../helpers/call'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js'
import { config } from '../config'
const CHAIN_ID = hexToBytes(config.chain_id)

export const getTransactionHex = async (transaction: TransactionType) => {
  const res = await call('condenser_api.get_transaction_hex', [transaction])
  if (res && res.result) {
    const transactionData = hexToBytes(res.result).subarray(0, -1)
    const txId = bytesToHex(sha256(transactionData)).slice(0, 40)
    const digest = sha256(new Uint8Array([...CHAIN_ID, ...transactionData]))
    return { digest, txId }
  } else {
    console.log(JSON.stringify(res, null, 2))
    throw new Error(res)
  }
}
