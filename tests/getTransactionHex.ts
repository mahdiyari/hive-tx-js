import { sha256 } from '@noble/hashes/sha2.js'
import { callRPC, config, TransactionType } from 'hive-tx'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js'
const CHAIN_ID = hexToBytes(config.chain_id)

export const getTransactionHex = async (transaction: TransactionType) => {
  const res = await callRPC('condenser_api.get_transaction_hex', [transaction])
  if (res) {
    const transactionData = hexToBytes(res).subarray(0, -1)
    const txId = bytesToHex(sha256(transactionData)).slice(0, 40)
    const digest = sha256(new Uint8Array([...CHAIN_ID, ...transactionData]))
    return { digest, txId }
  } else {
    console.log(JSON.stringify(res, null, 2))
    throw new Error(res)
  }
}
