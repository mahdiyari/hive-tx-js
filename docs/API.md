# API Reference

This document provides detailed information about all classes, methods, and functions available in the hive-tx library.

## Table of Contents

- [Transaction](#transaction)
- [PrivateKey](#privatekey)
- [PublicKey](#publickey)
- [Signature](#signature)
- [Memo](#memo)
- [call](#call)
- [config](#config)
- [Utilities](#utilities)

## Transaction

The main class for creating, signing, and broadcasting Hive blockchain transactions.

### Constructor

```typescript
new Transaction(options?: TransactionOptions)
```

**Parameters:**
- `options` (optional): Configuration object
  - `transaction`: Existing transaction data
  - `expiration`: Transaction expiration in milliseconds (default: 60000)

### Properties

- `transaction`: The current transaction data
- `expiration`: Transaction expiration time in milliseconds

### Methods

#### addOperation()

Adds an operation to the transaction.

```typescript
async addOperation<O extends OperationName>(
  operationName: O,
  operationBody: OperationBody<O>
): Promise<void>
```

**Parameters:**
- `operationName`: The type of operation to add
- `operationBody`: The operation data

**Example:**
```javascript
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Payment'
})
```

#### sign()

Signs the transaction with one or more private keys.

```typescript
sign(keys: PrivateKey | PrivateKey[]): TransactionType
```

**Parameters:**
- `keys`: Single PrivateKey or array of PrivateKeys

**Returns:** Signed transaction object

**Example:**
```javascript
const privateKey = PrivateKey.from('your-key')
tx.sign(privateKey)
// or for multi-sig
tx.sign([key1, key2, key3])
```

#### broadcast()

Broadcasts the signed transaction to the Hive network.

```typescript
async broadcast(timeout?: number, retry?: number): Promise<any>
```

**Parameters:**
- `timeout`: Request timeout in seconds (default: 5)
- `retry`: Number of retry attempts (default: 5)

**Returns:** Promise resolving to broadcast result

**Example:**
```javascript
const result = await tx.broadcast()
console.log('Transaction ID:', result.result.tx_id)
```

#### digest()

Returns the transaction digest containing the transaction ID and hash.

```typescript
digest(): DigestData
```

**Returns:** Object with `digest` (Uint8Array) and `txId` (string)

**Example:**
```javascript
const { digest, txId } = tx.digest()
console.log('Transaction ID:', txId)
```

#### addSignature()

Adds a signature to an already created transaction.

```typescript
addSignature(signature: string): TransactionType
```

**Parameters:**
- `signature`: 130-character hex string signature

**Returns:** Transaction with added signature

**Example:**
```javascript
tx.addSignature('1f019dc13a308cef138162cc16ab7c3aa1891941fddec66d83ff29b01b649a86600802d301f13505abc8c9ccbbeb86852fc71134fe209a6e717c6fd7b4cd1505a2')
```

## PrivateKey

Handles ECDSA (secp256k1) private key operations for signing and encryption.

### Static Methods

#### from()

Creates a PrivateKey instance from a WIF string or raw Uint8Array.

```typescript
static from(value: string | Uint8Array): PrivateKey
```

**Parameters:**
- `value`: WIF string or raw 32-byte key as Uint8Array

**Returns:** New PrivateKey instance

**Example:**
```javascript
const key = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
```

#### fromString()

Creates a PrivateKey from a Wallet Import Format (WIF) encoded string.

```typescript
static fromString(wif: string): PrivateKey
```

**Parameters:**
- `wif`: WIF encoded private key string

**Returns:** New PrivateKey instance

**Example:**
```javascript
const key = PrivateKey.fromString('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
```

#### fromSeed()

Creates a PrivateKey from a seed string or Uint8Array.

```typescript
static fromSeed(seed: string | Uint8Array): PrivateKey
```

**Parameters:**
- `seed`: Seed string or raw byte array

**Returns:** New PrivateKey instance derived from seed

**Example:**
```javascript
const key = PrivateKey.fromSeed('my-secret-seed')
```

#### fromLogin()

Derives a PrivateKey from username, password, and role using Hive's key derivation scheme.

```typescript
static fromLogin(
  username: string,
  password: string,
  role: KeyRole = 'active'
): PrivateKey
```

**Parameters:**
- `username`: Hive username
- `password`: Master password or seed phrase
- `role`: Key role ('owner', 'active', 'posting', 'memo')

**Returns:** New PrivateKey instance for the specified role

**Example:**
```javascript
const postingKey = PrivateKey.fromLogin('username', 'password', 'posting')
```

#### randomKey()

Generates a new cryptographically secure random private key.

```typescript
static randomKey(): PrivateKey
```

**Returns:** New randomly generated PrivateKey instance

**Example:**
```javascript
const key = PrivateKey.randomKey()
console.log('New key:', key.toString())
```

### Instance Methods

#### sign()

Signs a 32-byte message hash using ECDSA and returns a recoverable signature.

```typescript
sign(message: Uint8Array): Signature
```

**Parameters:**
- `message`: 32-byte message hash to sign (Uint8Array)

**Returns:** Signature object containing the signature data

**Example:**
```javascript
import { sha256 } from '@noble/hashes/sha2.js'
const message = sha256('Hello, Hive!')
const signature = key.sign(message)
```

#### createPublic()

Derives the corresponding public key for this private key.

```typescript
createPublic(prefix?: string): PublicKey
```

**Parameters:**
- `prefix`: Optional address prefix (defaults to config.address_prefix)

**Returns:** PublicKey instance derived from this private key

**Example:**
```javascript
const publicKey = key.createPublic()
console.log('Public key:', publicKey.toString())
```

#### toString()

Returns the private key as a Wallet Import Format (WIF) encoded string.

```typescript
toString(): string
```

**Returns:** WIF encoded private key string

**Example:**
```javascript
const wif = key.toString()
console.log('WIF key:', wif)
```

#### inspect()

Returns a masked representation of the private key for debugging/logging.

```typescript
inspect(): string
```

**Returns:** Masked key representation for safe logging

**Example:**
```javascript
console.log(key.inspect()) // PrivateKey: 5JdeC9...Qnsw
```

#### getSharedSecret()

Computes a shared secret using ECDH key exchange for memo encryption.

```typescript
getSharedSecret(publicKey: PublicKey): Uint8Array
```

**Parameters:**
- `publicKey`: Other party's public key

**Returns:** 64-byte shared secret as Uint8Array

**Example:**
```javascript
const sharedSecret = key.getSharedSecret(otherPublicKey)
```

## PublicKey

Handles public key operations and verification.

### Static Methods

#### fromString()

Creates a PublicKey from a string representation.

```typescript
static fromString(wif: string): PublicKey
```

**Parameters:**
- `wif`: Public key string (e.g., "STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA")

**Returns:** New PublicKey instance

**Example:**
```javascript
const key = PublicKey.fromString('STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA')
```

#### from()

Creates a PublicKey from a string or returns the instance if already a PublicKey.

```typescript
static from(value: string | PublicKey): PublicKey
```

**Parameters:**
- `value`: Public key string or PublicKey instance

**Returns:** New or existing PublicKey instance

**Example:**
```javascript
const key = PublicKey.from('STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA')
```

### Instance Methods

#### verify()

Verifies a signature against a message hash.

```typescript
verify(message: Uint8Array, signature: Signature): boolean
```

**Parameters:**
- `message`: 32-byte message hash to verify
- `signature`: Signature object to verify

**Returns:** True if signature is valid, false otherwise

**Example:**
```javascript
const isValid = publicKey.verify(message, signature)
console.log('Signature valid:', isValid)
```

#### toString()

Returns the public key as a string for storage or transmission.

```typescript
toString(): string
```

**Returns:** Public key string with prefix

**Example:**
```javascript
const keyString = publicKey.toString()
console.log('Public key:', keyString)
```

#### toJSON()

Returns JSON representation (same as toString()).

```typescript
toJSON(): string
```

**Returns:** Public key string

**Example:**
```javascript
const json = JSON.stringify(publicKey)
console.log('JSON:', json)
```

#### inspect()

Returns a string representation for debugging.

```typescript
inspect(): string
```

**Returns:** Formatted public key string

**Example:**
```javascript
console.log(publicKey.inspect()) // PublicKey: STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA
```

## Signature

Manages digital signatures for transaction signing and verification.

### Static Methods

#### from()

Creates a Signature from a hex string.

```typescript
static from(string: string): Signature
```

**Parameters:**
- `string`: 130-character hex string containing signature and recovery data

**Returns:** New Signature instance

**Example:**
```javascript
const signature = Signature.from('1f019dc13a308cef138162cc16ab7c3aa1891941fddec66d83ff29b01b649a86600802d301f13505abc8c9ccbbeb86852fc71134fe209a6e717c6fd7b4cd1505a2')
```

### Instance Methods

#### toBuffer()

Converts signature to 65-byte buffer format.

```typescript
toBuffer(): Uint8Array
```

**Returns:** 65-byte buffer containing recovery byte + signature data

**Example:**
```javascript
const buffer = signature.toBuffer()
console.log('Buffer length:', buffer.length)
```

#### customToString()

Returns signature as 130-character hex string.

```typescript
customToString(): string
```

**Returns:** Hex string representation of signature

**Example:**
```javascript
const hexString = signature.customToString()
console.log('Signature hex:', hexString)
```

#### getPublicKey()

Recovers the public key from this signature and message.

```typescript
getPublicKey(message: Uint8Array | string): PublicKey
```

**Parameters:**
- `message`: 32-byte message hash (Uint8Array) or 64-character hex string

**Returns:** PublicKey that created this signature

**Example:**
```javascript
const recoveredKey = signature.getPublicKey(message)
console.log('Recovered public key:', recoveredKey.toString())
```

## Memo

Handles encrypted memo operations for secure private messaging.

### Methods

#### encode()

Encrypts a memo for secure private messaging.

```typescript
static encode(
  privateKey: string | PrivateKey,
  publicKey: string | PublicKey,
  memo: string,
  testNonce?: any
): string
```

**Parameters:**
- `privateKey`: Sender's private memo key (string WIF format or PrivateKey instance)
- `publicKey`: Recipient's public memo key (string or PublicKey instance)
- `memo`: Message to encrypt (must start with '#' for encryption)
- `testNonce`: Optional nonce for testing (advanced usage)

**Returns:** Encrypted memo string prefixed with '#'

**Example:**
```javascript
const encrypted = Memo.encode(senderKey, recipientKey, '#Secret message')
```

#### decode()

Decrypts an encrypted memo message.

```typescript
static decode(
  privateKey: string | PrivateKey,
  memo: string
): string
```

**Parameters:**
- `privateKey`: Recipient's private memo key (string WIF format or PrivateKey instance)
- `memo`: Encrypted memo string (must start with '#' for decryption)

**Returns:** Decrypted memo content with '#' prefix

**Example:**
```javascript
const decrypted = Memo.decode(recipientKey, encryptedMemo)
console.log('Decrypted:', decrypted)
```



## call

Makes API calls to Hive blockchain nodes with automatic retry and failover support.

```typescript
call(
  method: string,
  params?: any[] | object,
  timeout?: number,
  retry?: number
): Promise<any>
```

**Parameters:**
- `method`: The API method name (e.g., 'condenser_api.get_accounts')
- `params`: Parameters for the API method as array or object
- `timeout`: Request timeout in seconds (default: config.timeout)
- `retry`: Number of retry attempts before failing (default: config.retry)

**Returns:** Promise resolving to the API response

**Example:**
```javascript
const accounts = await call('condenser_api.get_accounts', [['username']])
const props = await call('condenser_api.get_dynamic_global_properties')
```

## config

Configuration object for customizing hive-tx library behavior.

### Properties

- `node`: Array of Hive API node endpoints for load balancing and failover
- `chain_id`: The Hive blockchain chain ID for transaction signing and verification
- `address_prefix`: Address prefix used for public key formatting (STM for mainnet)
- `timeout`: Timeout in seconds for individual API calls (default: 5)
- `retry`: Number of retry attempts for failed API calls (default: 5)
- `healthcheckInterval`: Interval in milliseconds for periodic node health checks (default: 30000)

### Example

```javascript
import { config } from 'hive-tx'

// Use a specific node instead of the default array
config.node = ['https://api.hive.blog']

// Custom timeout and retry settings
config.timeout = 10
config.retry = 3

// Custom chain configuration
config.chain_id = 'beeab0de00000000000000000000000000000000000000000000000000000000'
config.address_prefix = 'STM'
```

## Utilities

### validateUsername

Validates a Hive username format.

```typescript
validateUsername(username: string): null | string
```

**Parameters:**
- `username`: Username to validate

**Returns:** null if valid, error message if invalid

**Example:**
```javascript
import { validateUsername } from 'hive-tx/helpers/utils'

const result = validateUsername('valid-username')
if (result === null) {
  console.log('Username is valid')
} else {
  console.log('Invalid username:', result)
}
```

### operations

Operation type constants for use with `makeBitMaskFilter`.

```typescript
const operations = {
  vote: 0,
  comment: 1,
  transfer: 2,
  // ... all operation types
}
```

**Example:**
```javascript
import { operations } from 'hive-tx/helpers/utils'
console.log(operations.transfer) // 2
```

### makeBitMaskFilter

Make bitmask filter to be used with get_account_history call.

```typescript
makeBitMaskFilter(allowedOperations: number[]): any[]
```

**Parameters:**
- `allowedOperations`: Array of operation type numbers to include

**Returns:** Filter array for use with get_account_history

**Example:**
```javascript
import { makeBitMaskFilter, operations } from 'hive-tx/helpers/utils'

const filter = makeBitMaskFilter([operations.transfer, operations.transfer_to_vesting])
const history = await call('condenser_api.get_account_history', ['username', -1, 1000, ...filter])
```

### buildWitnessSetProperties

Build witness set properties operation data.

```typescript
buildWitnessSetProperties(owner: string, props: WitnessProps): ['witness_set_properties', any]
```

**Parameters:**
- `owner`: Witness account name
- `props`: Witness properties object

**Returns:** Witness set properties operation tuple

**Example:**
```javascript
import { buildWitnessSetProperties } from 'hive-tx/helpers/utils'

const witnessOps = buildWitnessSetProperties('witness-account', {
  key: 'STM1111111111111111111111111111111114T1Anm',
  account_creation_fee: '0.000 HIVE',
  maximum_block_size: 65536
})
