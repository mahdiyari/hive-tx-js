# Hive TX JS Examples

This document provides comprehensive examples for using the `hive-tx` library to interact with the Hive blockchain. Each section demonstrates different aspects of the library's functionality.

## Installation

```bash
npm install hive-tx
```

## Basic Setup

```typescript
import { Transaction, PrivateKey, PublicKey, Memo, call, utils } from 'hive-tx'
```

## Configuration

```typescript
import { config } from 'hive-tx'

// Change node configuration
// Default values are:
config.node = [
  'https://api.hive.blog',
  'https://api.deathwing.me',
  'https://api.openhive.network',
  'https://rpc.mahdiyari.info',
  'https://techcoderx.com',
  'https://hiveapi.actifit.io',
  'https://api.c0ff33a.uk'
]

// Adjust timeout and retry settings
config.timeout = 10_000 // 10 seconds
config.retry = 8
```

## 1. Signing and Broadcasting Transactions

### Simple transfer transaction

```typescript
import { Transaction, PrivateKey } from 'hive-tx'

async function transferHive() {
  // Create a new transaction
  const tx = new Transaction()

  // Add a transfer operation
  await tx.addOperation('transfer', {
    from: 'myaccount',
    to: 'recipient',
    amount: '1.000 HIVE',
    memo: 'Thank you!'
  })

  // Import your private active key (never hardcode in production!)
  const privateKey = PrivateKey.fromString('5J...your-private-key-wif')

  // Sign the transaction
  const signedTx = tx.sign(privateKey)

  // Broadcast to the blockchain
  const result = await tx.broadcast()

  console.log('Transaction broadcasted:', result.result.tx_id)
}
```

### Sign and verify a transaction

```typescript
import { Transaction, PrivateKey, Signature } from 'hive-tx'

async function signAndVerify() {
  const tx = new Transaction()

  // Add vote operation (weight: 10000 = 100% upvote)
  await tx.addOperation('vote', {
    voter: 'myaccount',
    author: 'some-author',
    permlink: 'some-post-permlink',
    weight: 10000
  })

  // Private posting key
  const privateKey = PrivateKey.fromString('5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg')

  tx.sign(privateKey)

  const signature = tx.transaction!.signatures[0]

  // Get transaction digest
  const digest = tx.digest().digest

  // There are two ways to validate the signature
  // #1
  const isValid1 = privateKey.createPublic().verify(digest, signature)

  // #2
  const isValid2 =
    Signature.from(signature).getPublicKey(digest).toString() ===
    privateKey.createPublic().toString()

  console.log('Is signature valid?:', isValid1, isValid2)
}
```

## 2. API calls

All Hive API definitions are here to some degeree: https://developers.hive.io/apidefinitions/
And https://rpc.mahdiyari.info/?urls.primaryName=Legacy+Hive+JSON-RPC+API

```typescript
import { call } from 'hive-tx'

async function getAccountInfo() {
  try {
    const accounts = await call('condenser_api.get_accounts', [['hiveio']])
    console.log(accounts)
  } catch (error) {
    console.error('Error fetching account:', error)
  }
}
```

### Get account history with filtered operations

```typescript
import { call, utils } from 'hive-tx'

async function getFilteredHistory() {
  // Get only transfer and vote operations
  const filter = utils.makeBitMaskFilter([
    utils.operations.transfer,
    utils.operations.vote,
    utils.operations.comment
  ])
  const history = await call('condenser_api.get_account_history', [
    'myaccount', // account
    -1, // start (latest)
    100, // limit
    ...filter // operation filter
  ])
  console.log('Recent transfers and votes:', history)
}
```

## 3. Memo encryption/decryption

### Encrypt a memo

```typescript
import { Memo, PrivateKey, PublicKey } from 'hive-tx'

async function encryptMemo() {
  // Sender's private memo key (should be kept secret!)
  const senderPrivateKey = PrivateKey.fromString('5J...sender-memo-key')

  // Recipient's public memo key (publicly available)
  const recipientPublicKey = 'STM...recipient-public-memo-key'

  // Encrypt message (must start with '#')
  const encryptedMemo = Memo.encode(senderPrivateKey, recipientPublicKey, '#Hello World!')

  console.log('Encrypted memo:', encryptedMemo)
  // Now you can use this in a transfer
}
```

### Decrypt a memo

```typescript
import { Memo, PrivateKey } from 'hive-tx'

function decryptMemo() {
  // Recipient's private memo key
  const recipientPrivateKey = PrivateKey.fromString('5J...recipient-memo-key')

  // Encrypted memo from transaction
  const encryptedMemo = '#Encrypted string from blockchain'

  // Decrypt (result starts with '#')
  const decryptedMemo = Memo.decode(recipientPrivateKey, encryptedMemo)

  console.log('Decrypted message:', decryptedMemo) // '#Hello World!'
}
```

## 4. Utilities

### Validate username

```typescript
import { utils } from 'hive-tx'

function validateUsernames() {
  const usernames = ['alice', 'bad-user-name', 'hiveio', 'a', 'verylongusernamethatexceedslimits']

  usernames.forEach((username) => {
    const error = utils.validateUsername(username)
    if (error) {
      console.log(`${username}: ${error}`)
    } else {
      console.log(`${username}: valid`)
    }
  })
}
```

### Build witness set properties

This is the only operation that needs a helper function

```typescript
import { utils, Transaction } from 'hive-tx'

function buildWitnessProperties() {
  const props = {
    key: 'STM1111111111111111111111111111111114T1Anm', // Required - current signing key
    account_creation_fee: '0.000 HIVE', // optional
    account_subsidy_budget: 10000, // optional
    account_subsidy_decay: 330782, // optional
    maximum_block_size: 65536, // optional
    hbd_interest_rate: 0, // optional
    hbd_exchange_rate: { base: '0.250 HBD', quote: '1.000 HIVE' }, // optional
    url: 'https://testurl', // optional
    new_signing_key: 'STM1111111111111111111111111111111114T1Anm' // optional
  }

  const operation = utils.buildWitnessSetProperties('mywitness', props)
  const tx = new Transaction()
  await tx.addOperation(operation)
  // Then sign and broadcast
}
```

## 5. Working with keys

### Generate keys

```typescript
import { PrivateKey } from 'hive-tx'

function generateKeys() {
  // Generate a new private key
  const privateKey = PrivateKey.randomKey()

  // Get the public key
  const publicKey = privateKey.createPublic()

  console.log('Private key:', privateKey.toString())
  console.log('Public key:', publicKey.toString())
}
```

### Import and convert keys

```typescript
import { PrivateKey, PublicKey } from 'hive-tx'

function workWithKeys() {
  // Import private key from WIF
  const privateKey = PrivateKey.fromString('5J...wif-key')

  // Get different types of private keys from master password
  const ownerPrivateKey = privateKey.fromLogin(
    'username',
    'master password or seed phrase',
    'owner'
  )
  const activePrivateKey = privateKey.fromLogin(
    'username',
    'master password or seed phrase',
    'active'
  )
  const postingPrivateKey = privateKey.fromLogin(
    'username',
    'master password or seed phrase',
    'posting'
  )
  const memoPrivateKey = privateKey.fromLogin('username', 'master password or seed phrase', 'memo')
}
```
