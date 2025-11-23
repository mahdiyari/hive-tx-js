/**
 * @license bytebuffer.ts (c) 2015 Daniel Wirtz <dcode@dcode.io>
 * Backing buffer: ArrayBuffer, Accessor: DataView
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/bytebuffer.ts for details
 * modified by @xmcl/bytebuffer
 * And customized for hive-tx
 */

const EMPTY_BUFFER = new ArrayBuffer(0)

export class ByteBuffer {
  /**
   * ByteBuffer version.
   */
  // static VERSION = '0.0.1'

  /**
   * Little endian constant that can be used instead of its boolean value. Evaluates to `true`.
   */
  static LITTLE_ENDIAN = true

  /**
   * Big endian constant that can be used instead of its boolean value. Evaluates to `false`.
   */
  static BIG_ENDIAN = false

  /**
   * Default initial capacity of `16`.
   */
  static DEFAULT_CAPACITY = 16

  /**
   * Default endianess of `false` for big endian.
   */
  static DEFAULT_ENDIAN = ByteBuffer.BIG_ENDIAN

  /**
   * Default no assertions flag of `false`.
   */
  static DEFAULT_NOASSERT = false

  /**
   * Metrics representing number of bytes. Evaluates to `b`.
   */
  static METRICS_BYTES = 'b'

  /**
   * Metrics representing number of characters. Evaluates to `c`.
   */
  static METRICS_CHARS = 'c'

  /**
   * Backing ArrayBuffer.
   */
  buffer: ArrayBufferLike

  /**
   * DataView utilized to manipulate the backing buffer. Becomes `null` if the backing buffer has a capacity of `0`.
   */
  view: DataView

  /**
   * Absolute read/write offset.
   * @see ByteBuffer#flip
   * @see ByteBuffer#clear
   */
  offset: number

  /**
   * Marked offset.
   * @see ByteBuffer#mark
   * @see ByteBuffer#reset
   */
  markedOffset: number

  /**
   * Absolute limit of the contained data. Set to the backing buffer's capacity upon allocation.
   * @see ByteBuffer#flip
   * @see ByteBuffer#clear
   */
  limit: number

  /**
   * Whether to use little endian byte order, defaults to `false` for big endian.
   */
  littleEndian: boolean

  /**
   * Whether to skip assertions of offsets and values, defaults to `false`.
   */
  noAssert: boolean

  /**
   * Constructs a new ByteBuffer.
   */
  constructor(
    capacity: number = ByteBuffer.DEFAULT_CAPACITY,
    littleEndian: boolean = ByteBuffer.DEFAULT_ENDIAN,
    noAssert: boolean = ByteBuffer.DEFAULT_NOASSERT
  ) {
    if (!noAssert) {
      capacity = capacity | 0

      if (capacity < 0) {
        throw RangeError('Illegal capacity')
      }
      littleEndian = !!littleEndian
      noAssert = !!noAssert
    }

    this.buffer = capacity === 0 ? EMPTY_BUFFER : new ArrayBuffer(capacity)
    this.view = capacity === 0 ? new DataView(EMPTY_BUFFER) : new DataView(this.buffer)
    this.offset = 0
    this.markedOffset = -1
    this.limit = capacity
    this.littleEndian = littleEndian
    this.noAssert = noAssert
  }

  /**
   * Allocates a new ByteBuffer backed by a buffer of the specified capacity.
   */
  static allocate(capacity?: number, littleEndian?: boolean, noAssert?: boolean): ByteBuffer {
    return new ByteBuffer(capacity, littleEndian, noAssert)
  }

  /**
   * Concatenates multiple ByteBuffers into one.
   */
  static concat(
    buffers: Array<ByteBuffer | ArrayBuffer | Uint8Array | number[]>,
    littleEndian?: boolean,
    noAssert?: boolean
  ): ByteBuffer {
    let capacity = 0
    const k = buffers.length

    for (let i = 0; i < k; ++i) {
      const buf = buffers[i]
      if (!(buf instanceof ByteBuffer)) {
        buffers[i] = ByteBuffer.wrap(buf)
      }
      const bb = buffers[i] as ByteBuffer
      const length = bb.limit - bb.offset
      if (length > 0) {
        capacity += length
      }
    }

    if (capacity === 0) {
      return new ByteBuffer(0, littleEndian, noAssert)
    }

    const bb = new ByteBuffer(capacity, littleEndian, noAssert)
    const view = new Uint8Array(bb.buffer)
    let i = 0

    while (i < k) {
      const bi = buffers[i++] as ByteBuffer
      const length = bi.limit - bi.offset
      if (length <= 0) {
        continue
      }
      view.set(new Uint8Array(bi.buffer).subarray(bi.offset, bi.limit), bb.offset)
      bb.offset += length
    }

    bb.limit = bb.offset
    bb.offset = 0
    return bb
  }

  /**
   * Wraps a buffer. Sets the allocated ByteBuffer's {@link ByteBuffer#offset} to `0` and its
   * {@link ByteBuffer#limit} to the length of the wrapped data.
   * @param buffer Anything that can be wrapped
   * @param littleEndian Whether to use little or big endian byte order. Defaults to {@link ByteBuffer.DEFAULT_ENDIAN}.
   * @param noAssert Whether to skip assertions of offsets and values. Defaults to {@link ByteBuffer.DEFAULT_NOASSERT}.
   */
  static wrap(
    buffer: ByteBuffer | ArrayBuffer | Uint8Array | number[],
    littleEndian?: boolean,
    noAssert?: boolean
  ): ByteBuffer {
    if (buffer === null || typeof buffer !== 'object') {
      throw TypeError('Illegal buffer')
    }

    let bb: ByteBuffer

    if (buffer instanceof ByteBuffer) {
      bb = buffer.clone()
      bb.markedOffset = -1
      return bb
    }

    if (buffer instanceof Uint8Array) {
      bb = new ByteBuffer(0, littleEndian, noAssert)
      if (buffer.length > 0) {
        bb.buffer = buffer.buffer
        bb.offset = buffer.byteOffset
        bb.limit = buffer.byteOffset + buffer.byteLength
        bb.view = new DataView(buffer.buffer)
      }
    } else if (buffer instanceof ArrayBuffer) {
      bb = new ByteBuffer(0, littleEndian, noAssert)
      if (buffer.byteLength > 0) {
        bb.buffer = buffer
        bb.offset = 0
        bb.limit = buffer.byteLength
        bb.view = buffer.byteLength > 0 ? new DataView(buffer) : new DataView(EMPTY_BUFFER)
      }
    } else if (Array.isArray(buffer)) {
      bb = new ByteBuffer(buffer.length, littleEndian, noAssert)
      bb.limit = buffer.length
      for (let i = 0; i < buffer.length; ++i) {
        bb.view.setUint8(i, buffer[i])
      }
    } else {
      throw TypeError('Illegal buffer')
    }

    return bb
  }

  /**
   * Writes a payload of bytes. This is an alias of {@link ByteBuffer#append}.
   */
  writeBytes(
    source: ByteBuffer | ArrayBuffer | Uint8Array | number[],
    offset?: number
  ): ByteBuffer {
    return this.append(source, offset)
  }

  /**
   * Writes an 8bit signed integer.
   */
  writeInt8(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }
      value |= 0
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    offset += 1
    let capacity0 = this.buffer.byteLength
    if (offset > capacity0) {
      this.resize((capacity0 *= 2) > offset ? capacity0 : offset)
    }
    offset -= 1

    this.view.setInt8(offset, value)

    if (relative) {
      this.offset += 1
    }

    return this
  }

  /**
   * Writes an 8bit signed integer. This is an alias of {@link ByteBuffer#writeInt8}.
   */
  writeByte(value: number, offset?: number): ByteBuffer {
    return this.writeInt8(value, offset)
  }

  /**
   * Writes an 8bit unsigned integer.
   */
  writeUint8(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }
      value >>>= 0
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    offset += 1
    let capacity1 = this.buffer.byteLength
    if (offset > capacity1) {
      this.resize((capacity1 *= 2) > offset ? capacity1 : offset)
    }
    offset -= 1

    this.view.setUint8(offset, value)

    if (relative) {
      this.offset += 1
    }

    return this
  }

  /**
   * Writes an 8bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint8}.
   */
  writeUInt8(value: number, offset?: number): ByteBuffer {
    return this.writeUint8(value, offset)
  }

  /**
   * Reads an 8bit unsigned integer.
   */
  readUint8(offset?: number): number {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 1 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+1) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    const value = this.view.getUint8(offset)

    if (relative) {
      this.offset += 1
    }

    return value
  }

  /**
   * Reads an 8bit unsigned integer. This is an alias of {@link ByteBuffer#readUint8}.
   */
  readUInt8(offset?: number): number {
    return this.readUint8(offset)
  }

  /**
   * Writes a 16bit signed integer.
   */
  writeInt16(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }
      value |= 0
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    offset += 2
    let capacity2 = this.buffer.byteLength
    if (offset > capacity2) {
      this.resize((capacity2 *= 2) > offset ? capacity2 : offset)
    }
    offset -= 2

    this.view.setInt16(offset, value, this.littleEndian)

    if (relative) {
      this.offset += 2
    }

    return this
  }

  /**
   * Writes a 16bit signed integer. This is an alias of {@link ByteBuffer#writeInt16}.
   */
  writeShort(value: number, offset?: number): ByteBuffer {
    return this.writeInt16(value, offset)
  }

  /**
   * Writes a 16bit unsigned integer.
   */
  writeUint16(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }
      value >>>= 0
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    offset += 2
    let capacity3 = this.buffer.byteLength
    if (offset > capacity3) {
      this.resize((capacity3 *= 2) > offset ? capacity3 : offset)
    }
    offset -= 2

    this.view.setUint16(offset, value, this.littleEndian)

    if (relative) {
      this.offset += 2
    }

    return this
  }

  /**
   * Writes a 16bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint16}.
   */
  writeUInt16(value: number, offset?: number): ByteBuffer {
    return this.writeUint16(value, offset)
  }

  /**
   * Writes a 32bit signed integer.
   */
  writeInt32(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }
      value |= 0
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    offset += 4
    let capacity4 = this.buffer.byteLength
    if (offset > capacity4) {
      this.resize((capacity4 *= 2) > offset ? capacity4 : offset)
    }
    offset -= 4

    this.view.setInt32(offset, value, this.littleEndian)

    if (relative) {
      this.offset += 4
    }

    return this
  }

  /**
   * Writes a 32bit signed integer. This is an alias of {@link ByteBuffer#writeInt32}.
   */
  writeInt(value: number, offset?: number): ByteBuffer {
    return this.writeInt32(value, offset)
  }

  /**
   * Writes a 32bit unsigned integer.
   */
  writeUint32(value: number, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }
      value >>>= 0
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    offset += 4
    let capacity5 = this.buffer.byteLength
    if (offset > capacity5) {
      this.resize((capacity5 *= 2) > offset ? capacity5 : offset)
    }
    offset -= 4

    this.view.setUint32(offset, value, this.littleEndian)

    if (relative) {
      this.offset += 4
    }

    return this
  }

  /**
   * Writes a 32bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint32}.
   */
  writeUInt32(value: number, offset?: number): ByteBuffer {
    return this.writeUint32(value, offset)
  }

  /**
   * Appends some data to this ByteBuffer.
   */
  append(source: ByteBuffer | ArrayBuffer | Uint8Array | number[], offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    let bbSource: ByteBuffer
    if (!(source instanceof ByteBuffer)) {
      bbSource = ByteBuffer.wrap(source)
    } else {
      bbSource = source
    }

    const length = bbSource.limit - bbSource.offset
    if (length <= 0) {
      return this
    }

    offset += length
    let capacity16 = this.buffer.byteLength
    if (offset > capacity16) {
      this.resize((capacity16 *= 2) > offset ? capacity16 : offset)
    }
    offset -= length

    new Uint8Array(this.buffer, offset).set(
      new Uint8Array(bbSource.buffer).subarray(bbSource.offset, bbSource.limit)
    )

    bbSource.offset += length

    if (relative) {
      this.offset += length
    }

    return this
  }

  /**
   * Creates a cloned instance of this ByteBuffer.
   */
  clone(copy?: boolean): ByteBuffer {
    const bb = new ByteBuffer(0, this.littleEndian, this.noAssert)

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

  /**
   * Creates a copy of this ByteBuffer's contents.
   */
  copy(begin?: number, end?: number): ByteBuffer {
    if (typeof begin === 'undefined') {
      begin = this.offset
    }
    if (typeof end === 'undefined') {
      end = this.limit
    }

    if (!this.noAssert) {
      if (typeof begin !== 'number' || begin % 1 !== 0) {
        throw TypeError('Illegal begin: Not an integer')
      }
      begin >>>= 0
      if (typeof end !== 'number' || end % 1 !== 0) {
        throw TypeError('Illegal end: Not an integer')
      }
      end >>>= 0
      if (begin < 0 || begin > end || end > this.buffer.byteLength) {
        throw RangeError(
          'Illegal range: 0 <= ' + begin + ' <= ' + end + ' <= ' + this.buffer.byteLength
        )
      }
    } else {
      begin = begin!
      end = end!
    }

    if (begin === end) {
      return new ByteBuffer(0, this.littleEndian, this.noAssert)
    }

    const capacity = end - begin
    const bb = new ByteBuffer(capacity, this.littleEndian, this.noAssert)
    bb.offset = 0
    bb.limit = capacity

    if (bb.markedOffset >= 0) {
      bb.markedOffset -= begin
    }

    this.copyTo(bb, 0, begin, end)
    return bb
  }

  /**
   * Copies this ByteBuffer's contents to another ByteBuffer.
   */
  copyTo(
    target: ByteBuffer,
    targetOffset?: number,
    sourceOffset?: number,
    sourceLimit?: number
  ): ByteBuffer {
    const targetRelative = typeof targetOffset === 'undefined'
    const relative = typeof sourceOffset === 'undefined'

    if (!this.noAssert) {
      if (!(target instanceof ByteBuffer)) {
        throw TypeError('Illegal target: Not a ByteBuffer')
      }
    }

    targetOffset = targetRelative ? target.offset : targetOffset! | 0
    sourceOffset = relative ? this.offset : sourceOffset! | 0
    sourceLimit = typeof sourceLimit === 'undefined' ? this.limit : sourceLimit | 0

    if (targetOffset < 0 || targetOffset > target.buffer.byteLength) {
      throw RangeError(
        'Illegal target range: 0 <= ' + targetOffset + ' <= ' + target.buffer.byteLength
      )
    }

    if (sourceOffset < 0 || sourceLimit > this.buffer.byteLength) {
      throw RangeError(
        'Illegal source range: 0 <= ' + sourceOffset + ' <= ' + this.buffer.byteLength
      )
    }

    const len = sourceLimit - sourceOffset
    if (len === 0) {
      return target
    }

    target.ensureCapacity(targetOffset + len)

    new Uint8Array(target.buffer).set(
      new Uint8Array(this.buffer).subarray(sourceOffset, sourceLimit),
      targetOffset
    )

    if (relative) {
      this.offset += len
    }
    if (targetRelative) {
      target.offset += len
    }

    return this
  }

  /**
   * Makes sure that this ByteBuffer is backed by a buffer of at least the specified capacity.
   */
  ensureCapacity(capacity: number): ByteBuffer {
    let current = this.buffer.byteLength
    if (current < capacity) {
      return this.resize((current *= 2) > capacity ? current : capacity)
    }
    return this
  }

  /**
   * Makes this ByteBuffer ready for a new sequence of write or relative read operations.
   */
  flip(): ByteBuffer {
    this.limit = this.offset
    this.offset = 0
    return this
  }

  /**
   * Resizes this ByteBuffer to be backed by a buffer of at least the given capacity.
   */
  resize(capacity: number): ByteBuffer {
    if (!this.noAssert) {
      if (typeof capacity !== 'number' || capacity % 1 !== 0) {
        throw TypeError('Illegal capacity: ' + capacity + ' (not an integer)')
      }
      capacity |= 0
      if (capacity < 0) {
        throw RangeError('Illegal capacity: 0 <= ' + capacity)
      }
    }

    if (this.buffer.byteLength < capacity) {
      const buffer = new ArrayBuffer(capacity)
      new Uint8Array(buffer).set(new Uint8Array(this.buffer))
      this.buffer = buffer
      this.view = new DataView(buffer)
    }

    return this
  }

  /**
   * Skips the next `length` bytes.
   */
  skip(length: number): ByteBuffer {
    if (!this.noAssert) {
      if (typeof length !== 'number' || length % 1 !== 0) {
        throw TypeError('Illegal length: ' + length + ' (not an integer)')
      }
      length |= 0
    }

    const offset = this.offset + length
    if (!this.noAssert) {
      if (offset < 0 || offset > this.buffer.byteLength) {
        throw RangeError(
          'Illegal length: 0 <= ' + this.offset + ' + ' + length + ' <= ' + this.buffer.byteLength
        )
      }
    }

    this.offset = offset
    return this
  }

  /**
   * Writes a 64bit signed integer.
   */
  writeInt64(value: number | bigint, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (typeof offset === 'undefined') {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value === 'number') {
        value = BigInt(value)
      }
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    } else {
      if (typeof value === 'number') {
        value = BigInt(value)
      }
      offset = offset!
    }

    offset += 8
    let capacity6 = this.buffer.byteLength
    if (offset > capacity6) {
      this.resize((capacity6 *= 2) > offset ? capacity6 : offset)
    }
    offset -= 8

    this.view.setBigInt64(offset, value, this.littleEndian)

    if (relative) {
      this.offset += 8
    }

    return this
  }

  /**
   * Writes a 64bit signed integer. This is an alias of {@link ByteBuffer#writeInt64}.
   */
  writeLong(value: number | bigint, offset?: number): ByteBuffer {
    return this.writeInt64(value, offset)
  }

  /**
   * Reads a 64bit signed integer.
   */
  readInt64(offset?: number): bigint {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 8 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+8) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    const value = this.view.getBigInt64(offset, this.littleEndian)

    if (relative) {
      this.offset += 8
    }

    return value
  }

  /**
   * Reads a 64bit signed integer. This is an alias of {@link ByteBuffer#readInt64}.
   */
  readLong(offset?: number): bigint {
    return this.readInt64(offset)
  }

  /**
   * Writes a 64bit unsigned integer.
   */
  writeUint64(value: number | bigint, offset?: number): ByteBuffer {
    const relative = typeof offset === 'undefined'
    if (typeof offset === 'undefined') {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value === 'number') {
        value = BigInt(value)
      }
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    } else {
      if (typeof value === 'number') {
        value = BigInt(value)
      }
      offset = offset!
    }

    offset += 8
    let capacity7 = this.buffer.byteLength
    if (offset > capacity7) {
      this.resize((capacity7 *= 2) > offset ? capacity7 : offset)
    }
    offset -= 8

    this.view.setBigUint64(offset, value, this.littleEndian)

    if (relative) {
      this.offset += 8
    }

    return this
  }

  /**
   * Writes a 64bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint64}.
   */
  writeUInt64(value: number | bigint, offset?: number): ByteBuffer {
    return this.writeUint64(value, offset)
  }

  /**
   * Reads a 64bit unsigned integer.
   */
  readUint64(offset?: number): bigint {
    const relative = typeof offset === 'undefined'
    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 8 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+8) <= ' + this.buffer.byteLength)
      }
    } else {
      offset = offset!
    }

    const value = this.view.getBigUint64(offset, this.littleEndian)

    if (relative) {
      this.offset += 8
    }

    return value
  }

  /**
   * Reads a 64bit unsigned integer. This is an alias of {@link ByteBuffer#readUint64}.
   */
  readUInt64(offset?: number): bigint {
    return this.readUint64(offset)
  }

  /**
   * Returns a copy of the backing buffer that contains this ByteBuffer's contents.
   */
  toBuffer(forceCopy?: boolean): ArrayBufferLike {
    let offset = this.offset
    let limit = this.limit

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: Not an integer')
      }
      offset >>>= 0
      if (typeof limit !== 'number' || limit % 1 !== 0) {
        throw TypeError('Illegal limit: Not an integer')
      }
      limit >>>= 0
      if (offset < 0 || offset > limit || limit > this.buffer.byteLength) {
        throw RangeError(
          'Illegal range: 0 <= ' + offset + ' <= ' + limit + ' <= ' + this.buffer.byteLength
        )
      }
    }

    if (!forceCopy) {
      if (offset === 0 && limit === this.buffer.byteLength) {
        return this.buffer
      }
      return this.buffer.slice(offset, limit)
    }

    if (offset === limit) {
      return EMPTY_BUFFER
    }

    const buffer = new ArrayBuffer(limit - offset)
    new Uint8Array(buffer).set(new Uint8Array(this.buffer).subarray(offset, limit), 0)
    return buffer
  }

  /**
   * Returns a raw buffer compacted to contain this ByteBuffer's contents. This is an alias of {@link ByteBuffer#toBuffer}.
   */
  toArrayBuffer(forceCopy?: boolean): ArrayBufferLike {
    return this.toBuffer(forceCopy)
  }

  writeVarint32(value: number, offset?: number): ByteBuffer | number {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }
      value |= 0
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + offset + ' (+' + 0 + ') <= ' + this.buffer.byteLength
        )
      }
    } else {
      offset = offset!
    }

    const size = this.calculateVarint32(value)
    let b: number
    offset += size
    let capacity10 = this.buffer.byteLength
    if (offset > capacity10) {
      this.resize((capacity10 *= 2) > offset ? capacity10 : offset)
    }
    offset -= size
    value >>>= 0
    while (value >= 0x80) {
      b = (value & 0x7f) | 0x80
      this.view.setUint8(offset++, b)
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
    if (relative) offset = this.offset

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 1 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + offset + ' (+' + 1 + ') <= ' + this.buffer.byteLength
        )
      }
    } else {
      offset = offset!
    }

    let c = 0
    let value = 0 >>> 0
    let b: number
    do {
      if (!this.noAssert && offset > this.limit) {
        const err = Error('Truncated')
        ;(err as any).truncated = true
        throw err
      }
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
    return {
      value,
      length: c
    }
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

    if (!this.noAssert) {
      if (typeof str !== 'string') {
        throw TypeError('Illegal str: Not a string')
      }
      if (typeof currentOffset !== 'number' || currentOffset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + currentOffset + ' (not an integer)')
      }
      currentOffset >>>= 0
      if (currentOffset < 0 || currentOffset + 0 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + currentOffset + ' (+' + 0 + ') <= ' + this.buffer.byteLength
        )
      }
    }

    const start = currentOffset
    const k = calculateUTF16asUTF8(stringSource(str), this.noAssert)[1]
    const l = this.calculateVarint32(k)
    currentOffset += l + k

    let capacity15 = this.buffer.byteLength
    if (currentOffset > capacity15) {
      this.resize((capacity15 *= 2) > currentOffset ? capacity15 : currentOffset)
    }
    currentOffset -= l + k
    currentOffset += this.writeVarint32(k, currentOffset) as number

    encodeUTF16toUTF8(stringSource(str), (b: number) => {
      this.view.setUint8(currentOffset++, b)
    })

    if (currentOffset !== start + k + l) {
      throw RangeError(
        'Illegal range: Truncated data, ' + currentOffset + ' == ' + (currentOffset + k + l)
      )
    }

    if (relative) {
      this.offset = currentOffset
      return this
    }
    return currentOffset - start
  }

  readVString(offset?: number): string | { string: string; length: number } {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 1 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + offset + ' (+' + 1 + ') <= ' + this.buffer.byteLength
        )
      }
    } else {
      offset = offset!
    }

    const start = offset
    const len = this.readVarint32(offset) as { value: number; length: number } // It returns object if relative is false, but here recursive call might use relative?
    // Wait. readVarint32(offset) called with offset returns object {value, length}.

    const str = this.readUTF8String(
      len.value,
      ByteBuffer.METRICS_BYTES,
      (offset += len.length)
    ) as { string: string; length: number }
    offset += str.length

    if (relative) {
      this.offset = offset
      return str.string
    } else {
      return {
        string: str.string,
        length: offset - start
      }
    }
  }

  readUTF8String(
    length: number,
    metrics?: string,
    offset?: number
  ): string | { string: string; length: number } {
    if (typeof metrics === 'number') {
      offset = metrics
      metrics = undefined
    }
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    if (typeof metrics === 'undefined') metrics = ByteBuffer.METRICS_CHARS

    if (!this.noAssert) {
      if (typeof length !== 'number' || length % 1 !== 0) {
        throw TypeError('Illegal length: ' + length + ' (not an integer)')
      }
      length |= 0
      if (typeof offset !== 'number' || offset! % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset = offset! >>> 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + offset + ' (+' + 0 + ') <= ' + this.buffer.byteLength
        )
      }
    } else {
      offset = offset!
    }

    let i = 0
    const start = offset
    let sd: StringDestination

    if (metrics === ByteBuffer.METRICS_CHARS) {
      sd = stringDestination()
      decodeUTF8(
        () => {
          return i < length && offset! < this.limit ? this.view.getUint8(offset!++) : null
        },
        (cp) => {
          ++i
          UTF8toUTF16(cp, sd) // stringDestination returns a function that acts as callback
        }
      )
      if (i !== length) {
        throw RangeError('Illegal range: Truncated data, ' + i + ' == ' + length)
      }
      if (relative) {
        this.offset = offset
        return sd()
      } else {
        return {
          string: sd(),
          length: offset - start
        }
      }
    } else if (metrics === ByteBuffer.METRICS_BYTES) {
      if (!this.noAssert) {
        if (typeof offset !== 'number' || offset % 1 !== 0) {
          throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
        }
        offset >>>= 0
        if (offset < 0 || offset + length > this.buffer.byteLength) {
          throw RangeError(
            'Illegal offset: 0 <= ' + offset + ' (+' + length + ') <= ' + this.buffer.byteLength
          )
        }
      }
      const k = offset + length
      sd = stringDestination()

      decodeUTF8toUTF16(() => {
        return offset! < k ? this.view.getUint8(offset!++) : null
      }, sd)

      if (offset !== k) {
        throw RangeError('Illegal range: Truncated data, ' + offset + ' == ' + k)
      }
      if (relative) {
        this.offset = offset
        return sd()
      } else {
        return {
          string: sd(),
          length: offset - start
        }
      }
    } else {
      throw TypeError('Unsupported metrics: ' + metrics)
    }
  }
}

// ---------------- Helper functions ----------------

interface StringDestination {
  (): string
  (cp: number): void
}

function stringDestination(): StringDestination {
  const cs: any[] = []
  const ps: string[] = []
  const fn = function () {
    if (arguments.length === 0) {
      return ps.join('') + String.fromCharCode.apply(String, cs)
    }
    if (cs.length + arguments.length > 1024) {
      ps.push(String.fromCharCode.apply(String, cs as number[]))
      cs.length = 0
    }
    Array.prototype.push.apply(cs, arguments as any)
  }
  return fn as any as StringDestination
}

function stringSource(s: string) {
  let i = 0
  return function () {
    return i < s.length ? s.charCodeAt(i++) : null
  }
}

// utfx functions converted to standalone functions

function encodeUTF8(src: number | (() => number | null), dst: (b: number) => void): void {
  let cp: number | null = null
  let srcFunc: () => number | null

  if (typeof src === 'number') {
    cp = src
    srcFunc = function () {
      return null
    }
  } else {
    srcFunc = src
  }

  while (cp !== null || (cp = srcFunc()) !== null) {
    if (cp < 0x80) {
      dst(cp & 0x7f)
    } else if (cp < 0x800) {
      dst(((cp >> 6) & 0x1f) | 0xc0)
      dst((cp & 0x3f) | 0x80)
    } else if (cp < 0x10000) {
      dst(((cp >> 12) & 0x0f) | 0xe0)
      dst(((cp >> 6) & 0x3f) | 0x80)
      dst((cp & 0x3f) | 0x80)
    } else {
      dst(((cp >> 18) & 0x07) | 0xf0)
      dst(((cp >> 12) & 0x3f) | 0x80)
      dst(((cp >> 6) & 0x3f) | 0x80)
      dst((cp & 0x3f) | 0x80)
    }
    cp = null
  }
}

function decodeUTF8(src: () => number | null, dst: (cp: number) => void): void {
  let a: number | null
  let b: number | null
  let c: number | null
  let d: number | null

  const fail = function (b: Array<number | null>) {
    const bSlice = b.slice(0, b.indexOf(null))
    const err = Error(bSlice.toString())
    err.name = 'TruncatedError'
    ;(err as any).bytes = bSlice
    throw err
  }

  while ((a = src()) !== null) {
    if ((a & 0x80) === 0) {
      dst(a)
    } else if ((a & 0xe0) === 0xc0) {
      b = src()
      if (b === null) fail([a, b])
      dst(((a & 0x1f) << 6) | (b! & 0x3f))
    } else if ((a & 0xf0) === 0xe0) {
      b = src()
      c = src()
      if (b === null || c === null) fail([a, b, c])
      dst(((a & 0x0f) << 12) | ((b! & 0x3f) << 6) | (c! & 0x3f))
    } else if ((a & 0xf8) === 0xf0) {
      b = src()
      c = src()
      d = src()
      if (b === null || c === null || d === null) fail([a, b, c, d])
      dst(((a & 0x07) << 18) | ((b! & 0x3f) << 12) | ((c! & 0x3f) << 6) | (d! & 0x3f))
    } else {
      throw RangeError('Illegal starting byte: ' + a)
    }
  }
}

function UTF16toUTF8(
  src: (() => number | null) | number, // can be a function or a code point (number)
  dst: (cp: number) => void
): void {
  // If src is a number, wrap it. This matches usage in encodeUTF16toUTF8 below?
  // Actually the original code seemed to treat src as function in UTF16toUTF8 implementation proper.
  // But wait, check original:
  /**
   * Converts UTF16 characters to UTF8 code points.
   * @param {!function():number|null} src Characters source...
   */
  // It only takes function?
  // But wait, `encodeUTF8` takes (src, dst) where src can be number.
  // `UTF8toUTF16` takes (src, dst) where src can be number.

  // `UTF16toUTF8` implementation:
  /*
  utfx.UTF16toUTF8 = function (src, dst) {
    let c1
    let c2 = null
    while (true) {
      if ((c1 = c2 !== null ? c2 : src()) === null) {
        break
      }
      //...
    }
    //...
  }
  */
  // So `src` MUST be a function here.

  // However, I see I used `src: (() => number | null) | number` in signature.
  // I should check strict usage.

  let c1: number | null
  let c2: number | null = null
  const srcFunc: () => number | null = src as any // assume function

  while (true) {
    if ((c1 = c2 !== null ? c2 : srcFunc()) === null) {
      break
    }
    if (c1 >= 0xd800 && c1 <= 0xdfff) {
      if ((c2 = srcFunc()) !== null) {
        if (c2 >= 0xdc00 && c2 <= 0xdfff) {
          dst((c1 - 0xd800) * 0x400 + c2 - 0xdc00 + 0x10000)
          c2 = null
          continue
        }
      }
    }
    dst(c1)
  }
  if (c2 !== null) dst(c2)
}

function UTF8toUTF16(src: number | (() => number | null), dst: (cp: number) => void): void {
  let cp: number | null = null
  let srcFunc: () => number | null

  if (typeof src === 'number') {
    cp = src
    srcFunc = function () {
      return null
    }
  } else {
    srcFunc = src
  }

  while (cp !== null || (cp = srcFunc()) !== null) {
    if (cp <= 0xffff) {
      dst(cp)
    } else {
      cp -= 0x10000
      dst((cp >> 10) + 0xd800)
      dst((cp % 0x400) + 0xdc00)
    }
    cp = null
  }
}

function encodeUTF16toUTF8(src: () => number | null, dst: (b: number) => void): void {
  UTF16toUTF8(src, function (cp) {
    encodeUTF8(cp, dst)
  })
}

function decodeUTF8toUTF16(src: () => number | null, dst: (cp: number) => void): void {
  decodeUTF8(src, function (cp) {
    UTF8toUTF16(cp, dst)
  })
}

function calculateUTF16asUTF8(src: () => number | null, noAssert?: boolean): [number, number] {
  let n = 0
  let l = 0
  UTF16toUTF8(src, function (cp) {
    ++n
    l += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4
  })
  return [n, l]
}
