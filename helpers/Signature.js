/** ECDSA (secp256k1) signature. */
class Signature {
  constructor(data, recovery) {
    this.data = data
    this.recovery = recovery
  }

  toBuffer() {
    const buffer = Buffer.alloc(65)
    buffer.writeUInt8(this.recovery + 31, 0)
    this.data.copy(buffer, 1)
    return buffer
  }

  customToString() {
    return this.toBuffer().toString('hex')
  }
}

module.exports = Signature
