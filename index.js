const signTransaction = require('./transactions/signTransaction')
const createTransaction = require('./transactions/createTransaction')
const broadcastTransaction = require('./transactions/broadcastTransaction')
const PrivateKey = require('./helpers/PrivateKey')

/** Transaction for Steem blockchain */
class Transaction {
  /** A transaction object could be passed or created later */
  constructor (transaction) {
    this.created = true
    if (!transaction) {
      this.created = false
    }
    this.transaction = transaction
  }

  /** Create the transaction by operations */
  async create (operations) {
    this.transaction = await createTransaction(operations)
    this.created = true
    return this.transaction
  }

  /** Sign the transaction by key or keys[] (supports multi signature) */
  sign (keys) {
    if (!this.created) {
      throw new Error('First create a transaction by .create(operations)')
    }
    this.signedTransaction = signTransaction(this.transaction, keys)
    return this.signedTransaction
  }

  async broadcast () {
    if (!this.created) {
      throw new Error('First create a transaction by .create(operations)')
    }
    if (!this.signedTransaction) {
      throw new Error('First sign the transaction by .sign(keys)')
    }
    const result = await broadcastTransaction(this.signedTransaction)
    return result
  }
}

module.exports = { Transaction, PrivateKey }
