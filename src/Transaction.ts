import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js'
import { getGlobalProps } from './helpers/globalProps'
import { PrivateKey } from './helpers/PrivateKey'
import { DigestData, OperationName, OperationBody, TransactionType } from './types'
import { ByteBuffer } from './helpers/ByteBuffer'
import { Serializer } from './helpers/serializer'
import { sha256 } from '@noble/hashes/sha2.js'
import { config } from './config'
import { call } from './helpers/call'

const chainId = hexToBytes(config.chain_id)

interface TransactionOptions {
  transaction?: TransactionType | Transaction
  /**
   * Transaction expiration in milliseconds (ms) - max 86400000 (24 hours)
   * @default 60_000
   */
  expiration?: number
}

/**
 * Represents a Hive blockchain transaction with operations, signing, and broadcasting capabilities.
 * Supports both single and multi-signature transactions.
 *
 * @example
 * ```typescript
 * const tx = new Transaction();
 * await tx.addOperation('transfer', {
 *   from: 'alice',
 *   to: 'bob',
 *   amount: '1.000 HIVE',
 *   memo: 'Payment'
 * });
 * tx.sign(privateKey);
 * const result = await tx.broadcast();
 * ```
 */
export class Transaction {
  /**
   * The underlying transaction data structure containing operations, signatures, and metadata.
   * Undefined until the transaction is created.
   */
  transaction?: TransactionType

  /** Transaction expiration time in milliseconds from creation. Default is 60 seconds. */
  expiration: number = 60_000

  private txId?: string

  /**
   * Creates a new Transaction instance.
   * @param options Configuration options for the transaction
   * @param options.transaction Optional existing transaction to initialize with
   * @param options.expiration Optional expiration time in milliseconds (default: 60000)
   * @throws Error if a Transaction instance is provided but has an invalid transaction
   */
  constructor(options?: TransactionOptions) {
    if (options?.transaction) {
      if (options.transaction instanceof Transaction) {
        this.transaction = options.transaction.transaction
        this.expiration = options.transaction.expiration
      } else {
        this.transaction = options.transaction
      }
      this.txId = this.digest().txId
    }
    if (options?.expiration) {
      this.expiration = options.expiration
    }
  }

  /**
   * Adds an operation to the transaction. If no transaction exists, creates one first.
   * @template O Operation name type for type safety
   * @param operationName The name/type of the operation to add (e.g., 'transfer', 'vote', 'comment')
   * @param operationBody The operation data/body for the specified operation type
   * @returns Promise that resolves when the operation is added
   * @throws Error if transaction creation fails or global properties cannot be retrieved
   */
  async addOperation<O extends OperationName>(
    operationName: O,
    operationBody: OperationBody<O>
  ): Promise<void> {
    if (!this.transaction) {
      await this.createTransaction(this.expiration)
    }
    this.transaction!.operations.push([operationName, operationBody])
  }

  /**
   * Signs the transaction with the provided key(s), supporting both single and multi-signature transactions.
   * For multi-signature, you can sign with all keys at once or sign individually by calling this method multiple times.
   * @param keys Single PrivateKey or array of PrivateKeys to sign the transaction with
   * @returns The signed transaction
   * @throws Error if no transaction exists to sign
   */
  sign(keys: PrivateKey | PrivateKey[]): TransactionType {
    if (!this.transaction) {
      throw new Error('First create a transaction by .addOperation()')
    }
    if (this.transaction) {
      const { digest, txId } = this.digest()
      if (!Array.isArray(keys)) {
        keys = [keys]
      }
      for (const key of keys) {
        const signature = key.sign(digest)
        this.transaction.signatures.push(signature.customToString())
      }
      this.txId = txId
      return this.transaction
    } else {
      throw new Error('No transaction to sign')
    }
  }

  /**
   * Broadcasts the signed transaction to the Hive network.
   * Automatically handles retries and duplicate transaction detection.
   * @param timeout Timeout in seconds for each broadcast attempt (default: 5)
   * @param retry Number of retry attempts if broadcast fails (default: 5)
   * @returns Promise resolving to broadcast result or error response
   * @throws Error if no transaction exists or transaction is not signed
   */
  async broadcast(timeout = 5, retry = 5) {
    if (!this.transaction) {
      throw new Error('First create a transaction by .addOperation()')
    }
    if (this.transaction.signatures.length === 0) {
      throw new Error('First sign the transaction by .sign(keys)')
    }
    const result = await call(
      'condenser_api.broadcast_transaction',
      [this.transaction],
      timeout,
      retry
    )
    if (result?.error) {
      // When we retry, we might have already broadcasted the transaction
      // So catch duplicate trx error and return trx id
      if (result.error?.message?.includes('Duplicate transaction check failed')) {
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

  /**
   * Returns the transaction digest containing the transaction ID and hash.
   * The digest can be used to verify signatures and for transaction identification.
   * @returns DigestData containing transaction ID and hash
   * @throws Error if no transaction exists
   */
  digest(): DigestData {
    if (!this.transaction) {
      throw new Error('First create a transaction by .addOperation()')
    }
    const buffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
    const temp = { ...this.transaction }
    try {
      Serializer.Transaction(buffer, temp)
    } catch (cause) {
      throw new Error('Unable to serialize transaction: ' + cause)
    }
    buffer.flip()
    const transactionData = new Uint8Array(buffer.toBuffer())
    const txId = bytesToHex(sha256(transactionData)).slice(0, 40)
    const digest = sha256(new Uint8Array([...chainId, ...transactionData]))
    return { digest, txId }
  }

  /**
   * Adds a signature to an already created transaction. Useful when signing with external tools.
   * Multiple signatures can be added one at a time for multi-signature transactions.
   * @param signature The signature string in hex format (must be exactly 130 characters)
   * @returns The transaction with the added signature
   * @throws Error if no transaction exists or signature format is invalid
   */
  addSignature(signature: string): TransactionType {
    if (!this.transaction) {
      throw new Error('First create a transaction by .create(operations)')
    }
    if (typeof signature !== 'string') {
      throw new Error('Signature must be string')
    }
    if (signature.length !== 130) {
      throw new Error('Signature must be 130 characters long')
    }
    this.transaction.signatures.push(signature)
    return this.transaction
  }

  /**
   * Creates the transaction structure and initializes it with blockchain data.
   * Retrieves current head block information and sets up reference block data.
   * @private
   * @param expiration Transaction expiration in milliseconds
   */
  private createTransaction = async (expiration: number) => {
    const props = await getGlobalProps()
    const bytes = hexToBytes(props.head_block_id)
    const refBlockPrefix = Number(new Uint32Array(bytes.buffer, bytes.byteOffset + 4, 1)[0])
    const expirationIso = new Date(Date.now() + expiration).toISOString().slice(0, -5)
    this.transaction = {
      expiration: expirationIso,
      extensions: [],
      operations: [],
      ref_block_num: props.head_block_number & 0xffff,
      ref_block_prefix: refBlockPrefix,
      signatures: []
    }
  }
}
