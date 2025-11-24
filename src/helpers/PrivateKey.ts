import bs58 from 'bs58'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { sha256, sha512 } from '@noble/hashes/sha2.js'
import { PublicKey } from './PublicKey'
import { Signature } from './Signature'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js'

export type KeyRole = 'owner' | 'active' | 'posting' | 'memo'

const NETWORK_ID = new Uint8Array([0x80])

/** ECDSA (secp256k1) private key. */
export class PrivateKey {
  key: Uint8Array

  constructor(key: Uint8Array) {
    this.key = key
    try {
      secp256k1.getPublicKey(key)
    } catch (e) {
      throw new Error('invalid private key')
    }
  }

  /** Convenience to create a new instance from WIF string or Uint8Array */
  static from(value: string | Uint8Array): PrivateKey {
    if (typeof value === 'string') {
      return PrivateKey.fromString(value)
    } else {
      return new PrivateKey(value)
    }
  }

  /** Create a new instance from a WIF-encoded key. */
  static fromString(wif: string): PrivateKey {
    return new PrivateKey(decodePrivate(wif).subarray(1))
  }

  /** Create a new instance from a seed. */
  static fromSeed(seed: string | Uint8Array): PrivateKey {
    if (typeof seed === 'string') {
      seed = hexToBytes(seed)
    }
    return new PrivateKey(sha256(seed))
  }

  /** Create key from username and password. */
  static fromLogin(username: string, password: string, role: KeyRole = 'active'): PrivateKey {
    const seed = username + role + password
    return PrivateKey.fromSeed(seed)
  }

  /**
   * Sign message.
   * @param message 32-byte message.
   */
  sign(message: Uint8Array): Signature {
    const rv = secp256k1.sign(message, this.key, {
      extraEntropy: true,
      format: 'recovered',
      prehash: false // prehash does sha256 on the message
    })
    const recovery = parseInt(bytesToHex(rv.subarray(0, 1)), 16)
    return Signature.from((recovery + 31).toString(16) + bytesToHex(rv.subarray(1)))
  }

  /** Derive the public key for this private key. */
  createPublic(prefix?: string): PublicKey {
    return new PublicKey(secp256k1.getPublicKey(this.key), prefix)
  }

  /** Return a WIF-encoded representation of the key. */
  toString(): string {
    return encodePrivate(new Uint8Array([...NETWORK_ID, ...this.key]))
  }

  /**
   * Does not show the full key.
   * To get the full encoded key you need to explicitly call toString.
   */
  inspect(): string {
    const key = this.toString()
    return `PrivateKey: ${key.slice(0, 6)}...${key.slice(-6)}`
  }

  /**
   * Get shared secret for memo cryptography
   */
  getSharedSecret(publicKey: PublicKey): Uint8Array {
    const s = secp256k1.getSharedSecret(this.key, publicKey.key)
    // strip the parity byte
    return sha512(s.subarray(1))
  }

  /**
   * Returns a randomly generated instance of PrivateKey
   * Might take up to 250ms
   */
  static randomKey(): PrivateKey {
    return new PrivateKey(secp256k1.keygen().secretKey)
  }
}

const doubleSha256 = (input: Uint8Array) => {
  const dbl = sha256(sha256(input))
  return dbl
}

/** Encode bs58+doubleSha256-checksum private key. */
const encodePrivate = (key: Uint8Array) => {
  // assert.equal(key.readUInt8(0), 0x80, 'private key network id mismatch')
  const checksum = doubleSha256(key)
  return bs58.encode(new Uint8Array([...key, ...checksum.slice(0, 4)]))
}

/** Decode bs58+doubleSha256-checksum encoded private key. */
const decodePrivate = (encodedKey: string) => {
  const buffer = bs58.decode(encodedKey)
  if (!isUint8ArrayEqual(buffer.slice(0, 1), NETWORK_ID)) {
    throw new Error('Private key network id mismatch')
  }
  const checksum = buffer.slice(-4)
  const key = buffer.slice(0, -4)
  const checksumVerify = doubleSha256(key).slice(0, 4)
  if (!isUint8ArrayEqual(checksum, checksumVerify)) {
    throw new Error('Private key checksum mismatch')
  }
  return key
}

const isUint8ArrayEqual = (a: Uint8Array, b: Uint8Array) => {
  if (a === b) return true
  if (a.byteLength !== b.byteLength) return false
  const len = a.byteLength
  let i = 0
  while (i < len && a[i] === b[i]) i++
  return i === len
}
