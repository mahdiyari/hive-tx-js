# hive-tx

The most lightweight library for Hive blockchain while being a complete library. Regularly maintained to support the latest features of the blockchain. For Web and NodeJS.

Library size: ~28KB minified+gzipped (including all the dependencies)

## Comprehensive Documentation

- 🚀 [Quick Start Guide](docs/QUICKSTART.md) - Get up and running in minutes
- 💻 [Examples](docs/EXAMPLES.md) - Practical usage examples

## Installation

```bash
npm install hive-tx --save
```

## Usage

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

## Quick Usage Examples

### New Transaction API (v7+)

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

### Transfer HIVE

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

### API Calls

```js
import { call } from 'hive-tx'

// Get account information
const accounts = await call('condenser_api.get_accounts', [['username']])
console.log('Account:', accounts.result[0])

// Get blockchain properties
const props = await call('condenser_api.get_dynamic_global_properties')
console.log('Head block:', props.result.head_block_number)
```

### Key Management

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
// Default nodes that are already set:
config.node = [
  'https://api.hive.blog',
  'https://api.deathwing.me',
  'https://api.openhive.network',
  'https://rpc.mahdiyari.info',
  'https://techcoderx.com',
  'https://hiveapi.actifit.io',
  'https://api.c0ff33a.uk'
]

// Custom timeout and retry settings
config.timeout = 10_000 // 10 seconds
config.retry = 8 // 8 retry attempts before throwing an error
```

### Breaking Changes in v7

- `tx.create()` => `await tx.addOperation(opName, opBody)`
- All timeout values are now in millisecond
- All expiration values are in millisecond
- `new Transaction(transaction)` => `new Transaction({transaction, expiration})`
- Removed `Transaction.signedTransaction`. Signatures are available on `Transaction.transaction`
- Removed `config.healthcheckInterval`

### What's new in v7

- Codebase reworked in TypeScript
- All methods now have good JSDoc documentation
- Added full IDE intellisense for operations
- Added tests including operation tests to keep them up to date with hived
- Added docs/EXAMPLES.md and docs/QUICKSTART.md
- Output 3 builds: ESM, CJS, UMD minified .js for browser

## License

MIT

## Support

- #dev-chat at [Hive's Discord server](https://myhive.li/discord)
