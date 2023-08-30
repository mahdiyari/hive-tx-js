import ByteBuffer from 'bytebuffer-hex-custom'
import { PublicKey } from './PublicKey.js'

const PublicKeyDeserializer = (buf) => {
  const c = fixedBuf(buf, 33)
  return new PublicKey(c)
}

const UInt64Deserializer = (b) => b.readUint64()

const UInt32Deserializer = (b) => b.readUint32()

const BinaryDeserializer = (b) => {
  const len = b.readVarint32()
  const bCopy = b.copy(b.offset, b.offset + len)
  b.skip(len)
  return Buffer.from(bCopy.toBinary(), 'binary')
}

const BufferDeserializer =
  (keyDeserializers) =>
    (buf) => {
      const obj = {}
      for (const [key, deserializer] of keyDeserializers) {
        try {
        // Decodes a binary encoded string to a ByteBuffer.
          buf = ByteBuffer.fromBinary(
            buf.toString('binary'),
            ByteBuffer.LITTLE_ENDIAN
          )
          obj[key] = deserializer(buf)
        } catch (error) {
          error.message = `${key}: ${error.message}`
          throw error
        }
      }
      return obj
    }

function fixedBuf (b, len) {
  if (!b) {
    throw Error('No buffer found on first parameter')
  } else {
    const bCopy = b.copy(b.offset, b.offset + len)
    b.skip(len)
    return Buffer.from(bCopy.toBinary(), 'binary')
  }
}

const EncryptedMemoDeserializer = BufferDeserializer([
  ['from', PublicKeyDeserializer],
  ['to', PublicKeyDeserializer],
  ['nonce', UInt64Deserializer],
  ['check', UInt32Deserializer],
  ['encrypted', BinaryDeserializer]
])

export const Deserializer = {
  Memo: EncryptedMemoDeserializer
}
