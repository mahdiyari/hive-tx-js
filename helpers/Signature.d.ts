import { PublicKey } from './PublicKey'

/** ECDSA (secp256k1) signature. */
export class Signature {
  data: Uint8Array
  recovery: number
  constructor(data: Uint8Array, recovery: number, compressed?: boolean)
  toBuffer(): Uint8Array
  /** String representation of the Signature */
  customToString(): string
  /** Create a Signature from string */
  static from(data: string): Signature
  /** Retrieve public key from the Signature by provided Hash message */
  getPublicKey (message: Uint8Array | string): PublicKey
}
