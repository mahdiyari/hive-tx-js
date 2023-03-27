import ByteBuffer from 'bytebuffer-hex-custom'
import { config } from '../config.js'
import { sha256 } from '../helpers/crypto.js'
import { Serializer } from '../helpers/serializer.js'

const CHAIN_ID = Buffer.from(config.chain_id, 'hex')

/**
 * Sign a transaction by keys (supports multi signature)
 * @param transaction - transaction to be signed
 * @param keys - Array of keys<Buffer>
 */
export const signTransaction = (transaction, keys) => {
  const CHAIN_ID = Buffer.from(config.chain_id, 'hex')
  const { digest, txId } = transactionDigest(transaction, CHAIN_ID)
  const signedTransaction = { ...transaction }
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
export const transactionDigest = (transaction, chainId = CHAIN_ID) => {
  const buffer = new ByteBuffer(
    ByteBuffer.DEFAULT_CAPACITY,
    ByteBuffer.LITTLE_ENDIAN
  )
  try {
    Serializer.Transaction(buffer, transaction)
  } catch (cause) {
    throw new Error('Unable to serialize transaction')
  }
  buffer.flip()
  const transactionData = Buffer.from(buffer.toBuffer())
  const txId = sha256(transactionData).toString('hex').slice(0, 40)
  const digest = sha256(Buffer.concat([chainId, transactionData]))
  return { digest, txId }
}
