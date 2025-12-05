import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js'

/** Buffer wrapper that serializes to a hex-encoded string. */
export class HexBuffer {
  buffer: Uint8Array
  /** Convenience to create a new HexBuffer, does not copy data if value passed is already a buffer. */
  static from(value: string | Uint8Array | HexBuffer) {
    if (value instanceof HexBuffer) {
      return value
    } else if (value instanceof Uint8Array) {
      return new HexBuffer(value)
    } else if (typeof value === 'string') {
      return new HexBuffer(hexToBytes(value))
    } else {
      return new HexBuffer(new Uint8Array(value))
    }
  }

  constructor(buffer: Uint8Array) {
    this.buffer = buffer
  }

  toString() {
    return bytesToHex(this.buffer)
  }

  toJSON() {
    return this.toString()
  }
}
