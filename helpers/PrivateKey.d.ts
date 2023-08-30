import { PublicKey } from './PublicKey'
import { Signature } from './Signature'

export type KeyRole = 'owner' | 'active' | 'posting' | 'memo'

/** ECDSA (secp256k1) private key. */
export class PrivateKey {
  key: Buffer

  constructor(key?: Buffer)

  /** Derive the public key for this private key. */
  createPublic(prefix?: string): PublicKey

  inspect(): string

  /**
   * Sign message.
   * @param message 32-byte message.
   */
  sign(message: Buffer): Signature

  /** Return a WIF-encoded representation of the key. */
  toString(): string

  /** Convenience to create a new instance from WIF string or buffer */
  static from(value: string | Buffer): PrivateKey

  /** Create key from username and password. */
  static fromLogin(
    username: string,
    password: string,
    role?: KeyRole
  ): PrivateKey

  /** Create a new instance from a seed. */
  static fromSeed(seed: string): PrivateKey

  /** Create a new instance from a WIF-encoded key. */
  static fromString(wif: string): PrivateKey

  /**
   * Returns a randomly generated instance of PrivateKey
   * Might take up to 250ms
   */
  static randomKey(): PrivateKey

  /**
   * Get shared secret for memo cryptography
   */
  getSharedSecret (publicKey: PublicKey): Buffer
}
