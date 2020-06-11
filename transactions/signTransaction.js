const ByteBuffer = require('bytebuffer')
const config = require('../config')
const serializer = require('../helpers/serializer')
const crypto = require('../helpers/crypto')
const CHAIN_ID = Buffer.from(config.chain_id, 'hex')

/**
 * Sign a transaction by keys (supports multi signature)
 * @param transaction - transaction to be signed
 * @param keys - Array of keys<Buffer>
 */
const signTransaction = (transaction, keys) => {
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
const transactionDigest = (transaction, chainId = CHAIN_ID) => {
  const buffer = new ByteBuffer(
    ByteBuffer.DEFAULT_CAPACITY,
    ByteBuffer.LITTLE_ENDIAN
  )
  try {
    serializer.Transaction(buffer, transaction)
  } catch (cause) {
    throw new Error('Unable to serialize transaction')
  }
  buffer.flip()
  const transactionData = Buffer.from(buffer.toBuffer())
  const txId = crypto.sha256(transactionData).toString('hex').slice(0, 40)
  const digest = crypto.sha256(Buffer.concat([chainId, transactionData]))
  return { digest, txId }
}

module.exports = signTransaction
