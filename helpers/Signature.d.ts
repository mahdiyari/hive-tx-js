import { PublicKey } from './PublicKey'

/** ECDSA (secp256k1) signature. */
export class Signature {
  data: Buffer
  recovery: number
  constructor(data: Buffer, recovery: number)
  toBuffer(): Buffer
  /** String representation of the Signature */
  customToString(): string
  /** Create a Signature from string */
  static from(data: string): Signature
}
