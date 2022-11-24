import { PrivateKey as PK } from './helpers/PrivateKey'
import { PublicKey as PubK } from './helpers/PublicKey'
import { Signature as Sig } from './helpers/Signature'

declare module 'hive-tx'

export class PrivateKey extends PK {}
export class PublicKey extends PubK {}
export class Signature extends Sig {}

export class Transaction {
  constructor(trx?: object)

  broadcast(): Promise<{
    id: number
    jsonrpc: string
    result: { tx_id: string; status: string }
  } | {error: object}>

  broadcastNoResult(): Promise<{
    id: number
    jsonrpc: string
    result: { tx_id: string; status: string }
  }>

  create(
    operations: any[],
    expiration?: number
  ): Promise<{
    expiration: string
    extensions: any[]
    operations: any[]
    ref_block_num: number
    ref_block_prefix: number
  }>

  sign(keys: any | any[]): {
    expiration: string
    extensions: any[]
    operations: any[]
    ref_block_num: number
    ref_block_prefix: number
    signatures: string[]
  }

  digest(): {
    digest: Buffer,
    txId: string
  }
}

export const config: {
  address_prefix: string
  chain_id: string
  node: string
}

export function call(method: string, params?: any[] | object, timeout?: number): any

// TODO: remove on a major update
/** Don't need anymore - deprecated */
export function updateOperations(): void
