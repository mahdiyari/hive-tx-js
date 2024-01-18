import { signTransaction, transactionDigest } from './transactions/signTransaction.js'
import { createTransaction } from './transactions/createTransaction.js'
import { broadcastTransaction } from './transactions/broadcastTransaction.js'
import { PrivateKey } from './helpers/PrivateKey.js'
import { PublicKey } from './helpers/PublicKey.js'
import { Signature } from './helpers/Signature.js'
import { call } from './helpers/call.js'
import { config } from './config.js'
import { Memo } from './helpers/memo.js'

/** Transaction for Hive blockchain */
class Transaction {
  /** A transaction object could be passed or created later
   * @param {{}} trx Object of transaction - Optional
   */
  constructor (trx = null) {
    this.created = true
    if (!trx) {
      this.created = false
    }
    this.transaction = trx
  }

  /** Create the transaction by operations
   * @param {[Array]} operations
   * @param {Number} expiration Optional - Default 60 seconds
   */
  async create (operations, expiration = 60) {
    this.transaction = await createTransaction(operations, expiration)
    this.created = true
    return this.transaction
  }

  /** Sign the transaction by key or keys[] (supports multi signature).
   * It is also possible to sign with one key at a time for multi signature.
   * @param {PrivateKey|[PrivateKey]} keys single key or multiple keys in array
   */
  sign (keys) {
    if (!this.created) {
      throw new Error('First create a transaction by .create(operations)')
    }
    if (this.signedTransaction) {
      const { signedTransaction, txId } = signTransaction(this.signedTransaction, keys)
      this.signedTransaction = signedTransaction
      this.txId = txId
    } else {
      const { signedTransaction, txId } = signTransaction(this.transaction, keys)
      this.signedTransaction = signedTransaction
      this.txId = txId
    }
    return this.signedTransaction
  }

  /** Broadcast the signed transaction. */
  async broadcast () {
    if (!this.created) {
      throw new Error('First create a transaction by .create(operations)')
    }
    if (!this.signedTransaction) {
      throw new Error('First sign the transaction by .sign(keys)')
    }
    const result = await broadcastTransaction(this.signedTransaction)
    if (result.error) {
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

  /** Return the transaction hash which can be used to verify against a signature */
  digest () {
    if (!this.created) {
      throw new Error('First create a transaction by .create(operations)')
    }
    return transactionDigest(this.transaction)
  }

  /**
   * Add a signature to already created transaction. You can add multiple signatures to one transaction but one at a time.
   * This method is used when you sign your transaction with other tools instead of built-in .sign() method.
   */
  addSignature (signature = '') {
    if (!this.created) {
      throw new Error('First create a transaction by .create(operations)')
    }
    if (typeof signature !== 'string') {
      throw new Error('Signature must be string')
    }
    if (signature.length !== 130) {
      throw new Error('Signature must be 130 characters long')
    }
    if (!this.signedTransaction) {
      this.signedTransaction = { ...this.transaction }
    }
    if (Array.isArray(this.signedTransaction.signature)) {
      this.signedTransaction.signatures.push(signature)
    } else {
      this.signedTransaction.signatures = [signature]
    }
    return this.signedTransaction
  }
}

export { Transaction, PrivateKey, call, config, PublicKey, Signature, Memo }
