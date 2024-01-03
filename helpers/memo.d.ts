import { PrivateKey } from './PrivateKey.js'
import { PublicKey } from './PublicKey.js'

export type Memo = {
  encode (privateKey: PrivateKey, publicKey: PublicKey, memo: string, nonce?: any): Promise<string>
  decode (privateKey: PrivateKey, memo: string): Promise<string>
}