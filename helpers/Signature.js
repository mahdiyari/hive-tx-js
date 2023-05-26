import { PublicKey } from "./PublicKey.js"
import { Signature as SECPSignature } from '@noble/secp256k1'

/** ECDSA (secp256k1) signature. */
export class Signature {
  constructor (data, recovery) {
    this.data = data
    this.recovery = recovery
  }

  static from (string) {
    if (typeof string === 'string') {
      const temp = Buffer.from(string, 'hex')
      const recovery = parseInt(temp.slice(0, 1).toString('hex'), 16) - 31
      const data = temp.slice(1)
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
    const r = BigInt('0x' + this.data.subarray(0, 32).toString('hex'))
    const s = BigInt('0x' + this.data.subarray(32, 64).toString('hex'))
    const temp = new SECPSignature(r, s, this.recovery)
    return new PublicKey(Buffer.from(temp.recoverPublicKey(message).toHex(), 'hex'))
  }
}
