# hive-tx

Lightweight and complete JavaScript library for Hive blockchain - Web and NodeJS.

#### Why this?

The most lightweight while being a complete library.

Some libraries are not easy to integrate and in some cases are incompatible with some frameworks like [Nativescript](https://www.nativescript.org/)

Hive-tx is a solution to such cases when the other libraries are not working.

## Installation

```bash
npm install hive-tx --save
```

## Usage

**Browser:**

```html
<script src="https://cdn.jsdelivr.net/npm/hive-tx/dist/hive-tx.min.js"></script>
```

or

```html
<script src="dist/hive-tx.min.js"></script>
```

`hiveTx` is available after including /dist/hive-tx.min.js file in your html file.

**NodeJS:**

```js
import * as hiveTx from 'hive-tx'

// OR import what you use
import { Transaction, PrivateKey } from 'hive-tx'
```

## Usage examples

**Configuration**

Set or get configs:

```js
// default values that are already defined in config.js
hiveTx.config.node = "https://api.hive.blog"
hiveTx.config.chain_id = "beeab0de00000000000000000000000000000000000000000000000000000000"
hiveTx.config.address_prefix = "STM"
hiveTx.config.axiosAdapter = null
```

You can define a different adapter if your environment doesn't support 'xhr' or 'http'
See https://github.com/haverstack/axios-fetch-adapter
Example:
```js
import fetchAdapter from '@haverstack/axios-fetch-adapter'
hiveTx.config.axiosAdapter = fetchAdapter
```

**Create transaction:**

```js
const tx = new hiveTx.Transaction(trx?)
```

or

```js
const tx = new hiveTx.Transaction()
tx.create(operations, expiration = 60)
```

Example:

```js
const operations = [
  [
    'vote',
    {
      voter: 'guest123',
      author: 'guest123',
      permlink: '20191107t125713486z-post',
      weight: 9900
    }
  ]
]

const tx = new hiveTx.Transaction()
tx.create(operations).then(() => console.log(tx.transaction))
```

**Sign transaction:**

```js
const myKey = '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg'
const privateKey = hiveTx.PrivateKey.from(myKey)

tx.sign(privateKey)
console.log(tx.signedTransaction)
```

**Broadcast transaction:**

```js
tx.broadcast().then(res => console.log(res))
```

**Get transaction digest and id**  

Will return the hash and transaction id without broadcasting the transaction.
```js
const digest = tx.digest()
// { digest: Buffer, txId: string }
```

**Make node call:**

```js
hiveTx.call(method, params = [], timeout = 10): Promise
```

Example:

```js
hiveTx.call('condenser_api.get_accounts', [['mahdiyari']]).then(res => console.log(res))
```

**Sign message and verify sginature:**
```js
hiveTx.PrivateKey.sign(message: Buffer)
hiveTx.PublicKey.verify(message: Buffer, signature: Signature)
```

Example:
```js
const { sha256 } = require( 'hive-tx/helpers/crypto' )

const privateKey = hiveTx.PrivateKey.from('5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg')
const publicKey = hiveTx.PublicKey.from('STM6aGPtxMUGnTPfKLSxdwCHbximSJxzrRjeQmwRW9BRCdrFotKLs')
const message = sha256('testing')
const signature = privateKey.sign(message)
const verify = publicKey.verify(message, signature) // true
```
Or create Sginature from string:
```js
const signature = hiveTx.Signature.from('1f019dc13a308cef138162cc16ab7c3aa1891941fddec66d83ff29b01b649a86600802d301f13505abc8c9ccbbeb86852fc71134fe209a6e717c6fd7b4cd1505a2')
```

**Generate random key**
```js
hiveTx.PrivateKey.randomKey()
```

**Retrieve public key from Signature**  
```js
const signature = hiveTx.Signature.from(string)
signature.getPublicKey(message)
```

For example we find the public key used for signing this transaction:  
https://hiveblocks.com/tx/207c06a5448e18b501d15891aed6f3ecbeb96b83  

```js
const signature = hiveTx.Signature.from('203dfa2f2620f94a033c424710bbf22c518e1d9aec4170b342789acdc714bf0b483ff1e2ec1fcd5607e5df767ba09751792484a7ac1cf31c94cf55b1e81df6be30')
const trx = new hiveTx.Transaction({
    ref_block_num: 30883,
    ref_block_prefix: 3663302639,
    expiration: '2023-05-26 07:49:44',
    operations: [[
        'vote',
        {
            voter: 'mahdiyari',
            author: 'afa.hb03',
            permlink: 'esp-engcoastal-sentry-splinterlands-art-contest-week-242-by-afahb03',
            weight: 2000
        }
    ]],
    extensions: []
})
const { digest } = trx.digest()
const publicKey = signature.getPublicKey(digest).toString()
// STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF
// To find which account has this public key
const account = await hiveTx.call('condenser_api.get_key_references', [["STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF"]])
// steemauto
```

**Encode/Decode Memo**
```js
import { Memo, PrivateKey, PublicKey } from 'hive-tx'

// sender private key
const privateKey = PrivateKey.from('...')
// receiver public memo key
const publicKey = PublicKey.from('...')

// must have #
const memo = '#testing'
const encryptedMemo = await Memo.encode(privateKey, publicKey, memo)

// Decode using receiver's private memo key
const decryptedMemo = await Memo.decode(privateKey, encryptedMemo)
```

## License

MIT
