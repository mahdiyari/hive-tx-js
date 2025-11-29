import { PrivateKey } from './helpers/PrivateKey'
import { PublicKey } from './helpers/PublicKey'
import { Signature } from './helpers/Signature'
import { call } from './helpers/call'
import { config } from './config'
import { Memo } from './helpers/memo'
import * as utils from './helpers/utils'
import { Transaction } from './Transaction'

/**
 * @fileoverview Lightweight and complete JavaScript library for Hive blockchain operations.
 * Provides transaction creation, signing, broadcasting, cryptographic utilities, and blockchain API calls.
 *
 * @example
 * ```typescript
 * import { Transaction, PrivateKey, call } from 'hive-tx'
 *
 * // Create and broadcast a transaction
 * const tx = new Transaction()
 * await tx.addOperation('transfer', {
 *   from: 'alice',
 *   to: 'bob',
 *   amount: '1.000 HIVE',
 *   memo: 'Payment'
 * })
 * tx.sign(PrivateKey.from('your-private-key'))
 * await tx.broadcast()
 *
 * // Make API calls
 * const accounts = await call('condenser_api.get_accounts', [['alice']])
 * ```
 */

/**
 * Transaction class for creating, signing, and broadcasting Hive blockchain transactions.
 */
export { Transaction } from './Transaction'

/**
 * Private key utilities for cryptographic operations including signing and key generation.
 */
export { PrivateKey } from './helpers/PrivateKey'

/**
 * Function for making API calls to Hive blockchain nodes with automatic retry and failover.
 */
export { call } from './helpers/call'

/**
 * Library configuration object for customizing node endpoints, timeouts, and other settings.
 */
export { config } from './config'

/**
 * Public key utilities for cryptographic verification and key management.
 */
export { PublicKey } from './helpers/PublicKey'

/**
 * Signature class for handling digital signatures and signature recovery.
 */
export { Signature } from './helpers/Signature'

/**
 * Memo utilities for encrypting and decrypting private messages between users.
 */
export { Memo } from './helpers/memo'

/**
 * Utility functions including username validation, operation filters, and witness properties.
 */
export * as utils from './helpers/utils'

export default {
  Transaction,
  PrivateKey,
  call,
  config,
  PublicKey,
  Signature,
  Memo,
  utils
}
