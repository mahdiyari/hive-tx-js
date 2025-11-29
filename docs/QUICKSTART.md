# Quick Start Guide

Get up and running with hive-tx in minutes with this quick start guide.

## Table of Contents

- [Installation](#installation)
- [Basic Setup](#basic-setup)
- [Creating Transactions](#creating-transactions)
- [Signing and Broadcasting](#signing-and-broadcasting)
- [Making API Calls](#making-api-calls)
- [Working with Keys](#working-with-keys)
- [Next Steps](#next-steps)

## Installation

### Node.js

```bash
npm install hive-tx --save
```

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/hive-tx/dist/hive-tx.min.js"></script>
```

## Basic Setup

### Node.js (ES Modules)

```javascript
import { Transaction, PrivateKey, call } from 'hive-tx'

// That's it! You're ready to use hive-tx
```

### Node.js (CommonJS)

```javascript
const { Transaction, PrivateKey, call } = require('hive-tx')

// You're ready to use hive-tx
```

### Browser

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/hive-tx/dist/hive-tx.min.js"></script>
</head>
<body>
    <script>
        // hiveTx is available globally
        console.log('hive-tx loaded:', typeof hiveTx.Transaction);
    </script>
</body>
</html>
```

## Creating Transactions

### Simple Vote Transaction

```javascript
import { Transaction } from 'hive-tx'

// Create a new transaction
const tx = new Transaction()

// Add a vote operation
await tx.addOperation('vote', {
  voter: 'your-username',
  author: 'post-author',
  permlink: 'post-permlink',
  weight: 10000 // 100% upvote
})

console.log('Transaction created!')
```

### Transfer Transaction

```javascript
import { Transaction } from 'hive-tx'

const tx = new Transaction()

await tx.addOperation('transfer', {
  from: 'sender-username',
  to: 'receiver-username',
  amount: '1.000 HIVE',
  memo: 'Thanks for your help!'
})

console.log('Transfer transaction ready!')
```

### Multiple Operations

```javascript
import { Transaction } from 'hive-tx'

const tx = new Transaction()

// Add multiple operations to one transaction
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver1',
  amount: '1.000 HIVE',
  memo: 'Payment 1'
})

await tx.addOperation('vote', {
  voter: 'sender',
  author: 'author',
  permlink: 'permlink',
  weight: 10000
})

await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver2',
  amount: '2.000 HIVE',
  memo: 'Payment 2'
})

console.log('Multi-operation transaction ready!')
```

## Signing and Broadcasting

### Sign with Private Key

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'your-username',
  author: 'author',
  permlink: 'permlink',
  weight: 10000
})

// Load your private key
const privateKey = PrivateKey.from('your-private-key-wif')

// Sign the transaction
tx.sign(privateKey)

console.log('Transaction signed!')
```

### Broadcast Transaction

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Quick start transfer'
})

const privateKey = PrivateKey.from('your-private-key-wif')
tx.sign(privateKey)

// Broadcast to the network
const result = await tx.broadcast()
console.log('Transaction broadcasted!', result.result.tx_id)
```

### Complete Example

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function quickTransfer() {
  try {
    // Create transaction
    const tx = new Transaction()
    await tx.addOperation('transfer', {
      from: 'sender',
      to: 'receiver',
      amount: '1.000 HIVE',
      memo: 'Sent with hive-tx!'
    })

    // Sign transaction
    const key = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
    tx.sign(key)

    // Broadcast transaction
    const result = await tx.broadcast()
    
    console.log('✅ Transfer successful!')
    console.log('Transaction ID:', result.result.tx_id)
    
    return result
  } catch (error) {
    console.error('❌ Transfer failed:', error.message)
    throw error
  }
}

// Run the transfer
quickTransfer()
```

## Making API Calls

### Get Account Information

```javascript
import { call } from 'hive-tx'

async function getAccountInfo() {
  try {
    const result = await call('condenser_api.get_accounts', [['username']])
    const account = result.result[0]
    
    console.log('Account:', account.name)
    console.log('HIVE Balance:', account.balance)
    console.log('HBD Balance:', account.hbd_balance)
    
    return account
  } catch (error) {
    console.error('Failed to get account:', error.message)
    throw error
  }
}

getAccountInfo()
```

### Get Blockchain Properties

```javascript
import { call } from 'hive-tx'

async function getBlockchainInfo() {
  try {
    const result = await call('condenser_api.get_dynamic_global_properties')
    const props = result.result
    
    console.log('Head Block:', props.head_block_number)
    console.log('Current Supply:', props.current_supply)
    
    return props
  } catch (error) {
    console.error('Failed to get blockchain info:', error.message)
    throw error
  }
}

getBlockchainInfo()
```

### Custom API Call with Timeout

```javascript
import { call } from 'hive-tx'

async function customApiCall() {
  try {
    // Custom timeout (10 seconds) and retry (3 times)
    const result = await call(
      'condenser_api.get_content',
      ['author', 'permlink'],
      10, // timeout in seconds
      3   // retry attempts
    )
    
    console.log('Content:', result.result.title)
    return result
  } catch (error) {
    console.error('API call failed:', error.message)
    throw error
  }
}

customApiCall()
```

## Working with Keys

### Creating Private Keys

```javascript
import { PrivateKey } from 'hive-tx'

// From WIF string
const key1 = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')

// Generate random key
const key2 = PrivateKey.randomKey()

// From username and password
const key3 = PrivateKey.fromLogin('username', 'password', 'posting')

// From seed
const key4 = PrivateKey.fromSeed('my-secret-seed')

console.log('Keys created successfully!')
```

### Working with Public Keys

```javascript
import { PrivateKey, PublicKey } from 'hive-tx'

// Derive public key from private key
const privateKey = PrivateKey.from('your-private-key')
const publicKey = privateKey.createPublic()

console.log('Public Key:', publicKey.toString())

// Or create from string
const publicKey2 = PublicKey.from('STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA')
```

### Signing and Verifying Messages

```javascript
import { PrivateKey, PublicKey } from 'hive-tx'
import { sha256 } from '@noble/hashes/sha2.js'

async function signAndVerify() {
  const privateKey = PrivateKey.from('your-private-key')
  const publicKey = PublicKey.from('your-public-key')

  // Create message hash
  const message = sha256('Hello, Hive!')

  // Sign message
  const signature = privateKey.sign(message)
  console.log('Signature:', signature.customToString())

  // Verify signature
  const isValid = publicKey.verify(message, signature)
  console.log('Signature valid:', isValid)

  return { signature, isValid }
}

signAndVerify()
```

## Next Steps

### Explore the Examples

Check out the comprehensive examples in the documentation:

```bash
# View examples
ls docs/examples/
```

### Read the Full Documentation

- [API Reference](API.md) - Complete API documentation
- [Migration Guide](MIGRATION.md) - Migrating from other libraries
- [TypeScript Guide](TYPESCRIPT.md) - Advanced TypeScript usage
- [Testing Guide](TESTING.md) - Testing your applications
- [Performance Guide](PERFORMANCE.md) - Performance optimization
- [Security Guide](SECURITY.md) - Security best practices

### Common Next Steps

1. **Configure API Nodes**
```javascript
import { config } from 'hive-tx'

config.node = [
  'https://api.hive.blog',
  'https://api.deathwing.me',
  'https://rpc.mahdiyari.info'
]
```

2. **Set Custom Timeouts**
```javascript
config.timeout = 15 // 15 seconds
config.retry = 5     // 5 retry attempts
```

3. **Use Advanced Features**
```javascript
// Multi-signature transactions
tx.sign([key1, key2, key3])

// Encrypted memos
import { Memo } from 'hive-tx'
const encrypted = Memo.encode(senderKey, recipientKey, '#Secret message')
```

### Need Help?

1. **Check the FAQ** - Common questions and answers
2. **Read the Examples** - Practical usage patterns
3. **Join the Community** - Hive developer communities
4. **Report Issues** - GitHub issues for bugs and feature requests

### Quick Reference

| Task | Code |
|------|------|
| Create Transaction | `new Transaction()` |
| Add Operation | `await tx.addOperation(name, body)` |
| Sign Transaction | `tx.sign(privateKey)` |
| Broadcast | `await tx.broadcast()` |
| API Call | `await call(method, params)` |
| Create Key | `PrivateKey.from(wif)` |
| Random Key | `PrivateKey.randomKey()` |

This quick start guide covers the most common use cases. For advanced features and detailed API documentation, refer to the specific guides mentioned above.
