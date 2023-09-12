import bs58 from 'bs58'
import ByteBuffer from 'bytebuffer-hex-custom'
import { Serializer } from './serializer.js'
import { PrivateKey } from './PrivateKey.js'
import * as Aes from './aes.js'
import { PublicKey } from './PublicKey.js'
import { Deserializer } from './deserializer.js'

/**
 * Memo/Any message encoding using AES (aes-cbc algorithm)
 * @param {Buffer|string} private_key Private memo key of sender
 * @param {Buffer|string} public_key public memo key of recipient
 * @param {string} memo message to be encrypted
 * @param {number} testNonce nonce with high entropy
 */
const encode = async (privateKey, publicKey, memo, testNonce) => {
  if (!memo.startsWith('#')) {
    return memo
  }
  memo = memo.substring(1)
  await checkEncryption()
  privateKey = toPrivateObj(privateKey)
  publicKey = toPublicObj(publicKey)
  const mbuf = new ByteBuffer(
    ByteBuffer.DEFAULT_CAPACITY,
    ByteBuffer.LITTLE_ENDIAN
  )
  mbuf.writeVString(memo)
  const memoBuffer = Buffer.from(mbuf.copy(0, mbuf.offset).toBinary(), 'binary')
  const { nonce, message, checksum } = await Aes.encrypt(
    privateKey,
    publicKey,
    memoBuffer,
    testNonce
  )
  const mbuf2 = new ByteBuffer(
    ByteBuffer.DEFAULT_CAPACITY,
    ByteBuffer.LITTLE_ENDIAN
  )
  Serializer.Memo(mbuf2, {
    check: checksum,
    encrypted: message,
    from: privateKey.createPublic(),
    nonce,
    to: publicKey
  })
  mbuf2.flip()
  const data = Buffer.from(mbuf2.toBuffer())
  return '#' + bs58.encode(data)
}

/**
 * Encrypted memo/message decryption
 * @param {PrivateKey|string} private_key Private memo key of recipient
 * @param {string}memo Encrypted message/memo
 */
const decode = async (privateKey, memo) => {
  if (!memo.startsWith('#')) {
    return memo
  }
  memo = memo.substring(1)
  await checkEncryption()
  privateKey = toPrivateObj(privateKey)
  memo = bs58.decode(memo)
  let memoBuffer = Deserializer.Memo(Buffer.from(memo, 'binary'))
  const { from, to, nonce, check, encrypted } = memoBuffer
  const pubkey = privateKey.createPublic().toString()
  const otherpub =
      pubkey === new PublicKey(from.key).toString()
        ? new PublicKey(to.key)
        : new PublicKey(from.key)
  memoBuffer = await Aes.decrypt(privateKey, otherpub, nonce, encrypted, check)
  const mbuf = ByteBuffer.fromBinary(
    memoBuffer.toString('binary'),
    ByteBuffer.LITTLE_ENDIAN
  )
  try {
    mbuf.mark()
    return '#' + mbuf.readVString()
  } catch (e) {
    mbuf.reset()
    // Sender did not length-prefix the memo
    memo = Buffer.from(mbuf.toString('binary'), 'binary')
    return '#' + memo
  }
}

let encodeTest
const checkEncryption = async () => {
  if (encodeTest === undefined) {
    let plaintext
    encodeTest = true // prevent infinate looping
    try {
      const wif = '5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw'
      const pubkey = 'STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA'
      const cyphertext = await encode(wif, pubkey, '#memo爱')
      plaintext = await decode(wif, cyphertext)
    } catch (e) {
      throw new Error(e)
    } finally {
      encodeTest = plaintext === '#memo爱'
    }
  }
  if (encodeTest === false) {
    throw new Error('This environment does not support encryption.')
  }
}

const toPrivateObj = (o) => (o ? (o.key ? o : PrivateKey.fromString(o)) : o)
const toPublicObj = (o) => (o ? (o.key ? o : PublicKey.fromString(o)) : o)

export const Memo = {
  decode,
  encode
}
