# Quick Start Guide

Get up and running with hive-tx in minutes with this quick start guide.

## Installation

```bash
npm install hive-tx --save
```

```js
import { call, Transaction, PrivateKey } from 'hive-tx'
```

The library has two build outputs:
- ES Module (esm)
- CommonJS (cjs)

Your application will automatically pick the right build for your environment but you can also import either of them directly from `hive-tx/esm` and `hive-tx/cjs`.

There is also a browser build which you can use like this:
```html
<script src="https://cdn.jsdelivr.net/npm/hive-tx@7/dist/browser/hive-tx.min.js"></script>
<!-- hiveTx will be available globbaly -->
```

## Creating Transactions

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

// Create a new transaction
const tx = new Transaction()

// Add a vote operation (you can add multiple operations to a single transaction)
await tx.addOperation('vote', {
  voter: 'guest123',
  author: 'guest123',
  permlink: '20191107t125713486z-post',
  weight: 9500 // 95% upvote
})

const myKey = '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg'
const privateKey = PrivateKey.from(myKey)
// Sign
tx.sign(privateKey)
// Broadcast
const result = await tx.broadcast()

console.log('Vote successful:', result.result.tx_id)
```

## Making API Calls

```javascript
import { call } from 'hive-tx'

async function getAccountInfo() {
  try {
    const result = await call('condenser_api.get_accounts', [['mahdiyari']])
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

## Working with Keys

```javascript
import { PrivateKey } from 'hive-tx'

// From WIF string
const key1 = PrivateKey.from('5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg')

// Generate secure random key
const key2 = PrivateKey.randomKey()

// From username and password
const key3 = PrivateKey.fromLogin('username', 'password', 'posting')

// From seed
const key4 = PrivateKey.fromSeed('my-secret-seed')
```

### Working with Public Keys

```javascript
import { PrivateKey, PublicKey } from 'hive-tx'

// Derive public key from private key
const privateKey = PrivateKey.from('your-private-key')
const publicKey = privateKey.createPublic()

console.log('Public Key:', publicKey.toString())

// Or create from string
const publicKey2 = PublicKey.from('STM6aGPtxMUGnTPfKLSxdwCHbximSJxzrRjeQmwRW9BRCdrFotKLs')
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

### Explore the Examples

Check out the comprehensive examples in the documentation:

[Examples](EXAMPLES.md) - Practical usage examples
