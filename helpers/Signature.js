import { PublicKey } from './PublicKey.js'
import { secp256k1 } from '@noble/curves/secp256k1'

/** ECDSA (secp256k1) signature. */
export class Signature {
  constructor (data, recovery, compressed = true) {
    this.data = data
    this.recovery = recovery
    this.compressed = compressed
  }

  static from (string) {
    if (typeof string === 'string') {
      const temp = Buffer.from(string, 'hex')
      let recovery = parseInt(temp.subarray(0, 1).toString('hex'), 16) - 31
      let compressed = true
      // non-compressed signatures have -4
      // https://github.com/bitcoin/bitcoin/blob/95ea54ba089610019a74c1176a2c7c0dba144b1c/src/key.cpp#L257
      if (recovery < 0) {
        compressed = false
        recovery = recovery + 4
      }
      const data = temp.subarray(1)
      return new Signature(data, recovery, compressed)
    } else {
      return new Error('Expected string for data')
    }
  }

  toBuffer () {
    const buffer = Buffer.alloc(65)
    if (this.compressed) {
      buffer.writeUInt8(this.recovery + 31, 0)
    } else {
      buffer.writeUInt8(this.recovery + 27, 0)
    }
    this.data.copy(buffer, 1)
    return buffer
  }

  customToString () {
    return this.toBuffer().toString('hex')
  }

  getPublicKey (message) {
    if (Buffer.isBuffer(message) && message.length !== 32) {
      return new Error('Expected a valid sha256 hash as message')
    }
    if (typeof message === 'string' && message.length !== 64) {
      return new Error('Expected a valid sha256 hash as message')
    }
    const sig = secp256k1.Signature.fromCompact(this.data)
    const temp = new secp256k1.Signature(sig.r, sig.s, this.recovery)
    return new PublicKey(Buffer.from(temp.recoverPublicKey(message).toHex(), 'hex'))
  }
}
