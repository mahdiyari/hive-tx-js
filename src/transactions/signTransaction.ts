import { ByteBuffer } from '../helpers/ByteBuffer'
import { config } from '../config'
import { Serializer } from '../helpers/serializer'
import { PrivateKey } from '../helpers/PrivateKey'
import { TransactionType, SignedTransaction } from '../types'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js'
import { sha256 } from '@noble/hashes/sha2.js'

const CHAIN_ID = hexToBytes(config.chain_id)

/**
 * Sign a transaction by keys (supports multi signature)
 * @param transaction - transaction to be signed
 * @param keys - Array of keys<Buffer>
 */
export const signTransaction = (
  transaction: TransactionType | SignedTransaction,
  keys: PrivateKey | PrivateKey[]
): { signedTransaction: SignedTransaction; txId: string } => {
  const { digest, txId } = transactionDigest(transaction, CHAIN_ID)
  const signedTransaction = { ...transaction } as SignedTransaction
  if (!signedTransaction.signatures) {
    signedTransaction.signatures = []
  }
  if (!Array.isArray(keys)) {
    keys = [keys]
  }
  for (const key of keys) {
    const signature = key.sign(digest)
    signedTransaction.signatures.push(signature.customToString())
  }

  return { signedTransaction, txId }
}

/** Serialize transaction */
export const transactionDigest = (transaction: TransactionType, chainId = CHAIN_ID) => {
  const buffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
  const temp = { ...transaction }
  try {
    Serializer.Transaction(buffer, temp)
  } catch (cause) {
    throw new Error('Unable to serialize transaction: ' + cause)
  }
  buffer.flip()
  const transactionData = new Uint8Array(buffer.toBuffer())
  const txId = bytesToHex(sha256(transactionData)).slice(0, 40)
  const digest = sha256(new Uint8Array([...chainId, ...transactionData]))
  return { digest, txId }
}
