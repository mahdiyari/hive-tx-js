import { hexToBytes } from '@noble/hashes/utils.js'
import { getGlobalProps } from './helpers/globalProps'
import { PrivateKey } from './helpers/PrivateKey'
import { broadcastTransaction } from './transactions/broadcastTransaction'
import { signTransaction, transactionDigest } from './transactions/signTransaction'
import { DigestData, Operation, SignedTransaction, TransactionType } from './types'

/** Transaction for Hive blockchain */
export class Transaction {
  created: boolean
  transaction: TransactionType | null
  signedTransaction: SignedTransaction | null = null
  txId?: string

  /** A transaction object could be passed or created later
   * @param {{}} trx Object of transaction - Optional
   */
  constructor(trx: TransactionType | SignedTransaction | null = null) {
    this.created = !!trx
    this.transaction = trx && !('signatures' in trx) ? trx : null
    this.signedTransaction = trx && 'signatures' in trx ? trx : null
  }

  /** Create the transaction by operations
   * @param operations
   * @param expiration Optional - Default 60 seconds
   */
  async create(operations: Operation[], expiration = 60): Promise<TransactionType> {
    this.transaction = await this.createTransaction(operations, expiration)
    this.created = true
    return <TransactionType>this.transaction
  }

  /** Sign the transaction by key or keys[] (supports multi signature).
   * It is also possible to sign with one key at a time for multi signature.
   * @param keys single key or multiple keys in array
   */
  sign(keys: PrivateKey | PrivateKey[]): SignedTransaction {
    if (!this.created) {
      throw new Error('First create a transaction by .create(operations)')
    }
    if (this.signedTransaction) {
      const { signedTransaction, txId } = signTransaction(this.signedTransaction, keys)
      this.signedTransaction = signedTransaction
      this.txId = txId
    } else if (this.transaction) {
      const { signedTransaction, txId } = signTransaction(this.transaction, keys)
      this.signedTransaction = signedTransaction
      this.txId = txId
    } else {
      throw new Error('No transaction to sign')
    }
    return this.signedTransaction
  }

  /** Broadcast the signed transaction. */
  async broadcast(timeout = 5, retry = 5) {
    if (!this.created) {
      throw new Error('First create a transaction by .create(operations)')
    }
    if (!this.signedTransaction) {
      throw new Error('First sign the transaction by .sign(keys)')
    }
    const result = await broadcastTransaction(this.signedTransaction, timeout, retry)
    if (result.error) {
      // When we retry, we might have already broadcasted the transaction
      // So catch duplicate trx error and return trx id
      if (result.error.message.includes('Duplicate transaction check failed')) {
        return {
          id: 1,
          jsonrpc: '2.0',
          result: { tx_id: this.txId, status: 'unkown' }
        }
      }
      return result
    }
    if (!this.txId) {
      this.txId = this.digest().txId
    }
    return {
      id: 1,
      jsonrpc: '2.0',
      result: { tx_id: this.txId, status: 'unkown' }
    }
  }

  /** Return the transaction id and hash which can be used to verify against a signature */
  digest(): DigestData {
    if (!this.created || !this.transaction) {
      throw new Error('First create a transaction by .create(operations)')
    }
    return transactionDigest(this.transaction)
  }

  /**
   * Add a signature to already created transaction. You can add multiple signatures to one transaction but one at a time.
   * This method is used when you sign your transaction with other tools instead of built-in .sign() method.
   */
  addSignature(signature: string): SignedTransaction {
    if (!this.created || !this.transaction) {
      throw new Error('First create a transaction by .create(operations)')
    }
    if (typeof signature !== 'string') {
      throw new Error('Signature must be string')
    }
    if (signature.length !== 130) {
      throw new Error('Signature must be 130 characters long')
    }
    if (!this.signedTransaction) {
      this.signedTransaction = {
        ...this.transaction,
        signatures: []
      }
    }
    this.signedTransaction.signatures.push(signature)
    return this.signedTransaction
  }

  /** @param expiration Transaction expiration in ms */
  private createTransaction = async (operations: Operation[], expiration: number = 60_000) => {
    const props = await getGlobalProps()
    const refBlockNum = props.head_block_number & 0xffff
    const uintArray = hexToBytes(props.head_block_id)
    const dataView = new DataView(uintArray.buffer)
    const refBlockPrefix = dataView.getUint32(4, true)
    const expirationIso = new Date(Date.now() + expiration).toISOString().slice(0, -5)
    const extensions: any[] = []
    return {
      expiration: expirationIso,
      extensions,
      operations,
      ref_block_num: refBlockNum,
      ref_block_prefix: refBlockPrefix
    }
  }
}
