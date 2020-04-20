# steem-tx-js

Lightweight and complete JavaScript library for using Steem/Hive blockchain in Javascript environments such as Web or NodeJS.

#### Why this?

[steem-js](https://github.com/steemit/steem-js) and [dsteem](https://github.com/jnordberg/dsteem) libraries are not easy to integrate and in some cases are incompatible with some frameworks like [Nativescript](https://www.nativescript.org/)

This library is a solution to such cases when official libraries are not working. And also an lightweight alternative for other libraries.

## Installation

```
npm install steem-tx --save
```

## Usage

**Browser:**

```
<script src="https://cdn.jsdelivr.net/npm/steem-tx/dist/steem-tx.min.js"></script>
```

or

```
<script src="dist/steem-tx.min.js"></script>
```

`steemTx` is available after including /dist/steem-tx.min.js file in your html file.

**NodeJS:**

```
const steemTx = require('steem-tx')
```

## Usage examples

**Configuration**

Set or get configs:

```
// default values already defined in config.js
steemTx.config.node = "https://api.steemit.com"
steemTx.config.chain_id = "0000000000000000000000000000000000000000000000000000000000000000"
steemTx.config.address_prefix = "STM"
```

**Create transaction:**
```
const tx = new steemTx.Transaction(trx?)
```
or
```
const tx = new steemTx.Transaction()
tx.create(operations, expiration = 60)
```

Example:
```
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

const tx = new steemTx.Transaction()
tx.create(operations).then(() => console.log(tx.transaction))
```

**Sign transaction:**

```
const myKey = '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg'
const privateKey = steemTx.PrivateKey.from(myKey)

tx.sign(privateKey)
console.log(tx.signedTransaction)
```

**Broadcast transaction:**

```
tx.broadcast().then(res => console.log(res))
```

**Make node call:**
```
steemTx.call(method, params = [], timeout = 10): Promise
```

Example:
```
steemTx.call('condenser_api.get_accounts', [['mahdiyari']]).then(res => console.log(res))
```

## License

MIT

Note: In building some parts we used functions from [dsteem](https://github.com/jnordberg/dsteem) library
