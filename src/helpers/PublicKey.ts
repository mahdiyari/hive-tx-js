import { ripemd160 } from './crypto'
import bs58 from 'bs58'
import { config } from '../config'
import { secp256k1 } from '@noble/curves/secp256k1'
import { Signature } from './Signature'

const DEFAULT_ADDRESS_PREFIX = config.address_prefix

/** ECDSA (secp256k1) public key. */
export class PublicKey {
  key: Uint8Array
  prefix: string

  constructor(key: Uint8Array, prefix?: string) {
    this.key = key
    this.prefix = prefix ?? DEFAULT_ADDRESS_PREFIX
    // assert(secp256k1.publicKeyVerify(key), 'invalid public key')
  }

  /** Create a new instance from a WIF-encoded key. */
  static fromString(wif: string): PublicKey {
    const { key, prefix } = decodePublic(wif)
    return new PublicKey(key, prefix)
  }

  /** Create a new instance. */
  static from(value: string | PublicKey): PublicKey {
    if (value instanceof PublicKey) {
      return value
    } else {
      return PublicKey.fromString(value as string)
    }
  }

  /**
   * Verify a 32-byte signature.
   * @param message 32-byte message to verify.
   * @param signature Signature to verify.
   */
  verify(message: Uint8Array, signature: Signature): boolean {
    return secp256k1.verify(signature.data, message, this.key)
  }

  /** Return a WIF-encoded representation of the key. */
  toString(): string {
    return encodePublic(this.key, this.prefix)
  }

  /** Return JSON representation of this key, same as toString(). */
  toJSON(): string {
    return this.toString()
  }

  inspect(): string {
    return `PublicKey: ${this.toString()}`
  }
}

const encodePublic = (key: Uint8Array, prefix: string): string => {
  const checksum = ripemd160(key)
  return (
    prefix + bs58.encode(new Uint8Array([...key, ...checksum.subarray(0, 4)]))
  )
}

/** Decode bs58+ripemd160-checksum encoded public key. */
const decodePublic = (encodedKey: string) => {
  const prefix = encodedKey.slice(0, 3)
  encodedKey = encodedKey.slice(3)
  const buffer = bs58.decode(encodedKey)
  const key = buffer.subarray(0, buffer.length - 4)
  return { key: key as Uint8Array, prefix }
}
