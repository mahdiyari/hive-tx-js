/**
 * @license bytebuffer.ts (c) 2015 Daniel Wirtz <dcode@dcode.io>
 * Backing buffer: ArrayBuffer, Accessor: DataView
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/bytebuffer.ts for details
 * modified by @xmcl/bytebuffer
 * And customized for hive-tx
 */

const EMPTY_BUFFER = new ArrayBuffer(0)
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export class ByteBuffer {
  static LITTLE_ENDIAN = true
  static BIG_ENDIAN = false
  static DEFAULT_CAPACITY = 16
  static DEFAULT_ENDIAN = ByteBuffer.BIG_ENDIAN

  buffer: ArrayBufferLike
  view: DataView
  offset: number
  markedOffset: number
  limit: number
  littleEndian: boolean

  constructor(
    capacity: number = ByteBuffer.DEFAULT_CAPACITY,
    littleEndian: boolean = ByteBuffer.DEFAULT_ENDIAN
  ) {
    this.buffer = capacity === 0 ? EMPTY_BUFFER : new ArrayBuffer(capacity)
    this.view = capacity === 0 ? new DataView(EMPTY_BUFFER) : new DataView(this.buffer)
    this.offset = 0
    this.markedOffset = -1
    this.limit = capacity
    this.littleEndian = littleEndian
  }

  static allocate(capacity?: number, littleEndian?: boolean): ByteBuffer {
    return new ByteBuffer(capacity, littleEndian)
  }

  static concat(
    buffers: Array<ByteBuffer | ArrayBuffer | Uint8Array | number[]>,
    littleEndian?: boolean
  ): ByteBuffer {
    let capacity = 0
    for (let i = 0; i < buffers.length; ++i) {
      const buf = buffers[i]
      if (buf instanceof ByteBuffer) {
        capacity += buf.limit - buf.offset
      } else if (buf instanceof Uint8Array) {
        capacity += buf.length
      } else if (buf instanceof ArrayBuffer) {
        capacity += buf.byteLength
      } else if (Array.isArray(buf)) {
        capacity += buf.length
      } else {
        throw TypeError('Illegal buffer')
      }
    }

    if (capacity === 0) {
      return new ByteBuffer(0, littleEndian)
    }

    const bb = new ByteBuffer(capacity, littleEndian)
    const view = new Uint8Array(bb.buffer)
    let offset = 0

    for (let i = 0; i < buffers.length; ++i) {
      let buf = buffers[i]
      if (buf instanceof ByteBuffer) {
        view.set(new Uint8Array(buf.buffer, buf.offset, buf.limit - buf.offset), offset)
        offset += buf.limit - buf.offset
      } else if (buf instanceof Uint8Array) {
        view.set(buf, offset)
        offset += buf.length
      } else if (buf instanceof ArrayBuffer) {
        view.set(new Uint8Array(buf), offset)
        offset += buf.byteLength
      } else {
        // Array
        view.set(buf as number[], offset)
        offset += (buf as number[]).length
      }
    }

    bb.limit = bb.offset = offset
    bb.offset = 0
    return bb
  }

  static wrap(
    buffer: ByteBuffer | ArrayBuffer | Uint8Array | number[],
    littleEndian?: boolean
  ): ByteBuffer {
    if (buffer instanceof ByteBuffer) {
      const bb = buffer.clone()
      bb.markedOffset = -1
      return bb
    }

    let bb: ByteBuffer
    if (buffer instanceof Uint8Array) {
      bb = new ByteBuffer(0, littleEndian)
      if (buffer.length > 0) {
        bb.buffer = buffer.buffer
        bb.offset = buffer.byteOffset
        bb.limit = buffer.byteOffset + buffer.byteLength
        bb.view = new DataView(buffer.buffer)
      }
    } else if (buffer instanceof ArrayBuffer) {
      bb = new ByteBuffer(0, littleEndian)
      if (buffer.byteLength > 0) {
        bb.buffer = buffer
        bb.offset = 0
        bb.limit = buffer.byteLength
        bb.view = buffer.byteLength > 0 ? new DataView(buffer) : new DataView(EMPTY_BUFFER)
      }
    } else if (Array.isArray(buffer)) {
      bb = new ByteBuffer(buffer.length, littleEndian)
      bb.limit = buffer.length
      new Uint8Array(bb.buffer).set(buffer)
    } else {
      throw TypeError('Illegal buffer')
    }

    return bb
  }

  writeBytes(
    source: ByteBuffer | ArrayBuffer | Uint8Array | number[],
    offset?: number
  ): ByteBuffer {
    return this.append(source, offset)
  }

  writeInt8(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    if (offset + 1 > this.buffer.byteLength) {
      this.resize(offset + 1)
    }

    this.view.setInt8(offset, value)

    if (relative) this.offset += 1
    return this
  }

  writeByte(value: number, offset?: number): ByteBuffer {
    return this.writeInt8(value, offset)
  }

  writeUint8(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    if (offset + 1 > this.buffer.byteLength) {
      this.resize(offset + 1)
    }

    this.view.setUint8(offset, value)

    if (relative) this.offset += 1
    return this
  }

  writeUInt8(value: number, offset?: number): ByteBuffer {
    return this.writeUint8(value, offset)
  }

  readUint8(offset?: number): number {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    const value = this.view.getUint8(offset)
    if (relative) this.offset += 1
    return value
  }

  readUInt8(offset?: number): number {
    return this.readUint8(offset)
  }

  writeInt16(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    if (offset + 2 > this.buffer.byteLength) {
      this.resize(offset + 2)
    }

    this.view.setInt16(offset, value, this.littleEndian)

    if (relative) this.offset += 2
    return this
  }

  writeShort(value: number, offset?: number): ByteBuffer {
    return this.writeInt16(value, offset)
  }

  writeUint16(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    if (offset + 2 > this.buffer.byteLength) {
      this.resize(offset + 2)
    }

    this.view.setUint16(offset, value, this.littleEndian)

    if (relative) this.offset += 2
    return this
  }

  writeUInt16(value: number, offset?: number): ByteBuffer {
    return this.writeUint16(value, offset)
  }

  writeInt32(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    if (offset + 4 > this.buffer.byteLength) {
      this.resize(offset + 4)
    }

    this.view.setInt32(offset, value, this.littleEndian)

    if (relative) this.offset += 4
    return this
  }

  writeInt(value: number, offset?: number): ByteBuffer {
    return this.writeInt32(value, offset)
  }

  writeUint32(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    if (offset + 4 > this.buffer.byteLength) {
      this.resize(offset + 4)
    }

    this.view.setUint32(offset, value, this.littleEndian)

    if (relative) this.offset += 4
    return this
  }

  writeUInt32(value: number, offset?: number): ByteBuffer {
    return this.writeUint32(value, offset)
  }

  readUint32(offset?: number): number {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    const value = this.view.getUint32(offset, this.littleEndian)
    if (relative) {
      this.offset += 4
    }
    return value
  }

  readUInt32 = this.readUint32

  append(source: ByteBuffer | ArrayBuffer | Uint8Array | number[], offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    let src: Uint8Array
    if (source instanceof ByteBuffer) {
      src = new Uint8Array(source.buffer, source.offset, source.limit - source.offset)
      source.offset += src.length
    } else if (source instanceof Uint8Array) {
      src = source
    } else if (source instanceof ArrayBuffer) {
      src = new Uint8Array(source)
    } else {
      src = new Uint8Array(source)
    }

    if (src.length <= 0) return this

    if (offset + src.length > this.buffer.byteLength) {
      this.resize(offset + src.length)
    }

    new Uint8Array(this.buffer).set(src, offset)

    if (relative) this.offset += src.length
    return this
  }

  clone(copy?: boolean): ByteBuffer {
    const bb = new ByteBuffer(0, this.littleEndian)
    if (copy) {
      bb.buffer = new ArrayBuffer(this.buffer.byteLength)
      new Uint8Array(bb.buffer).set(new Uint8Array(this.buffer))
      bb.view = new DataView(bb.buffer)
    } else {
      bb.buffer = this.buffer
      bb.view = this.view
    }
    bb.offset = this.offset
    bb.markedOffset = this.markedOffset
    bb.limit = this.limit
    return bb
  }

  copy(begin?: number, end?: number): ByteBuffer {
    if (begin === undefined) begin = this.offset
    if (end === undefined) end = this.limit

    if (begin === end) {
      return new ByteBuffer(0, this.littleEndian)
    }

    const capacity = end - begin
    const bb = new ByteBuffer(capacity, this.littleEndian)
    bb.offset = 0
    bb.limit = capacity

    new Uint8Array(bb.buffer).set(new Uint8Array(this.buffer).subarray(begin, end), 0)
    return bb
  }

  copyTo(
    target: ByteBuffer,
    targetOffset?: number,
    sourceOffset?: number,
    sourceLimit?: number
  ): ByteBuffer {
    const targetRelative = typeof targetOffset === 'undefined'
    const relative = typeof sourceOffset === 'undefined'
    targetOffset = targetRelative ? target.offset : targetOffset!
    sourceOffset = relative ? this.offset : sourceOffset!
    sourceLimit = sourceLimit === undefined ? this.limit : sourceLimit

    const len = sourceLimit - sourceOffset
    if (len === 0) return target

    target.ensureCapacity(targetOffset + len)
    new Uint8Array(target.buffer).set(
      new Uint8Array(this.buffer).subarray(sourceOffset, sourceLimit),
      targetOffset
    )

    if (relative) this.offset += len
    if (targetRelative) target.offset += len
    return this
  }

  ensureCapacity(capacity: number): ByteBuffer {
    let current = this.buffer.byteLength
    if (current < capacity) {
      return this.resize((current *= 2) > capacity ? current : capacity)
    }
    return this
  }

  flip(): ByteBuffer {
    this.limit = this.offset
    this.offset = 0
    return this
  }

  resize(capacity: number): ByteBuffer {
    if (this.buffer.byteLength < capacity) {
      const buffer = new ArrayBuffer(capacity)
      new Uint8Array(buffer).set(new Uint8Array(this.buffer))
      this.buffer = buffer
      this.view = new DataView(buffer)
    }
    return this
  }

  skip(length: number): ByteBuffer {
    this.offset += length
    return this
  }

  writeInt64(value: number | bigint, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    if (typeof value === 'number') value = BigInt(value)

    if (offset + 8 > this.buffer.byteLength) {
      this.resize(offset + 8)
    }

    this.view.setBigInt64(offset, value, this.littleEndian)

    if (relative) this.offset += 8
    return this
  }

  writeLong(value: number | bigint, offset?: number): ByteBuffer {
    return this.writeInt64(value, offset)
  }

  readInt64(offset?: number): bigint {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    const value = this.view.getBigInt64(offset, this.littleEndian)
    if (relative) this.offset += 8
    return value
  }

  readLong(offset?: number): bigint {
    return this.readInt64(offset)
  }

  writeUint64(value: number | bigint, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    if (typeof value === 'number') value = BigInt(value)

    if (offset + 8 > this.buffer.byteLength) {
      this.resize(offset + 8)
    }

    this.view.setBigUint64(offset, value, this.littleEndian)

    if (relative) this.offset += 8
    return this
  }

  writeUInt64(value: number | bigint, offset?: number): ByteBuffer {
    return this.writeUint64(value, offset)
  }

  readUint64(offset?: number): bigint {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    const value = this.view.getBigUint64(offset, this.littleEndian)
    if (relative) this.offset += 8
    return value
  }

  readUInt64(offset?: number): bigint {
    return this.readUint64(offset)
  }

  toBuffer(forceCopy?: boolean): ArrayBufferLike {
    const offset = this.offset
    const limit = this.limit
    if (!forceCopy && offset === 0 && limit === this.buffer.byteLength) {
      return this.buffer
    }
    if (offset === limit) return EMPTY_BUFFER
    return this.buffer.slice(offset, limit)
  }

  toArrayBuffer(forceCopy?: boolean): ArrayBufferLike {
    return this.toBuffer(forceCopy)
  }

  writeVarint32(value: number, offset?: number): ByteBuffer | number {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    const size = this.calculateVarint32(value)
    if (offset + size > this.buffer.byteLength) {
      this.resize(offset + size)
    }

    value >>>= 0
    while (value >= 0x80) {
      this.view.setUint8(offset++, (value & 0x7f) | 0x80)
      value >>>= 7
    }
    this.view.setUint8(offset++, value)

    if (relative) {
      this.offset = offset
      return this
    }
    return size
  }

  readVarint32(offset?: number): number | { value: number; length: number } {
    const relative = typeof offset === 'undefined'
    if (typeof offset === 'undefined') {
      offset = this.offset
    }
    let c = 0
    let value = 0 >>> 0
    let b: number
    do {
      b = this.view.getUint8(offset++)
      if (c < 5) {
        value |= (b & 0x7f) << (7 * c)
      }
      ++c
    } while ((b & 0x80) !== 0)
    value |= 0

    if (relative) {
      this.offset = offset
      return value
    }
    return { value, length: c }
  }

  calculateVarint32(value: number): number {
    value = value >>> 0
    if (value < 1 << 7) return 1
    else if (value < 1 << 14) return 2
    else if (value < 1 << 21) return 3
    else if (value < 1 << 28) return 4
    else return 5
  }

  writeVString(str: string, offset?: number): ByteBuffer | number {
    const relative = typeof offset === 'undefined'
    let currentOffset = relative ? this.offset : offset!

    const encoded = textEncoder.encode(str)
    const len = encoded.length
    const lenVarintSize = this.calculateVarint32(len)

    if (currentOffset + lenVarintSize + len > this.buffer.byteLength) {
      this.resize(currentOffset + lenVarintSize + len)
    }

    this.writeVarint32(len, currentOffset)
    currentOffset += lenVarintSize

    new Uint8Array(this.buffer).set(encoded, currentOffset)
    currentOffset += len

    if (relative) {
      this.offset = currentOffset
      return this
    }
    return currentOffset - (offset || 0)
  }

  readVString(offset?: number): string | { string: string; length: number } {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    const start = offset
    const lenResult = this.readVarint32(offset) as { value: number; length: number }
    const lenValue = lenResult.value
    const lenLength = lenResult.length

    offset += lenLength

    // TextDecoder can take Uint8Array view directly
    const str = textDecoder.decode(new Uint8Array(this.buffer, offset, lenValue))
    offset += lenValue

    if (relative) {
      this.offset = offset
      return str
    } else {
      return {
        string: str,
        length: offset - start
      }
    }
  }

  readUTF8String(length: number, offset?: number): string | { string: string; length: number } {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    else offset = offset!

    // const strBuffer = this.buffer.slice(offset, end)
    // Faster to view if Shared? No, Decoder takes buffer or view.
    // Making a view is cheap.
    // But DataView vs Uint8Array. TextDecoder takes BufferSource (ArrayBuffer or ArrayBufferView).
    const str = textDecoder.decode(new Uint8Array(this.buffer, offset, length))

    if (relative) {
      this.offset += length
      return str
    } else {
      return {
        string: str,
        length
      }
    }
  }
}
