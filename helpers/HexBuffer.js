/** Buffer wrapper that serializes to a hex-encoded string. */
class HexBuffer {
  /** Convenience to create a new HexBuffer, does not copy data if value passed is already a buffer. */
  static from (value) {
    if (value instanceof HexBuffer) {
      return value
    } else if (value instanceof Buffer) {
      return new HexBuffer(value)
    } else if (typeof value === 'string') {
      return new HexBuffer(Buffer.from(value, 'hex'))
    } else {
      return new HexBuffer(Buffer.from(value))
    }
  }

  constructor (buffer) {
    this.buffer = buffer
  }

  toString (encoding = 'hex') {
    return this.buffer.toString(encoding)
  }

  toJSON () {
    return this.toString()
  }
}

module.exports = HexBuffer
