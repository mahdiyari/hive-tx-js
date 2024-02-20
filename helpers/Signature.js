import { PublicKey } from './PublicKey.js'
import { secp256k1 } from '@noble/curves/secp256k1'

/** ECDSA (secp256k1) signature. */
export class Signature {
  constructor (data, recovery) {
    this.data = data
    this.recovery = recovery
  }

  static from (string) {
    if (typeof string === 'string') {
      const temp = Buffer.from(string, 'hex')
      const recovery = parseInt(temp.subarray(0, 1).toString('hex'), 16) - 31
      const data = temp.subarray(1)
      return new Signature(data, recovery)
    } else {
      return new Error('Expected string for data')
    }
  }

  toBuffer () {
    const buffer = Buffer.alloc(65)
    buffer.writeUInt8(this.recovery + 31, 0)
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
