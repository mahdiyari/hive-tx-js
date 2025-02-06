import { ByteBuffer } from '../helpers/ByteBuffer.js'
// import ByteBuffer2 from 'bytebuffer-hex-custom'
import { config } from '../config.js'
import { sha256 } from '../helpers/crypto.js'
import { Serializer } from '../helpers/serializer.js'
import { hexToUint8Array, uint8ArrayToHex } from '../helpers/uint8Array.js'

const CHAIN_ID = hexToUint8Array(config.chain_id)

/**
 * Sign a transaction by keys (supports multi signature)
 * @param transaction - transaction to be signed
 * @param keys - Array of keys<Buffer>
 */
export const signTransaction = (transaction, keys) => {
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
  // const buffer2 = new ByteBuffer2(
  //   ByteBuffer2.DEFAULT_CAPACITY,
  //   ByteBuffer2.LITTLE_ENDIAN
  // )
  const temp = { ...transaction }
  // const temp2 = { ...transaction }
  try {
    Serializer.Transaction(buffer, temp)
    // Serializer.Transaction(buffer2, temp2)
  } catch (cause) {
    throw new Error('Unable to serialize transaction: ' + cause)
  }
  buffer.flip()
  // console.log(buffer.toBuffer())
  // console.log(buffer2.toBuffer())
  const transactionData = new Uint8Array(buffer.toBuffer())
  // console.log(uint8ArrayToHex(transactionData))
  const txId = uint8ArrayToHex(sha256(transactionData)).slice(0, 40)
  const digest = sha256(new Uint8Array([...chainId, ...transactionData]))
  return { digest, txId }
}
