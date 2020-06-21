import { PublicKey } from './PublicKey'

export class Signature {
  data: Buffer
  recovery: number
  constructor(data: Buffer, recovery: number)
  toBuffer(): Buffer
  customToString(): string
}
