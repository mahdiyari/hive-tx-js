# hive-tx-js

Lightweight and complete JavaScript library for using Hive blockchain in Javascript environments such as Web or NodeJS.

#### Why this?

Most lightweight library to use in your applications.

Some libraries are not easy to integrate and in some cases are incompatible with some frameworks like [Nativescript](https://www.nativescript.org/)

This library is a solution to such cases when official libraries are not working. And also an lightweight alternative for other libraries.

## Installation

```
npm install hive-tx --save
```

## Usage

**Browser:**

```
<script src="https://cdn.jsdelivr.net/npm/hive-tx/dist/hive-tx.min.js"></script>
```

or

```
<script src="dist/hive-tx.min.js"></script>
```

`hiveTx` is available after including /dist/hive-tx.min.js file in your html file.

**NodeJS:**

```
const hiveTx = require('hive-tx')
```

## Usage examples

**Configuration**

Set or get configs:

```
// default values already defined in config.js
hiveTx.config.node = "https://api.hive.blog"
hiveTx.config.chain_id = "0000000000000000000000000000000000000000000000000000000000000000"
hiveTx.config.address_prefix = "STM"
```

**HF24**

Eclipse rpc nodes require this configuration for now:

```
hiveTx.config.rebranded_api = true
hiveTx.updateOperations()
```

You can get the node version to check whether an RPC node is updated or not:

```
hiveTx.call('condenser_api.get_version').then(res => {
  if (res.blockchain_version !== '0.23.0') {
    // RPC node is updated to eclipse
    hiveTx.config.rebranded_api = true
    hiveTx.updateOperations()
  }
})
```

**Create transaction:**

```
const tx = new hiveTx.Transaction(trx?)
```

or

```
const tx = new hiveTx.Transaction()
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

const tx = new hiveTx.Transaction()
tx.create(operations).then(() => console.log(tx.transaction))
```

**Sign transaction:**

```
const myKey = '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg'
const privateKey = hiveTx.PrivateKey.from(myKey)

tx.sign(privateKey)
console.log(tx.signedTransaction)
```

**Broadcast transaction:**

```
tx.broadcast().then(res => console.log(res))
```

**Make node call:**

```
hiveTx.call(method, params = [], timeout = 10): Promise
```

Example:

```
hiveTx.call('condenser_api.get_accounts', [['mahdiyari']]).then(res => console.log(res))
```

## License

MIT

Note: In building some parts we used functions from [dsteem](https://github.com/jnordberg/dsteem) library
