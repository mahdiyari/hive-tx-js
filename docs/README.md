# Hive Transaction Library Documentation

Welcome to the comprehensive documentation for the Hive Transaction (hive-tx) library. This guide will help you understand how to use this lightweight and complete JavaScript/TypeScript library for Hive blockchain operations.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Advanced Usage](#advanced-usage)
- [Migration Guide](#migration-guide)
- [Contributing](#contributing)

## Introduction

The hive-tx library is a lightweight, complete, and easy-to-integrate JavaScript/TypeScript SDK for the Hive blockchain. It provides all the necessary tools to create, sign, and broadcast transactions with full type safety and cryptographic support.

### Key Features

- **Lightweight**: Minimal bundle size (~141 KiB minified + gzipped for browser)
- **Complete**: Full support for all Hive blockchain operations
- **TypeScript Ready**: Full type definitions included
- **Cross-Platform**: Works in both browser and Node.js environments
- **Secure**: Uses industry-standard cryptographic libraries (@noble/*)
- **Reliable**: Built-in retry and failover mechanisms
- **Simple**: Clean, intuitive API design

### Why hive-tx?

The hive-tx library was created to address common issues with other Hive libraries:

- **Lightweight**: Minimal footprint compared to other libraries
- **Easy Integration**: Works with modern frameworks and build systems
- **Framework Compatible**: No conflicts with frameworks like Nativescript
- **Modern**: Uses modern JavaScript/TypeScript standards
- **Well-Tested**: Comprehensive test coverage

## Installation

```bash
npm install hive-tx --save
```

### CDN Usage

For browser usage without a build system:

```html
<script src="https://cdn.jsdelivr.net/npm/hive-tx/dist/hive-tx.min.js"></script>
```

## Quick Start

### Node.js (ES Modules)

```javascript
import { call, Transaction, PrivateKey } from 'hive-tx'

// Create and sign a transaction
const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'your-username',
  author: 'post-author',
  permlink: 'post-permlink',
  weight: 10000 // 100%
})

const privateKey = PrivateKey.from('your-private-key')
tx.sign(privateKey)

const result = await tx.broadcast()
console.log('Transaction broadcasted:', result)
```

### Browser Usage

```html
<script src="https://cdn.jsdelivr.net/npm/hive-tx/dist/hive-tx.min.js"></script>
<script>
// hiveTx is available globally
const tx = new hiveTx.Transaction()
// ... rest of the code
</script>
```

## Core Concepts

### Transaction Lifecycle

1. **Create**: Initialize a transaction with operations
2. **Sign**: Sign the transaction with private keys
3. **Broadcast**: Send the transaction to the Hive network

### Key Components

- **Transaction**: Main class for creating, signing, and broadcasting transactions
- **PrivateKey**: Handles private key operations and signing
- **PublicKey**: Handles public key operations and verification
- **Signature**: Manages digital signatures
- **Memo**: Handles encrypted memo operations
- **call**: Makes API calls to Hive nodes

## API Reference

### Transaction Class

The `Transaction` class is the core component for handling blockchain transactions.

#### Constructor

```typescript
new Transaction(options?: {
  transaction?: TransactionType | Transaction
  expiration?: number // Transaction expiration in milliseconds (default: 60000)
})
```

#### Methods

##### addOperation()

Adds an operation to the transaction.

```typescript
async addOperation<O extends OperationName>(
  operationName: O,
  operationBody: OperationBody<O>
): Promise<void>
```

##### sign()

Signs the transaction with one or more private keys.

```typescript
sign(keys: PrivateKey | PrivateKey[]): TransactionType
```

##### broadcast()

Broadcasts the signed transaction to the Hive network.

```typescript
async broadcast(timeout?: number, retry?: number): Promise<any>
```

##### digest()

Returns the transaction digest containing the transaction ID and hash.

```typescript
digest(): DigestData
```

##### addSignature()

Adds a signature to an already created transaction.

```typescript
addSignature(signature: string): TransactionType
```

### PrivateKey Class

Handles ECDSA (secp256k1) private key operations for signing and encryption.

#### Static Methods

##### from()

Creates a PrivateKey instance from a WIF string or raw Uint8Array.

```typescript
static from(value: string | Uint8Array): PrivateKey
```

##### fromString()

Creates a PrivateKey from a Wallet Import Format (WIF) encoded string.

```typescript
static fromString(wif: string): PrivateKey
```

##### fromSeed()

Creates a PrivateKey from a seed string or Uint8Array.

```typescript
static fromSeed(seed: string | Uint8Array): PrivateKey
```

##### fromLogin()

Derives a PrivateKey from username, password, and role using Hive's key derivation scheme.

```typescript
static fromLogin(
  username: string,
  password: string,
  role: KeyRole = 'active'
): PrivateKey
```

##### randomKey()

Generates a new cryptographically secure random private key.

```typescript
static randomKey(): PrivateKey
```

#### Instance Methods

##### sign()

Signs a 32-byte message hash using ECDSA and returns a recoverable signature.

```typescript
sign(message: Uint8Array): Signature
```

##### createPublic()

Derives the corresponding public key for this private key.

```typescript
createPublic(prefix?: string): PublicKey
```

##### toString()

Returns the private key as a Wallet Import Format (WIF) encoded string.

```typescript
toString(): string
```

##### getSharedSecret()

Computes a shared secret using ECDH key exchange for memo encryption.

```typescript
getSharedSecret(publicKey: PublicKey): Uint8Array
```

### PublicKey Class

Handles public key operations and verification.

#### Static Methods

##### fromString()

Creates a PublicKey from a string representation.

```typescript
static fromString(wif: string): PublicKey
```

##### from()

Creates a PublicKey from a string or returns the instance if already a PublicKey.

```typescript
static from(value: string | PublicKey): PublicKey
```

#### Instance Methods

##### verify()

Verifies a signature against a message hash.

```typescript
verify(message: Uint8Array, signature: Signature): boolean
```

##### toString()

Returns the public key as a string for storage or transmission.

```typescript
toString(): string
```

### Signature Class

Manages digital signatures for transaction signing and verification.

#### Static Methods

##### from()

Creates a Signature from a hex string.

```typescript
static from(string: string): Signature
```

#### Instance Methods

##### customToString()

Returns signature as 130-character hex string.

```typescript
customToString(): string
```

##### getPublicKey()

Recovers the public key from this signature and message.

```typescript
getPublicKey(message: Uint8Array | string): PublicKey
```

### Memo Utilities

Handles encrypted memo operations for secure private messaging.

#### encode()

Encrypts a memo for secure private messaging.

```typescript
Memo.encode(
  privateKey: string | PrivateKey,
  publicKey: string | PublicKey,
  memo: string,
  testNonce?: any
): string
```

#### decode()

Decrypts an encrypted memo message.

```typescript
Memo.decode(
  privateKey: string | PrivateKey,
  memo: string
): string
```

### Configuration

The library can be configured through the `config` object:

```typescript
import { config } from 'hive-tx'

// Configure API nodes
config.node = [
  'https://api.hive.blog',
  'https://api.deathwing.me'
]

// Configure timeouts and retries
config.timeout = 10
config.retry = 3

// Configure chain parameters
config.chain_id = 'beeab0de00000000000000000000000000000000000000000000000000000000'
config.address_prefix = 'STM'
```

### API Calls

Make direct API calls to Hive nodes using the `call` function:

```typescript
import { call } from 'hive-tx'

// Get account information
const accounts = await call('condenser_api.get_accounts', [['username']])

// Get blockchain properties
const props = await call('condenser_api.get_dynamic_global_properties')

// Custom timeout and retry settings
const data = await call('condenser_api.get_content', ['author', 'permlink'], 10, 3)
```

## Examples

### Creating and Broadcasting a Vote

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

const operations = [
  [
    'vote',
    {
      voter: 'your-username',
      author: 'post-author',
      permlink: 'post-permlink',
      weight: 10000 // 100%
    }
  ]
]

const tx = new Transaction()
await tx.addOperation('vote', operations[0][1])

const privateKey = PrivateKey.from('your-active-key')
tx.sign(privateKey)

const result = await tx.broadcast()
console.log('Vote successful:', result)
```

### Transferring HIVE

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Thanks for your help!'
})

const privateKey = PrivateKey.from('sender-active-key')
tx.sign(privateKey)

const result = await tx.broadcast()
console.log('Transfer successful:', result)
```

### Creating an Account

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('account_create', {
  fee: '3.000 HIVE',
  creator: 'creator-account',
  new_account_name: 'new-account-name',
  owner: {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [['owner-public-key', 1]]
  },
  active: {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [['active-public-key', 1]]
  },
  posting: {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [['posting-public-key', 1]]
  },
  memo_key: 'memo-public-key',
  json_metadata: '{}'
})

const privateKey = PrivateKey.from('creator-active-key')
tx.sign(privateKey)

const result = await tx.broadcast()
console.log('Account created:', result)
```

### Working with Memos

```javascript
import { Memo, PrivateKey, PublicKey } from 'hive-tx'

// Sender's private key and recipient's public key
const senderPrivateKey = PrivateKey.from('sender-memo-key')
const recipientPublicKey = PublicKey.from('recipient-memo-key')

// Encrypt a memo
const encryptedMemo = Memo.encode(
  senderPrivateKey,
  recipientPublicKey,
  '#This is a secret message'
)

// Recipient decrypts the memo
const recipientPrivateKey = PrivateKey.from('recipient-memo-key')
const decryptedMemo = Memo.decode(recipientPrivateKey, encryptedMemo)

console.log('Decrypted memo:', decryptedMemo) // '#This is a secret message'
```

### Signing Messages

```javascript
import { PrivateKey, PublicKey } from 'hive-tx'
import { sha256 } from '@noble/hashes/sha2.js'

const privateKey = PrivateKey.from('your-private-key')
const publicKey = PublicKey.from('your-public-key')

// Create a message hash
const message = sha256('Hello, Hive!')

// Sign the message
const signature = privateKey.sign(message)

// Verify the signature
const isValid = publicKey.verify(message, signature)
console.log('Signature valid:', isValid) // true
```

## Advanced Usage

### Multi-Signature Transactions

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('custom_json', {
  required_auths: ['account1', 'account2'],
  required_posting_auths: [],
  id: 'my-app',
  json: JSON.stringify({ action: 'multi-sign' })
})

// Sign with multiple keys
const key1 = PrivateKey.from('account1-active-key')
const key2 = PrivateKey.from('account2-active-key')

tx.sign([key1, key2])

const result = await tx.broadcast()
```

### Custom Node Configuration

```javascript
import { config, call } from 'hive-tx'

// Set custom nodes with failover
config.node = [
  'https://api.hive.blog',
  'https://api.deathwing.me',
  'https://rpc.mahdiyari.info'
]

// Custom timeout and retry settings
config.timeout = 15
config.retry = 5

// Make API calls with custom settings
const accounts = await call('condenser_api.get_accounts', [['user']], 10, 3)
```

### Working with Keys

```javascript
import { PrivateKey, PublicKey } from 'hive-tx'

// Generate a new random private key
const privateKey = PrivateKey.randomKey()
console.log('Private key:', privateKey.toString())

// Derive from username and password
const postingKey = PrivateKey.fromLogin('username', 'password', 'posting')
console.log('Posting key:', postingKey.toString())

// Create public key
const publicKey = postingKey.createPublic()
console.log('Public key:', publicKey.toString())
```

### Error Handling

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

try {
  const tx = new Transaction()
  await tx.addOperation('transfer', {
    from: 'sender',
    to: 'receiver',
    amount: '1.000 HIVE',
    memo: 'Test transfer'
  })

  const privateKey = PrivateKey.from('invalid-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Success:', result)
} catch (error) {
  console.error('Transaction failed:', error.message)
}
```

## Migration Guide

### From hive-js to hive-tx

The hive-tx library provides a more modern and lightweight alternative to hive-js:

**Before (hive-js):**
```javascript
import hive from 'hive-js'

hive.broadcast.vote(
  postingKey,
  voter,
  author,
  permlink,
  weight,
  (err, result) => {
    if (err) console.error(err)
    else console.log(result)
  }
)
```

**After (hive-tx):**
```javascript
import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('vote', { voter, author, permlink, weight })

const key = PrivateKey.from(postingKey)
tx.sign(key)

const result = await tx.broadcast()
console.log(result)
```

## Contributing

We welcome contributions to the hive-tx library! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

### Development Setup

```bash
git clone https://github.com/mahdiyari/hive-tx-js.git
cd hive-tx-js
npm install
npm run build
npm test
```

### Building

```bash
# Build all targets
npm run build

# Build Node.js targets only
npm run build:node

# Build browser target only
npm run build:browser

# Clean build directory
npm run build:clean
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## License

MIT License - see [LICENSE](../LICENSE) file for details.
