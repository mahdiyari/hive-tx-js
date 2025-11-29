# hive-tx

Lightweight and complete JavaScript library for Hive blockchain - Web and NodeJS.

#### Why this?

The most lightweight while being a complete library.

Some libraries are not easy to integrate and in some cases are incompatible with some frameworks like [Nativescript](https://www.nativescript.org/)

Hive-tx is a solution to such cases when the other libraries are not working.

## 📚 Comprehensive Documentation

**New comprehensive documentation is now available!** Check out the detailed guides in the [docs](docs/) directory:

- 🚀 [Quick Start Guide](docs/QUICKSTART.md) - Get up and running in minutes
- 📖 [API Reference](docs/API.md) - Complete API documentation
- 🔄 [Migration Guide](docs/MIGRATION.md) - Migrating from other libraries
- 💻 [Examples](docs/examples/) - Practical usage examples
- 🦺 [TypeScript Guide](docs/TYPESCRIPT.md) - Advanced TypeScript usage
- 🧪 [Testing Guide](docs/TESTING.md) - Testing your applications
- ⚡ [Performance Guide](docs/PERFORMANCE.md) - Performance optimization
- 🔒 [Security Guide](docs/SECURITY.md) - Security best practices
- ❓ [FAQ](docs/FAQ.md) - Common questions and answers
- 🤝 [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute

## Bundle Size

**Optimized for minimal footprint:**
- **Browser build**: ~141 KiB (minified + gzipped)
- **Node.js**: Full functionality with all dependencies

The browser build uses native `fetch` API for HTTP requests, eliminating the need for axios in client-side code. This results in a **21% smaller bundle** compared to the previous version.

**Size breakdown:**
- Core crypto (@noble libraries): ~83% of bundle size (essential for blockchain operations)
- Application code: ~17% of bundle size
- HTTP client: Externalized (not bundled in browser)

## Installation

```bash
npm install hive-tx --save
```

## Usage

**Browser:**

```html
<script src="https://cdn.jsdelivr.net/npm/hive-tx/dist/hive-tx.min.js"></script>
```

`hiveTx` is available after including /dist/hive-tx.min.js file in your html file.

**NodeJS:**

```js
// ES Module
import * as hiveTx from 'hive-tx'

// OR import what you use
import { call, Transaction, PrivateKey } from 'hive-tx'

// OR in CommonJS environments using dynamic import()
const hiveTx = await import('hive-tx')

// OR import what you use
const { call, Transaction, PrivateKey } = await import('hive-tx')
```

## Quick Usage Examples

### 🔄 New Transaction API (v7+)

```js
import { Transaction, PrivateKey } from 'hive-tx'

// Create and broadcast a vote
const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'your-username',
  author: 'post-author',
  permlink: 'post-permlink',
  weight: 10000 // 100%
})

const key = PrivateKey.from('your-private-key')
tx.sign(key)
const result = await tx.broadcast()
console.log('Vote successful!', result.result.tx_id)
```

### 💰 Transfer HIVE

```js
import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Thanks for your help!'
})

const key = PrivateKey.from('your-active-key')
tx.sign(key)
const result = await tx.broadcast()
console.log('Transfer successful!', result.result.tx_id)
```

### 📡 API Calls

```js
import { call } from 'hive-tx'

// Get account information
const accounts = await call('condenser_api.get_accounts', [['username']])
console.log('Account:', accounts.result[0])

// Get blockchain properties
const props = await call('condenser_api.get_dynamic_global_properties')
console.log('Head block:', props.result.head_block_number)
```

### 🔑 Key Management

```js
import { PrivateKey } from 'hive-tx'

// Create keys in multiple ways
const key1 = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
const key2 = PrivateKey.randomKey()
const key3 = PrivateKey.fromLogin('username', 'password', 'posting')
const key4 = PrivateKey.fromSeed('my-secret-seed')
```

## Configuration

```js
import { config } from 'hive-tx'

// Configure API nodes with failover
config.node = [
  'https://api.hive.blog',
  'https://api.deathwing.me',
  'https://rpc.mahdiyari.info'
]

// Custom timeout and retry settings
config.timeout = 10 // 10 seconds
config.retry = 3     // 3 retry attempts
```

## 🆕 What's New in v7

### Breaking Changes
- `tx.create()` → `await tx.addOperation()`
- Improved TypeScript support with better type safety
- Enhanced error handling and messages
- Modern async/await API

### New Features
- Multi-signature transaction support
- Enhanced memo encryption/decryption
- Better retry and failover mechanisms
- Improved performance and memory management

## 📖 Full Documentation

For comprehensive documentation, please see:
- [Quick Start Guide](docs/QUICKSTART.md) - Get started quickly
- [API Reference](docs/API.md) - Complete API documentation
- [Examples Directory](docs/examples/) - Practical usage examples
- [Migration Guide](docs/MIGRATION.md) - Upgrading from previous versions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details on how to get started.

## 📄 License

MIT

## 🆘 Support

- 📚 Check the [FAQ](docs/FAQ.md) for common questions
- 🐛 Report issues on [GitHub Issues](https://github.com/mahdiyari/hive-tx-js/issues)
- 💬 Join the Hive developer community for discussions
