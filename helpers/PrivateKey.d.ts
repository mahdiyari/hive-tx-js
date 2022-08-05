import { PublicKey } from './PublicKey'
import { Signature } from './Signature'

export type KeyRole = 'owner' | 'active' | 'posting' | 'memo'

export class PrivateKey {
  key: Buffer

  constructor(key?: Buffer)

  createPublic(prefix?: string): PublicKey

  inspect(): string

  sign(message: Buffer): Signature

  toString(): string

  static from(value: string | Buffer): PrivateKey

  static fromLogin(
    username: string,
    password: string,
    role?: KeyRole
  ): PrivateKey

  static fromSeed(seed: string): PrivateKey

  static fromString(wif: string): PrivateKey
}
