/** ECDSA (secp256k1) signature. */
class Signature {
  constructor (data, recovery) {
    this.data = data
    this.recovery = recovery
  }

  static from (string) {
    if (typeof string === 'string') {
      const temp = Buffer.from(string, 'hex')
      const recovery = parseInt(temp.slice(0, 1).toString('hex'), 16) - 31
      const data = temp.slice(1)
      return new Signature(data, recovery)
    } else {
      return new Error('Expected string for data')
    }
  }

  toBuffer () {
    const buffer = Buffer.alloc(65)
    buffer.writeUInt8(this.recovery + 31, 0)
    this.data.copy(buffer, 1)
    return buffer
  }

  customToString () {
    return this.toBuffer().toString('hex')
  }
}

module.exports = Signature
