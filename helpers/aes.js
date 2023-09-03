import ByteBuffer from 'bytebuffer-hex-custom'
import { sha256, sha512 } from './crypto.js'
import { aes_256_cbc as AESCBC } from '@noble/ciphers/webcrypto/aes'
import secureRandom from 'secure-random-hive-tx'
const Long = ByteBuffer.Long

export const encrypt = (
  privateKey,
  publicKey,
  message,
  nonce = uniqueNonce()
) => crypt(privateKey, publicKey, nonce, message)

export const decrypt = async (privateKey, publicKey, nonce, message, checksum) => {
  const d = await crypt(privateKey, publicKey, nonce, message, checksum)
  return d.message
}

/**
 * @arg {Buffer} message - Encrypted or plain text message (see checksum)
 * @arg {number} checksum - shared secret checksum (null to encrypt, non-null to decrypt)
 */
const crypt = async (privateKey, publicKey, nonce, message, checksum) => {
  const nonceL = toLongObj(nonce)
  const S = privateKey.getSharedSecret(publicKey)
  let ebuf = new ByteBuffer(
    ByteBuffer.DEFAULT_CAPACITY,
    ByteBuffer.LITTLE_ENDIAN
  )
  ebuf.writeUint64(nonceL)
  ebuf.append(S.toString('binary'), 'binary')
  ebuf = Buffer.from(ebuf.copy(0, ebuf.offset).toBinary(), 'binary')
  const encryptionKey = sha512(ebuf)
  const iv = encryptionKey.subarray(32, 48)
  const tag = encryptionKey.subarray(0, 32)

  // check if first 64 bit of sha256 hash treated as uint64_t truncated to 32 bits.
  const check = sha256(encryptionKey).subarray(0, 4)
  const cbuf = ByteBuffer.fromBinary(
    check.toString('binary'),
    ByteBuffer.DEFAULT_CAPACITY,
    ByteBuffer.LITTLE_ENDIAN
  )
  ByteBuffer.fromBinary(
    check.toString('binary'),
    ByteBuffer.DEFAULT_CAPACITY,
    ByteBuffer.LITTLE_ENDIAN
  )
  const check32 = cbuf.readUint32()
  if (checksum) {
    if (check32 !== checksum) {
      throw new Error('Invalid key')
    }
    message = await cryptoJsDecrypt(message, tag, iv)
  } else {
    message = await cryptoJsEncrypt(message, tag, iv)
  }
  return { nonce: nonceL, message, checksum: check32 }
}

/**
 * This method does not use a checksum, the returned data must be validated some other way.
 * @arg {string|Buffer} ciphertext - binary format
 * @return {Buffer} the decrypted message
 */
const cryptoJsDecrypt = async (message, tag, iv) => {
  let messageBuffer = message
  const decipher = AESCBC(tag, iv)
  messageBuffer = await decipher.decrypt(messageBuffer)
  return Buffer.from(messageBuffer)
}

/**
 * This method does not use a checksum, the returned data must be validated some other way.
 * @arg {string|Buffer} plaintext - binary format
 * @return {Buffer} binary
 */
export const cryptoJsEncrypt = async (message, tag, iv) => {
  let messageBuffer = message
  const cipher = AESCBC(tag, iv)
  messageBuffer = await cipher.encrypt(messageBuffer)
  return Buffer.from(messageBuffer)
}

/** @return {string} unique 64 bit unsigned number string.  Being time based,
 * this is careful to never choose the same nonce twice.  This value could
 * clsbe recorded in the blockchain for a long time.
 */
let uniqueNonceEntropy = null

const uniqueNonce = () => {
  if (uniqueNonceEntropy === null) {
    const uint8randomArr = new Uint8Array(2)
    for (let i = 0; i < 2; ++i) {
      uint8randomArr[i] = secureRandom.randomBuffer(2).readUInt8(i)
    }
    uniqueNonceEntropy = Math.round(
      (uint8randomArr[0] << 8) | uint8randomArr[1]
    )
  }
  let long = Long.fromNumber(Date.now())
  const entropy = ++uniqueNonceEntropy % 0xffff
  long = long.shiftLeft(16).or(Long.fromNumber(entropy))
  return long.toString()
}

const toLongObj = (o) => (o ? (Long.isLong(o) ? o : Long.fromString(o)) : o)
