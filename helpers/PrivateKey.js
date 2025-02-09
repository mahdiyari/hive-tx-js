import bs58 from 'bs58'
import { secp256k1 } from '@noble/curves/secp256k1'
import { config } from '../config.js'
import { sha256, sha512 } from './crypto.js'
import { PublicKey } from './PublicKey.js'
import { Signature } from './Signature.js'

const NETWORK_ID = new Uint8Array([0x80])
const DEFAULT_ADDRESS_PREFIX = config.address_prefix

/** ECDSA (secp256k1) private key. */
export class PrivateKey {
  constructor (key) {
    this.key = key
    try {
      secp256k1.getPublicKey(key)
    } catch (e) {
      throw new Error('invalid private key')
    }
  }

  /** Convenience to create a new instance from WIF string or Uint8Array */
  static from (value) {
    if (typeof value === 'string') {
      return PrivateKey.fromString(value)
    } else {
      return new PrivateKey(value)
    }
  }

  /** Create a new instance from a WIF-encoded key. */
  static fromString (wif) {
    return new PrivateKey(decodePrivate(wif).subarray(1))
  }

  /** Create a new instance from a seed. */
  static fromSeed (seed) {
    return new PrivateKey(sha256(seed))
  }

  /** Create key from username and password. */
  static fromLogin (username, password, role = 'active') {
    const seed = username + role + password
    return PrivateKey.fromSeed(seed)
  }

  /**
   * Sign message.
   * @param message 32-byte message.
   */
  sign (message) {
    const options = {
      extraEntropy: true,
      lowS: true
    }
    const rv = secp256k1.sign(message, this.key, options)
    return Signature.from((rv.recovery + 31).toString(16) + rv.toCompactHex())
  }

  /** Derive the public key for this private key. */
  createPublic (prefix = DEFAULT_ADDRESS_PREFIX) {
    return new PublicKey(secp256k1.getPublicKey(this.key), prefix)
  }

  /** Return a WIF-encoded representation of the key. */
  toString () {
    return encodePrivate(new Uint8Array([...NETWORK_ID, ...this.key]))
  }

  /**
   * Used by `utils.inspect` and `console.log` in node.js. Does not show the full key
   * to get the full encoded key you need to explicitly call {@link toString}.
   */
  inspect () {
    const key = this.toString()
    return `PrivateKey: ${key.slice(0, 6)}...${key.slice(-6)}`
  }

  /**
   * Get shared secret for memo cryptography
   */
  getSharedSecret (publicKey) {
    const s = secp256k1.getSharedSecret(this.key, publicKey.key)
    // strip the parity byte
    return sha512(s.subarray(1))
  }

  /**
   * Returns a randomly generated instance of PrivateKey
   * Might take up to 250ms
   */
  static randomKey () {
    return new PrivateKey(secp256k1.utils.randomPrivateKey())
  }
}

const doubleSha256 = input => {
  const dbl = sha256(sha256(input))
  return dbl
}

/** Encode bs58+doubleSha256-checksum private key. */
const encodePrivate = key => {
  // assert.equal(key.readUInt8(0), 0x80, 'private key network id mismatch')
  const checksum = doubleSha256(key)
  return bs58.encode(new Uint8Array([...key, ...checksum.slice(0, 4)]))
}

/** Decode bs58+doubleSha256-checksum encoded private key. */
const decodePrivate = encodedKey => {
  const buffer = bs58.decode(encodedKey)
  // assert.deepEqual(buffer.slice(0, 1), NETWORK_ID, 'private key network id mismatch')
  // const checksum = buffer.slice(-4)
  const key = buffer.slice(0, -4)
  // const checksumVerify = doubleSha256(key).slice(0, 4)
  // assert.deepEqual(checksumVerify, checksum, 'private key checksum mismatch')
  return key
}
