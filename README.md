# steem-tx-js
Lightweight JavaScript library for creating and signing transactions (Steem blockchain)

#### Why this?
[steem-js](https://github.com/steemit/steem-js) and [dsteem](https://github.com/jnordberg/dsteem) libraries are not easy to integrate and in some cases are incompatible with some frameworks like [Nativescript](https://www.nativescript.org/)

This library is a solution to such cases when official libraries are not working. And also an alternative for just creating, signing, and broadcasting transactions.

## Installation
```
npm install steem-tx --save
```

## Usage
**Create transaction:**
```
const steemTx = require('steem-tx')
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

## License
MIT

Note: In building some parts we used functions from [dsteem](https://github.com/jnordberg/dsteem) library
