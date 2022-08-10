const secp256k1 = require('secp256k1')
const crypto = require('./crypto')
const PublicKey = require('./PublicKey')
const Signature = require('./Signature')
const bs58 = require('bs58')
const config = require('../config')

const NETWORK_ID = Buffer.from([0x80])
const DEFAULT_ADDRESS_PREFIX = config.address_prefix

/** ECDSA (secp256k1) private key. */
class PrivateKey {
  /** Convenience to create a new instance from WIF string or buffer */
  static from (value) {
    if (typeof value === 'string') {
      return PrivateKey.fromString(value)
    } else {
      return new PrivateKey(value)
    }
  }

  /** Create a new instance from a WIF-encoded key. */
  static fromString (wif) {
    return new PrivateKey(decodePrivate(wif).slice(1))
  }

  /** Create a new instance from a seed. */
  static fromSeed (seed) {
    return new PrivateKey(crypto.sha256(seed))
  }

  /** Create key from username and password. */
  static fromLogin (username, password, role = 'active') {
    const seed = username + role + password
    return PrivateKey.fromSeed(seed)
  }

  constructor (key) {
    this.key = key
    if (!secp256k1.privateKeyVerify(key)) {
      throw new Error('invalid private key')
    }
  }

  /**
   * Sign message.
   * @param message 32-byte message.
   */
  sign (message) {
    let rv = {}
    let attempts = 0
    do {
      const options = {
        data: crypto.sha256(
          Buffer.concat([message, Buffer.alloc(1, ++attempts)])
        )
      }
      rv = secp256k1.sign(message, this.key, options)
    } while (!isCanonicalSignature(rv.signature))
    return new Signature(rv.signature, rv.recovery)
  }

  /** Derive the public key for this private key. */
  createPublic (prefix = DEFAULT_ADDRESS_PREFIX) {
    return new PublicKey(secp256k1.publicKeyCreate(this.key), prefix)
  }

  /** Return a WIF-encoded representation of the key. */
  toString () {
    return encodePrivate(Buffer.concat([NETWORK_ID, this.key]))
  }

  /**
   * Used by `utils.inspect` and `console.log` in node.js. Does not show the full key
   * to get the full encoded key you need to explicitly call {@link toString}.
   */
  inspect () {
    const key = this.toString()
    return `PrivateKey: ${key.slice(0, 6)}...${key.slice(-6)}`
  }
}

const doubleSha256 = input => {
  const dbl = crypto.sha256(crypto.sha256(input))
  return dbl
}

const isCanonicalSignature = signature => {
  return (
    !(signature[0] & 0x80) &&
    !(signature[0] === 0 && !(signature[1] & 0x80)) &&
    !(signature[32] & 0x80) &&
    !(signature[32] === 0 && !(signature[33] & 0x80))
  )
}

/** Encode bs58+doubleSha256-checksum private key. */
const encodePrivate = key => {
  // assert.equal(key.readUInt8(0), 0x80, 'private key network id mismatch')
  const checksum = doubleSha256(key)
  return bs58.encode(Buffer.concat([key, checksum.slice(0, 4)]))
}

/** Decode bs58+doubleSha256-checksum encoded private key. */
const decodePrivate = encodedKey => {
  const buffer = Buffer.from(bs58.decode(encodedKey))
  // assert.deepEqual(buffer.slice(0, 1), NETWORK_ID, 'private key network id mismatch')
  // const checksum = buffer.slice(-4)
  const key = buffer.slice(0, -4)
  // const checksumVerify = doubleSha256(key).slice(0, 4)
  // assert.deepEqual(checksumVerify, checksum, 'private key checksum mismatch')
  return key
}

module.exports = PrivateKey
