import { ripemd160 } from '@noble/hashes/legacy.js'
import bs58 from 'bs58'
import { config } from '../config'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { Signature } from './Signature'

const DEFAULT_ADDRESS_PREFIX = config.address_prefix

/**
 * ECDSA (secp256k1) public key for Hive blockchain operations.
 * Handles key validation, signature verification, and string encoding.
 *
 * Public keys are used to verify signatures and as recipients for encrypted memos.
 * They can be stored as strings (e.g., "STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA").
 *
 * @example
 * ```typescript
 * // From string
 * const pubKey = PublicKey.fromString('STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA')
 *
 * // From private key
 * const pubKey = privateKey.createPublic()
 *
 * // Verify a signature
 * const isValid = pubKey.verify(messageHash, signature)
 *
 * // Convert to string for storage
 * const keyString = pubKey.toString()
 * ```
 */
export class PublicKey {
  /** Raw public key bytes (33 bytes, compressed format) */
  key: Uint8Array

  /** Address prefix (e.g., "STM" for Hive mainnet) */
  prefix: string

  /**
   * Creates a new PublicKey instance from raw bytes.
   * @param key Raw public key bytes (33 bytes, compressed format)
   * @param prefix Optional address prefix (defaults to config.address_prefix)
   */
  constructor(key: Uint8Array, prefix?: string) {
    this.key = key
    this.prefix = prefix ?? DEFAULT_ADDRESS_PREFIX
    // assert(secp256k1.publicKeyVerify(key), 'invalid public key')
  }

  /**
   * Creates a PublicKey from a string representation.
   * @param wif Public key string (e.g., "STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA")
   * @returns New PublicKey instance
   * @throws Error if the key format is invalid
   */
  static fromString(wif: string): PublicKey {
    const { key, prefix } = decodePublic(wif)
    return new PublicKey(key, prefix)
  }

  /**
   * Creates a PublicKey from a string or returns the instance if already a PublicKey.
   * @param value Public key string or PublicKey instance
   * @returns New or existing PublicKey instance
   */
  static from(value: string | PublicKey): PublicKey {
    if (value instanceof PublicKey) {
      return value
    } else {
      return PublicKey.fromString(value as string)
    }
  }

  /**
   * Verifies a signature against a message hash.
   * @param message 32-byte message hash to verify
   * @param signature Signature object to verify
   * @returns True if signature is valid, false otherwise
   */
  verify(message: Uint8Array, signature: Signature): boolean {
    return secp256k1.verify(signature.data, message, this.key)
  }

  /**
   * Returns the public key as a string for storage or transmission.
   * @returns Public key string with prefix (e.g., "STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA")
   */
  toString(): string {
    return encodePublic(this.key, this.prefix)
  }

  /**
   * Returns JSON representation (same as toString()).
   * @returns Public key string
   */
  toJSON(): string {
    return this.toString()
  }

  /**
   * Returns a string representation for debugging.
   * @returns Formatted public key string
   */
  inspect(): string {
    return `PublicKey: ${this.toString()}`
  }
}

const encodePublic = (key: Uint8Array, prefix: string): string => {
  const checksum = ripemd160(key)
  return prefix + bs58.encode(new Uint8Array([...key, ...checksum.subarray(0, 4)]))
}

/** Decode bs58+ripemd160-checksum encoded public key. */
const decodePublic = (encodedKey: string) => {
  const prefix = encodedKey.slice(0, 3)
  encodedKey = encodedKey.slice(3)
  const buffer = bs58.decode(encodedKey)
  const key = buffer.subarray(0, buffer.length - 4)
  return { key: key as Uint8Array, prefix }
}
