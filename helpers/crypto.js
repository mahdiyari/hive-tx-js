const CryptoJS = require('crypto-js')
// const crypto = require('crypto')

const sha256 = (input) => {
  // const hash = crypto.createHash('sha256').update(input).digest()
  if (typeof input !== 'string') {
    input = CryptoJS.lib.WordArray.create(input)
  }
  const hash = Buffer.from(
    CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex),
    'hex'
  )
  return hash
}

const ripemd160 = (input) => {
  // return crypto.createHash('ripemd160').update(input).digest()
  if (typeof input !== 'string') {
    input = CryptoJS.lib.WordArray.create(input)
  }
  const hash = Buffer.from(
    CryptoJS.RIPEMD160(input).toString(CryptoJS.enc.Hex),
    'hex'
  )
  return hash
}

module.exports = { sha256, ripemd160 }
