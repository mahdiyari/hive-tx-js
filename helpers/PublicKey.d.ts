import { Signature } from './Signature'

/** ECDSA (secp256k1) public key. */
export class PublicKey {
  key: Buffer
  prefix: string

  /** Create a new instance from a WIF-encoded key. */
  static fromString(wif: string): PublicKey

  /** Create a new instance. */
  static from(value: string | PublicKey): PublicKey

  constructor(key: Buffer, prefix?: string)

  /**
   * Verify a 32-byte signature.
   * @param message 32-byte message to verify.
   * @param signature Instance of Signature to verify.
   */
  verify(message: Buffer, signature: Signature): boolean

  /** Return a WIF-encoded representation of the key. */
  toString(): string

  /** Return JSON representation of this key, same as toString(). */
  toJSON(): string

  inspect(): string
}
