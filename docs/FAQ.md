# Frequently Asked Questions

This document answers common questions about the hive-tx library.

## Table of Contents

- [General Questions](#general-questions)
- [Installation and Setup](#installation-and-setup)
- [Transaction Questions](#transaction-questions)
- [Key Management](#key-management)
- [API and Network](#api-and-network)
- [Performance and Optimization](#performance-and-optimization)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Migration](#migration)
- [Development](#development)

## General Questions

### What is hive-tx?

hive-tx is a lightweight, complete JavaScript/TypeScript library for Hive blockchain operations. It provides all the necessary tools to create, sign, and broadcast transactions with full type safety, cryptographic utilities, and serialization support.

### Why should I use hive-tx instead of other libraries?

hive-tx offers several advantages:

1. **Lightweight**: Minimal bundle size (~141 KiB minified + gzipped)
2. **Complete**: Full support for all Hive blockchain operations
3. **TypeScript Ready**: Full type definitions included
4. **Cross-Platform**: Works in both browser and Node.js environments
5. **Secure**: Uses industry-standard cryptographic libraries (@noble/*)
6. **Reliable**: Built-in retry and failover mechanisms
7. **Simple**: Clean, intuitive API design

### What are the system requirements?

- **Node.js**: >= 18
- **Browser**: Modern browsers with ES6+ support
- **TypeScript**: Optional but recommended (>= 4.0)

### Is hive-tx production ready?

Yes, hive-tx is production ready. It's actively maintained, well-tested, and used in production applications. The library follows semantic versioning and maintains backward compatibility within major versions.

## Installation and Setup

### How do I install hive-tx?

```bash
npm install hive-tx --save
```

### How do I use hive-tx in the browser?

```html
<script src="https://cdn.jsdelivr.net/npm/hive-tx/dist/hive-tx.min.js"></script>
<script>
  // hiveTx is available globally
  const tx = new hiveTx.Transaction()
</script>
```

### How do I import hive-tx in Node.js?

```javascript
// ES Module
import * as hiveTx from 'hive-tx'

// OR import specific components
import { call, Transaction, PrivateKey } from 'hive-tx'

// OR in CommonJS environments
const hiveTx = require('hive-tx')
// OR
const { call, Transaction, PrivateKey } = require('hive-tx')
```

### How do I configure hive-tx?

```javascript
import { config } from 'hive-tx'

// Set custom API nodes
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

## Transaction Questions

### How do I create a transaction?

```javascript
import { Transaction } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'your-username',
  author: 'post-author',
  permlink: 'post-permlink',
  weight: 10000 // 100%
})
```

### How do I sign a transaction?

```javascript
import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Thanks!'
})

const privateKey = PrivateKey.from('your-private-key')
tx.sign(privateKey)
```

### How do I broadcast a transaction?

```javascript
const result = await tx.broadcast()
console.log('Transaction ID:', result.result.tx_id)
```

### How do I create multiple operations in one transaction?

```javascript
const tx = new Transaction()

await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver1',
  amount: '1.000 HIVE'
})

await tx.addOperation('vote', {
  voter: 'sender',
  author: 'author',
  permlink: 'permlink',
  weight: 10000
})

tx.sign(privateKey)
const result = await tx.broadcast()
```

### How do I handle transaction expiration?

```javascript
// Set custom expiration (in milliseconds)
const tx = new Transaction({ expiration: 120000 }) // 2 minutes

// Or use default (60 seconds)
const tx2 = new Transaction()
```

## Key Management

### How do I create a private key?

```javascript
import { PrivateKey } from 'hive-tx'

// From WIF string
const key = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')

// Generate random key
const randomKey = PrivateKey.randomKey()

// From username and password
const loginKey = PrivateKey.fromLogin('username', 'password', 'posting')

// From seed
const seedKey = PrivateKey.fromSeed('my-secret-seed')
```

### How do I derive public keys?

```javascript
const privateKey = PrivateKey.from('your-private-key')
const publicKey = privateKey.createPublic()
console.log(publicKey.toString())
```

### What are the different key roles?

Hive uses different key roles for different operations:

- **Owner**: Highest level key, used for account recovery and key changes
- **Active**: Used for financial operations (transfers, power up/down)
- **Posting**: Used for social operations (posts, votes, comments)
- **Memo**: Used for encrypting/decrypting memos

### How do I sign and verify messages?

```javascript
import { PrivateKey, PublicKey, sha256 } from 'hive-tx'

const privateKey = PrivateKey.from('your-private-key')
const publicKey = PublicKey.from('your-public-key')

// Create message hash
const message = sha256('Hello, Hive!')

// Sign message
const signature = privateKey.sign(message)

// Verify signature
const isValid = publicKey.verify(message, signature)
console.log('Signature valid:', isValid)
```

## API and Network

### How do I make API calls?

```javascript
import { call } from 'hive-tx'

// Get account information
const accounts = await call('condenser_api.get_accounts', [['username']])

// Get blockchain properties
const props = await call('condenser_api.get_dynamic_global_properties')

// Custom timeout and retry
const data = await call('condenser_api.get_content', ['author', 'permlink'], 10, 3)
```

### How does failover work?

```javascript
import { config } from 'hive-tx'

// Configure multiple nodes for automatic failover
config.node = [
  'https://api.hive.blog',
  'https://api.deathwing.me',
  'https://rpc.mahdiyari.info'
]

// hive-tx will automatically retry on different nodes if one fails
```

### How do I handle API errors?

```javascript
try {
  const result = await call('condenser_api.get_accounts', [['username']])
  console.log(result)
} catch (error) {
  console.error('API call failed:', error.message)
  
  // Check for specific error types
  if (error.message.includes('timeout')) {
    console.log('Request timed out, try again')
  }
}
```

### How do I get transaction details?

```javascript
const txDetails = await call('condenser_api.get_transaction', ['transaction_id'])
console.log(txDetails)
```

## Performance and Optimization

### How can I optimize transaction creation?

```javascript
// Cache frequently used transactions
const cachedTx = transactionCache.get('transfer-template')
if (cachedTx) {
  // Use cached transaction
} else {
  // Create new transaction
  const tx = new Transaction()
  await tx.addOperation('transfer', transferData)
  transactionCache.set('transfer-template', tx)
}
```

### How do I batch API calls?

```javascript
// Use Promise.all for parallel API calls
const [accounts, props, content] = await Promise.all([
  call('condenser_api.get_accounts', [['user1', 'user2']]),
  call('condenser_api.get_dynamic_global_properties'),
  call('condenser_api.get_content', ['author', 'permlink'])
])
```

### How do I monitor performance?

```javascript
const startTime = performance.now()
const result = await tx.broadcast()
const endTime = performance.now()
console.log(`Transaction took ${endTime - startTime}ms`)
```

### How do I reduce bundle size?

```javascript
// Import only what you need
import { Transaction } from 'hive-tx'
import { PrivateKey } from 'hive-tx/helpers/PrivateKey'
import { call } from 'hive-tx/helpers/call'
```

## Security

### How are private keys protected?

1. **Never logged**: Private keys are never logged or exposed
2. **Masked inspection**: `key.inspect()` shows masked representation
3. **Secure storage**: Keys should be stored securely (environment variables, keychains)
4. **Memory management**: Keys are kept in memory only when needed

### How do I securely store keys?

```javascript
// ✅ Good - Environment variables
const privateKey = PrivateKey.from(process.env.HIVE_PRIVATE_KEY)

// ❌ Bad - Hardcoded keys
const privateKey = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')

// ✅ Good - Secure key derivation
const postingKey = PrivateKey.fromLogin('username', process.env.PASSWORD, 'posting')
```

### How do I handle sensitive data in logs?

```javascript
const key = PrivateKey.from('your-key')

// ❌ Bad - Logging private keys
console.log('Private key:', key.toString())

// ✅ Good - Logging masked representation
console.log('Key loaded:', key.inspect())

// ✅ Good - Sanitizing error messages
try {
  // ... operations
} catch (error) {
  // Remove sensitive data from error messages
  const safeError = error.message
    .replace(/5[KLM][1-9A-HJ-NP-Za-km-z]{40,50}/g, '[PRIVATE_KEY]')
    .replace(/[0-9a-f]{130}/g, '[SIGNATURE]')
  console.error('Operation failed:', safeError)
}
```

### How do I validate user input?

```javascript
import { validateUsername } from 'hive-tx/helpers/utils'

function validateTransferData(transfer) {
  // Validate account names
  if (validateUsername(transfer.from)) {
    throw new Error('Invalid sender username')
  }
  
  if (validateUsername(transfer.to)) {
    throw new Error('Invalid receiver username')
  }
  
  // Validate amount format
  if (!/^\d+(\.\d+)? [A-Z]+$/.test(transfer.amount)) {
    throw new Error('Invalid amount format')
  }
}
```

## Troubleshooting

### Why am I getting "invalid private key" errors?

Common causes:

1. **Incorrect WIF format**: Ensure the key starts with '5' and is 51 characters long
2. **Copy-paste errors**: Check for extra spaces or characters
3. **Wrong key type**: Make sure you're using the correct key role (posting, active, etc.)

```javascript
// Verify key format
if (!/^5[1-9A-HJ-NP-Za-km-z]{50}$/.test(privateKeyString)) {
  throw new Error('Invalid private key format')
}
```

### Why are my transactions failing?

Common issues:

1. **Insufficient funds**: Check account balance
2. **Wrong key type**: Use the appropriate key for the operation
3. **Expired transactions**: Check transaction expiration
4. **Network issues**: Verify API node connectivity

```javascript
try {
  const result = await tx.broadcast()
  console.log('Success:', result)
} catch (error) {
  console.error('Transaction failed:', error.message)
  
  // Check for common error patterns
  if (error.message.includes('insufficient funds')) {
    console.log('Check your account balance')
  } else if (error.message.includes('missing required posting authority')) {
    console.log('Use posting key for this operation')
  }
}
```

### Why am I getting timeout errors?

Solutions:

1. **Increase timeout**: `config.timeout = 15`
2. **Use faster nodes**: Configure reliable API nodes
3. **Check network connectivity**: Verify internet connection
4. **Retry mechanism**: Use built-in retry functionality

```javascript
// Custom timeout and retry settings
const result = await tx.broadcast(15, 5) // 15 seconds timeout, 5 retries
```

### Why are my API calls slow?

Optimization tips:

1. **Use caching**: Cache frequently accessed data
2. **Batch requests**: Combine multiple API calls
3. **Choose fast nodes**: Configure responsive API nodes
4. **Monitor performance**: Track API response times

```javascript
// Cache API responses
const cache = new Map()
const CACHE_TTL = 30000 // 30 seconds

async function cachedCall(method, params) {
  const key = `${method}:${JSON.stringify(params)}`
  const cached = cache.get(key)
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data
  }
  
  const data = await call(method, params)
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

## Migration

### How do I migrate from hive-js?

Key differences:

```javascript
// hive-js (old)
import hive from 'hive-js'
hive.broadcast.vote(wif, voter, author, permlink, weight, callback)

// hive-tx (new)
import { Transaction, PrivateKey } from 'hive-tx'
const tx = new Transaction()
await tx.addOperation('vote', { voter, author, permlink, weight })
const key = PrivateKey.from(wif)
tx.sign(key)
await tx.broadcast()
```

### How do I migrate from dsteem?

Key differences:

```javascript
// dsteem (old)
import { Client } from 'dsteem'
const client = new Client('https://api.hive.blog')
client.broadcast.sendOperations([op], privateKey)

// hive-tx (new)
import { Transaction } from 'hive-tx'
const tx = new Transaction()
await tx.addOperation(operationName, operationBody)
tx.sign(privateKey)
await tx.broadcast()
```

### What breaking changes are in v7?

Major changes:

1. **Transaction creation**: `tx.create()` → `await tx.addOperation()`
2. **Method names**: `tx.getDigest()` → `tx.digest()`
3. **Configuration**: `config.set()` → direct property assignment
4. **Return values**: Different broadcast response format

## Development

### How do I contribute to hive-tx?

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests**
5. **Run the test suite**
6. **Submit a pull request**

```bash
git clone https://github.com/your-username/hive-tx-js.git
cd hive-tx-js
npm install
npm test
npm run build
```

### How do I run tests?

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx vitest tests/transaction.test.ts
```

### How do I build the library?

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

### How do I generate documentation?

```bash
# Generate JSDoc documentation
npm run docs

# Generate TypeScript declarations
npm run build:types
```

### How do I report bugs?

1. **Check existing issues** on GitHub
2. **Create a minimal reproduction**
3. **Include version information**
4. **Provide error messages**
5. **Describe expected vs actual behavior**

### How do I request features?

1. **Check if feature exists** in issues or discussions
2. **Describe the use case** clearly
3. **Provide API design suggestions**
4. **Include examples** of usage
5. **Consider backward compatibility**

## Advanced Topics

### How do I work with multi-signature transactions?

```javascript
const tx = new Transaction()
await tx.addOperation('custom_json', {
  required_auths: ['account1', 'account2'],
  required_posting_auths: [],
  id: 'my-app',
  json: JSON.stringify({ action: 'multi-sign' })
})

// Sign with multiple keys
const key1 = PrivateKey.from('account1-key')
const key2 = PrivateKey.from('account2-key')
tx.sign([key1, key2])

const result = await tx.broadcast()
```

### How do I work with encrypted memos?

```javascript
import { Memo, PrivateKey, PublicKey } from 'hive-tx'

// Sender encrypts memo
const senderKey = PrivateKey.from('sender-memo-key')
const recipientKey = PublicKey.from('recipient-memo-key')
const encrypted = await Memo.encode(senderKey, recipientKey, '#Secret message')

// Recipient decrypts memo
const recipientPrivateKey = PrivateKey.from('recipient-memo-key')
const decrypted = await Memo.decode(recipientPrivateKey, encrypted)
```

### How do I handle different asset types?

```javascript
import { Asset } from 'hive-tx'

// Create different asset types
const hive = Asset.from('10.500 HIVE')
const hbd = Asset.from('5.250 HBD')
const vests = Asset.from('1000.000000 VESTS')

// Access properties
console.log(hive.amount) // 10.5
console.log(hive.symbol) // 'HIVE'
console.log(hive.toString()) // '10.500 HIVE'
console.log(hive.getPrecision()) // 3
```

### How do I work with witness operations?

```javascript
import { buildWitnessSetProperties } from 'hive-tx/helpers/utils'

const witnessOps = buildWitnessSetProperties('witness-account', {
  key: 'STM1111111111111111111111111111111114T1Anm',
  account_creation_fee: '0.000 HIVE',
  maximum_block_size: 65536,
  hbd_interest_rate: 0
})

const tx = new Transaction()
await tx.addOperation('witness_set_properties', witnessOps[1])
tx.sign(privateKey)
await tx.broadcast()
```

### How do I filter account history?

```javascript
import { makeBitMaskFilter, operations } from 'hive-tx/helpers/utils'

const filter = makeBitMaskFilter([operations.transfer, operations.transfer_to_vesting])
const history = await call('condenser_api.get_account_history', [
  'username',
  -1,
  1000,
  ...filter
])
```

## Best Practices

### Key Management Best Practices

1. **Never hardcode keys** in source code
2. **Use environment variables** for key storage
3. **Implement proper key rotation** strategies
4. **Use the minimum required key role** for operations
5. **Monitor key usage** and access patterns

### Transaction Best Practices

1. **Validate all inputs** before creating transactions
2. **Use appropriate expiration times** for operations
3. **Handle errors gracefully** with proper logging
4. **Implement retry logic** for critical operations
5. **Monitor transaction success rates** and performance

### API Best Practices

1. **Use connection pooling** for high-frequency calls
2. **Implement caching** for frequently accessed data
3. **Handle rate limiting** appropriately
4. **Use failover mechanisms** for reliability
5. **Monitor API performance** and error rates

### Security Best Practices

1. **Follow the principle of least privilege** for keys
2. **Implement proper input validation** and sanitization
3. **Use HTTPS connections** exclusively
4. **Keep dependencies updated** regularly
5. **Implement proper error handling** without exposing sensitive data

### Performance Best Practices

1. **Profile performance** regularly with realistic workloads
2. **Implement caching strategies** for frequently accessed data
3. **Batch related operations** to reduce network calls
4. **Monitor memory usage** and prevent leaks
5. **Optimize critical code paths** for better performance

## Support

### Where can I get help?

1. **GitHub Issues**: For bug reports and feature requests
2. **GitHub Discussions**: For general questions and discussions
3. **Documentation**: Comprehensive guides and API references
4. **Examples**: Practical usage examples in the repository
5. **Community**: Hive developer communities and forums

### How do I stay updated?

1. **Watch the repository** on GitHub
2. **Subscribe to release notifications**
3. **Follow the changelog** for breaking changes
4. **Join the developer community**
5. **Participate in discussions** and feedback

This FAQ covers the most common questions and scenarios. For more detailed information, please refer to the specific documentation sections and examples.
