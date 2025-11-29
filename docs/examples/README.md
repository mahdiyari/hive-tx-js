# Examples

This directory contains practical examples demonstrating various use cases of the hive-tx library.

## Table of Contents

- [Basic Operations](#basic-operations)
- [Account Management](#account-management)
- [Financial Operations](#financial-operations)
- [Content Operations](#content-operations)
- [Advanced Features](#advanced-features)

## Basic Operations

### Simple Vote

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function vote() {
  const tx = new Transaction()
  await tx.addOperation('vote', {
    voter: 'your-username',
    author: 'post-author',
    permlink: 'post-permlink',
    weight: 10000 // 100%
  })

  const privateKey = PrivateKey.from('your-posting-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Vote successful:', result)
}
```

### Get Account Information

```javascript
import { call } from 'hive-tx'

async function getAccount() {
  const result = await call('condenser_api.get_accounts', [['username']])
  console.log('Account info:', result.result[0])
}
```

## Account Management

### Create Account

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function createAccount() {
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
}
```

### Update Account

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function updateAccount() {
  const tx = new Transaction()
  await tx.addOperation('account_update', {
    account: 'your-account',
    memo_key: 'new-memo-public-key',
    json_metadata: JSON.stringify({
      profile: {
        name: 'New Name',
        about: 'Updated profile'
      }
    })
  })

  const privateKey = PrivateKey.from('active-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Account updated:', result)
}
```

## Financial Operations

### Transfer HIVE

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function transferHive() {
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
}
```

### Transfer HBD

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function transferHbd() {
  const tx = new Transaction()
  await tx.addOperation('transfer', {
    from: 'sender',
    to: 'receiver',
    amount: '5.500 HBD',
    memo: 'Payment for services'
  })

  const privateKey = PrivateKey.from('sender-active-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('HBD transfer successful:', result)
}
```

### Power Up (Transfer to Vesting)

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function powerUp() {
  const tx = new Transaction()
  await tx.addOperation('transfer_to_vesting', {
    from: 'your-account',
    to: 'your-account', // or another account
    amount: '10.000 HIVE'
  })

  const privateKey = PrivateKey.from('active-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Power up successful:', result)
}
```

### Power Down (Withdraw Vesting)

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function powerDown() {
  const tx = new Transaction()
  await tx.addOperation('withdraw_vesting', {
    account: 'your-account',
    vesting_shares: '1000.000000 VESTS'
  })

  const privateKey = PrivateKey.from('active-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Power down initiated:', result)
}
```

## Content Operations

### Create Post/Comment

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function createPost() {
  const tx = new Transaction()
  await tx.addOperation('comment', {
    parent_author: '', // Empty for posts
    parent_permlink: 'hive', // Category
    author: 'your-username',
    permlink: 'my-first-post', // Unique identifier
    title: 'My First Post',
    body: 'This is the content of my first post on Hive!',
    json_metadata: JSON.stringify({
      tags: ['hive', 'introduction'],
      app: 'my-app/1.0'
    })
  })

  const privateKey = PrivateKey.from('posting-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Post created:', result)
}
```

### Create Reply

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function createReply() {
  const tx = new Transaction()
  await tx.addOperation('comment', {
    parent_author: 'original-author',
    parent_permlink: 'original-post-permlink',
    author: 'your-username',
    permlink: 're-' + Date.now(), // Unique reply identifier
    title: '', // Empty for replies
    body: 'This is my reply to the post!',
    json_metadata: JSON.stringify({
      tags: ['reply'],
      app: 'my-app/1.0'
    })
  })

  const privateKey = PrivateKey.from('posting-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Reply created:', result)
}
```

### Vote on Content

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function voteOnContent() {
  const tx = new Transaction()
  await tx.addOperation('vote', {
    voter: 'your-username',
    author: 'post-author',
    permlink: 'post-permlink',
    weight: 5000 // 50% upvote
  })

  const privateKey = PrivateKey.from('posting-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Vote successful:', result)
}
```

## Advanced Features

### Multi-Signature Transaction

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function multiSigTransaction() {
  const tx = new Transaction()
  await tx.addOperation('custom_json', {
    required_auths: ['account1', 'account2'],
    required_posting_auths: [],
    id: 'my-dapp-action',
    json: JSON.stringify({
      action: 'multi-signature-operation',
      data: 'some-data'
    })
  })

  // Sign with multiple keys
  const key1 = PrivateKey.from('account1-active-key')
  const key2 = PrivateKey.from('account2-active-key')
  
  tx.sign([key1, key2])

  const result = await tx.broadcast()
  console.log('Multi-sig transaction successful:', result)
}
```

### Working with Memos

```javascript
import { Memo, Transaction, PrivateKey, PublicKey } from 'hive-tx'

async function encryptedMemo() {
  // Sender's private key and recipient's public key
  const senderPrivateKey = PrivateKey.from('sender-memo-key')
  const recipientPublicKey = PublicKey.from('recipient-memo-key')

  // Encrypt a memo
  const encryptedMemo = Memo.encode(
    senderPrivateKey,
    recipientPublicKey,
    '#This is a secret message that only the recipient can read'
  )

  // Create a transfer with encrypted memo
  const tx = new Transaction()
  await tx.addOperation('transfer', {
    from: 'sender',
    to: 'recipient',
    amount: '1.000 HIVE',
    memo: encryptedMemo
  })

  const privateKey = PrivateKey.from('sender-active-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Transfer with encrypted memo:', result)

  // Recipient decrypts the memo
  const recipientPrivateKey = PrivateKey.from('recipient-memo-key')
  const decryptedMemo = Memo.decode(recipientPrivateKey, encryptedMemo)
  console.log('Decrypted memo:', decryptedMemo)
}
```

### Signing and Verifying Messages

```javascript
import { PrivateKey, PublicKey } from 'hive-tx'
import { sha256 } from '@noble/hashes/sha2.js'

async function signAndVerify() {
  const privateKey = PrivateKey.from('your-private-key')
  const publicKey = PublicKey.from('your-public-key')

  // Create a message hash
  const message = sha256('Hello, Hive!')

  // Sign the message
  const signature = privateKey.sign(message)
  console.log('Signature:', signature.customToString())

  // Verify the signature
  const isValid = publicKey.verify(message, signature)
  console.log('Signature valid:', isValid) // true

  // Recover public key from signature
  const recoveredKey = signature.getPublicKey(message)
  console.log('Recovered key matches:',
    recoveredKey.toString() === publicKey.toString())
}
```

### Custom Node Configuration

```javascript
import { config, call, Transaction, PrivateKey } from 'hive-tx'

function setupCustomNodes() {
  // Set custom nodes with failover
  config.node = [
    'https://api.hive.blog',
    'https://api.deathwing.me',
    'https://rpc.mahdiyari.info',
    'https://techcoderx.com'
  ]

  // Custom timeout and retry settings
  config.timeout = 15 // 15 seconds
  config.retry = 5 // 5 retry attempts
}

async function useCustomConfig() {
  setupCustomNodes()

  // Make API calls with custom settings
  const accounts = await call('condenser_api.get_accounts', [['username']])
  console.log('Account data:', accounts)

  // Create and broadcast transaction
  const tx = new Transaction()
  await tx.addOperation('vote', {
    voter: 'username',
    author: 'author',
    permlink: 'permlink',
    weight: 10000
  })

  const key = PrivateKey.from('posting-key')
  tx.sign(key)

  // Custom timeout and retry for broadcast
  const result = await tx.broadcast(10, 3)
  console.log('Transaction result:', result)
}
```



### Error Handling

```javascript
import { Transaction, PrivateKey, call } from 'hive-tx'

async function handleError() {
  try {
    const tx = new Transaction()
    await tx.addOperation('transfer', {
      from: 'invalid-account',
      to: 'receiver',
      amount: '1.000 HIVE',
      memo: 'Test transfer'
    })

    const privateKey = PrivateKey.from('invalid-key')
    tx.sign(privateKey)

    const result = await tx.broadcast()
    console.log('Success:', result)
  } catch (error) {
    console.error('Transaction failed:')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    
    // Handle specific error types
    if (error.message.includes('invalid private key')) {
      console.log('Please check your private key')
    } else if (error.message.includes('insufficient funds')) {
      console.log('Insufficient balance')
    }
  }
}

async function handleApiError() {
  try {
    const result = await call('condenser_api.get_accounts', [['nonexistent-user']])
    if (result.result && result.result.length === 0) {
      console.log('Account not found')
    } else {
      console.log('Account data:', result.result[0])
    }
  } catch (error) {
    console.error('API call failed:', error.message)
  }
}
```

### Batch Operations

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

async function batchOperations() {
  const tx = new Transaction()
  
  // Add multiple operations to a single transaction
  await tx.addOperation('transfer', {
    from: 'sender',
    to: 'receiver1',
    amount: '1.000 HIVE',
    memo: 'Payment 1'
  })

  await tx.addOperation('transfer', {
    from: 'sender',
    to: 'receiver2',
    amount: '2.000 HIVE',
    memo: 'Payment 2'
  })

  await tx.addOperation('vote', {
    voter: 'sender',
    author: 'author',
    permlink: 'post',
    weight: 10000
  })

  const privateKey = PrivateKey.from('active-key')
  tx.sign(privateKey)

  const result = await tx.broadcast()
  console.log('Batch transaction successful:', result)
}
```

## Running Examples

To run these examples:

1. Install hive-tx:
```bash
npm install hive-tx
```

2. Save any example to a `.js` file

3. Run with Node.js:
```bash
node example.js
```

4. For browser examples, include the hive-tx script:
```html
<script src="https://cdn.jsdelivr.net/npm/hive-tx/dist/hive-tx.min.js"></script>
```

## Security Notes

- Never hardcode private keys in your source code
- Use environment variables or secure key management systems
- Validate all inputs before creating transactions
- Test thoroughly in a development environment
- Keep your dependencies up to date

## Best Practices

1. **Always use HTTPS** for API calls
2. **Implement proper error handling** for all operations
3. **Use appropriate key types** (posting, active, owner) for different operations
4. **Set reasonable timeouts** for API calls
5. **Implement retry logic** for critical operations
6. **Validate transaction results** before assuming success
7. **Keep private keys secure** and never expose them in client-side code

For more detailed information, see the [API Reference](../API.md).
