export class Signature {
  data: Buffer
  recovery: number
  static fromBuffer(buffer: Buffer): Signature
  static fromString(string: string): Signature
  constructor(data: Buffer, recovery: number)
  /**
   * Recover public key from signature by providing original signed message.
   * @param message 32-byte message that was used to create the signature.
   */
  recover(message: Buffer, prefix?: string): PublicKey
  toBuffer(): Buffer
  toString(): string
}
