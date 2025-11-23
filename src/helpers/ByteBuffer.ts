// @ts-nocheck
/**

 * @license bytebuffer.ts (c) 2015 Daniel Wirtz <dcode@dcode.io>

 * Backing buffer: ArrayBuffer, Accessor: DataView

 * Released under the Apache License, Version 2.0

 * see: https://github.com/dcodeIO/bytebuffer.ts for details

 * modified by @xmcl/bytebuffer

 * And customized for hive-tx

 */

export class ByteBuffer {
  /**

   * ByteBuffer version.

   * @type {string}

   * @const

   * @expose

   */

  // static VERSION = '0.0.1'

  /**

   * Little endian constant that can be used instead of its boolean value. Evaluates to `true`.

   * @type {boolean}

   * @const

   * @expose

   */

  static LITTLE_ENDIAN = true

  /**

     * Big endian constant that can be used instead of its boolean value. Evaluates to `false`.

     * @type {boolean}

     * @const

     * @expose

     */

  static BIG_ENDIAN = false

  /**

     * Default initial capacity of `16`.

     * @type {number}

     * @expose

     */

  static DEFAULT_CAPACITY = 16

  /**

     * Default endianess of `false` for big endian.

     * @type {boolean}

     * @expose

     */

  static DEFAULT_ENDIAN = ByteBuffer.BIG_ENDIAN

  /**

     * Default no assertions flag of `false`.

     * @type {boolean}

     * @expose

     */

  static DEFAULT_NOASSERT = false

  /**

     * Backing ArrayBuffer.

     * @type {!ArrayBuffer}

     * @expose

     */

  /**
   * Metrics representing number of bytes. Evaluates to `b`.
   * @type {string}
   * @const
   * @expose
   */
  static METRICS_BYTES = 'b'

  buffer

  /**

     * DataView utilized to manipulate the backing buffer. Becomes `null` if the backing buffer has a capacity of `0`.

     * @type {?DataView}

     * @expose

     */

  view

  /**

     * Absolute read/write offset.

     * @type {number}

     * @expose

     * @see ByteBuffer#flip

     * @see ByteBuffer#clear

     */

  offset

  /**

     * Marked offset.

     * @type {number}

     * @expose

     * @see ByteBuffer#mark

     * @see ByteBuffer#reset

     */

  markedOffset

  /**

     * Absolute limit of the contained data. Set to the backing buffer's capacity upon allocation.

     * @type {number}

     * @expose

     * @see ByteBuffer#flip

     * @see ByteBuffer#clear

     */

  limit

  /**

     * Whether to use little endian byte order, defaults to `false` for big endian.

     * @type {boolean}

     * @expose

     */

  littleEndian

  /**

     * Whether to skip assertions of offsets and values, defaults to `false`.

     * @type {boolean}

     * @expose

     */

  noAssert

  /**

     * Constructs a new ByteBuffer.

     * @class The swiss army knife for binary data in JavaScript.

     * @exports ByteBuffer

     * @constructor

     * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.

     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to

     *  {@link ByteBuffer.DEFAULT_ENDIAN}.

     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to

     *  {@link ByteBuffer.DEFAULT_NOASSERT}.

     * @expose

     */

  constructor(capacity, littleEndian, noAssert = true) {
    if (typeof capacity === 'undefined') {
      capacity = ByteBuffer.DEFAULT_CAPACITY
    }

    if (typeof littleEndian === 'undefined') {
      littleEndian = ByteBuffer.DEFAULT_ENDIAN
    }

    if (typeof noAssert === 'undefined') {
      noAssert = ByteBuffer.DEFAULT_NOASSERT
    }

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

     * Gets the accessor type.

     * @returns {Function} `Buffer` under node.ts, `Uint8Array` respectively `DataView` in the browser (classes)

     * @expose

     */

  // static accessor = function () {
  //   return DataView
  // }

  /**

     * Allocates a new ByteBuffer backed by a buffer of the specified capacity.

     * @param {number=} capacity Initial capacity. Defaults to {@link ByteBuffer.DEFAULT_CAPACITY}.

     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to

     *  {@link ByteBuffer.DEFAULT_ENDIAN}.

     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to

     *  {@link ByteBuffer.DEFAULT_NOASSERT}.

     * @returns {!ByteBuffer}

     * @expose

     */

  static allocate = function (capacity, littleEndian, noAssert) {
    return new ByteBuffer(capacity, littleEndian, noAssert)
  }

  /**

     * Concatenates multiple ByteBuffers into one.

     * @param {!Array.<!ByteBuffer|!ArrayBuffer|!Uint8Array>} buffers Buffers to concatenate

     * @param {(string|boolean)=} encoding String encoding if `buffers` contains a string ("base64", "hex", "binary",

     *  defaults to "utf8")

     * @param {boolean=} littleEndian Whether to use little or big endian byte order for the resulting ByteBuffer. Defaults

     *  to {@link ByteBuffer.DEFAULT_ENDIAN}.

     * @param {boolean=} noAssert Whether to skip assertions of offsets and values for the resulting ByteBuffer. Defaults to

     *  {@link ByteBuffer.DEFAULT_NOASSERT}.

     * @returns {!ByteBuffer} Concatenated ByteBuffer

     * @expose

     */

  static concat = function (buffers, littleEndian, noAssert) {
    let capacity = 0

    const k = buffers.length

    let length

    for (let i2 = 0, length2; i2 < k; ++i2) {
      const buf = buffers[i2]

      if (!(buf instanceof ByteBuffer)) {
        buffers[i2] = ByteBuffer.wrap(buf)
      }

      length2 = buffers[i2].limit - buffers[i2].offset

      if (length2 > 0) {
        capacity += length2
      }
    }

    if (capacity === 0) {
      return new ByteBuffer(0, littleEndian, noAssert)
    }

    const bb = new ByteBuffer(capacity, littleEndian, noAssert)

    let bi

    const view = new Uint8Array(bb.buffer)

    let i = 0

    while (i < k) {
      bi = buffers[i++]

      length = bi.limit - bi.offset

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

     * Gets the backing buffer type.

     * @returns {Function} `Buffer` under node.ts, `ArrayBuffer` in the browser (classes)

     * @expose

     */

  // static type = function () {
  //   return ArrayBuffer
  // }

  /**

     * Wraps a buffer or a string. Sets the allocated ByteBuffer's {@link ByteBuffer#offset} to `0` and its

     *  {@link ByteBuffer#limit} to the length of the wrapped data.

     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string|!Array.<number>} buffer Anything that can be wrapped

     * @param {boolean=} littleEndian Whether to use little or big endian byte order. Defaults to

     *  {@link ByteBuffer.DEFAULT_ENDIAN}.

     * @param {boolean=} noAssert Whether to skip assertions of offsets and values. Defaults to

     *  {@link ByteBuffer.DEFAULT_NOASSERT}.

     * @returns {!ByteBuffer} A ByteBuffer wrapping `buffer`

     * @expose

     */

  static wrap = function (buffer, littleEndian, noAssert) {
    if (buffer === null || typeof buffer !== 'object') {
      throw TypeError('Illegal buffer')
    }

    let bb

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
    } else if (Object.prototype.toString.call(buffer) === '[object Array]') {
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

     * Reads the specified number of bytes.

     * @param {number} length Number of bytes to read

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.

     * @returns {!ByteBuffer}

     * @expose

     */

  // readBytes(length, offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + length > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal offset: 0 <= ' + offset + ' (+' + length + ') <= ' + this.buffer.byteLength
  //       )
  //     }
  //   }

  //   const slice = this.slice(offset, offset + length)

  //   if (relative) {
  //     this.offset += length
  //   }

  //   return slice
  // }

  /**

     * Writes a payload of bytes. This is an alias of {@link ByteBuffer#append}.

     * @function

     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array|string} source Data to write. If `source` is a ByteBuffer, its offsets

     *  will be modified according to the performed read operation.

     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by the number of bytes

     *  written if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  writeBytes = this.append

  // types/ints/int8

  /**

     * Writes an 8bit signed integer.

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  writeInt8(value, offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }

      value |= 0

      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
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

     * @function

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  writeByte = this.writeInt8

  /**

     * Reads an 8bit signed integer.

     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.

     * @returns {number} Value read

     * @expose

     */

  // readInt8(offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 1 > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal offset: 0 <= ' +
  //           offset +
  //           ' (+1) <= ' +
  //           this.buffer.byteLength
  //       )
  //     }
  //   }

  //   const value = this.view.getInt8(offset)

  //   if (relative) {
  //     this.offset += 1
  //   }

  //   return value
  // }

  /**

     * Reads an 8bit signed integer. This is an alias of {@link ByteBuffer#readInt8}.

     * @function

     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.

     * @returns {number} Value read

     * @expose

     */

  // readByte = this.readInt8

  /**

     * Writes an 8bit unsigned integer.

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  writeUint8(value, offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }

      value >>>= 0

      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
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

     * @function

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  writeUInt8 = this.writeUint8

  /**

     * Reads an 8bit unsigned integer.

     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.

     * @returns {number} Value read

     * @expose

     */

  readUint8(offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 1 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+1) <= ' + this.buffer.byteLength)
      }
    }

    const value = this.view.getUint8(offset)

    if (relative) {
      this.offset += 1
    }

    return value
  }

  /**

     * Reads an 8bit unsigned integer. This is an alias of {@link ByteBuffer#readUint8}.

     * @function

     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.

     * @returns {number} Value read

     * @expose

     */

  readUInt8 = this.readUint8

  // types/ints/int16

  /**

     * Writes a 16bit signed integer.

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.

     * @throws {TypeError} If `offset` or `value` is not a valid number

     * @throws {RangeError} If `offset` is out of bounds

     * @expose

     */

  writeInt16(value, offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }

      value |= 0

      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
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

     * @function

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.

     * @throws {TypeError} If `offset` or `value` is not a valid number

     * @throws {RangeError} If `offset` is out of bounds

     * @expose

     */

  writeShort = this.writeInt16

  /**

     * Reads a 16bit signed integer.

     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.

     * @returns {number} Value read

     * @throws {TypeError} If `offset` is not a valid number

     * @throws {RangeError} If `offset` is out of bounds

     * @expose

     */

  // readInt16(offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (typeof offset === 'undefined') {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 2 > this.buffer.byteLength) {
  //       throw RangeError('Illegal offset: 0 <= ' + offset + ' (+2) <= ' + this.buffer.byteLength)
  //     }
  //   }

  //   const value = this.view.getInt16(offset, this.littleEndian)

  //   if (relative) {
  //     this.offset += 2
  //   }

  //   return value
  // }

  /**

     * Reads a 16bit signed integer. This is an alias of {@link ByteBuffer#readInt16}.

     * @function

     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.

     * @returns {number} Value read

     * @throws {TypeError} If `offset` is not a valid number

     * @throws {RangeError} If `offset` is out of bounds

     * @expose

     */

  // readShort = this.readInt16

  /**

     * Writes a 16bit unsigned integer.

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.

     * @throws {TypeError} If `offset` or `value` is not a valid number

     * @throws {RangeError} If `offset` is out of bounds

     * @expose

     */

  writeUint16(value, offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }

      value >>>= 0

      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
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

     * @function

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.

     * @throws {TypeError} If `offset` or `value` is not a valid number

     * @throws {RangeError} If `offset` is out of bounds

     * @expose

     */

  writeUInt16 = this.writeUint16

  /**

     * Reads a 16bit unsigned integer.

     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.

     * @returns {number} Value read

     * @throws {TypeError} If `offset` is not a valid number

     * @throws {RangeError} If `offset` is out of bounds

     * @expose

     */

  // readUint16(offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 2 > this.buffer.byteLength) {
  //       throw RangeError('Illegal offset: 0 <= ' + offset + ' (+2) <= ' + this.buffer.byteLength)
  //     }
  //   }

  //   const value = this.view.getUint16(offset, this.littleEndian)

  //   if (relative) {
  //     this.offset += 2
  //   }

  //   return value
  // }

  /**

     * Reads a 16bit unsigned integer. This is an alias of {@link ByteBuffer#readUint16}.

     * @function

     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.

     * @returns {number} Value read

     * @throws {TypeError} If `offset` is not a valid number

     * @throws {RangeError} If `offset` is out of bounds

     * @expose

     */

  // readUInt16 = this.readUint16

  // types/ints/int32

  /**

     * Writes a 32bit signed integer.

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @expose

     */

  writeInt32(value, offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }

      value |= 0

      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
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

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @expose

     */

  writeInt = this.writeInt32

  /**

     * Reads a 32bit signed integer.

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @returns {number} Value read

     * @expose

     */

  // readInt32(offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 4 > this.buffer.byteLength) {
  //       throw RangeError('Illegal offset: 0 <= ' + offset + ' (+4) <= ' + this.buffer.byteLength)
  //     }
  //   }

  //   const value = this.view.getInt32(offset, this.littleEndian)

  //   if (relative) {
  //     this.offset += 4
  //   }

  //   return value
  // }

  /**

     * Reads a 32bit signed integer. This is an alias of {@link ByteBuffer#readInt32}.

     * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `4` if omitted.

     * @returns {number} Value read

     * @expose

     */

  // readInt = this.readInt32

  /**

     * Writes a 32bit unsigned integer.

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @expose

     */

  writeUint32(value, offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }

      value >>>= 0

      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
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

     * @function

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @expose

     */

  writeUInt32 = this.writeUint32

  /**

     * Reads a 32bit unsigned integer.

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @returns {number} Value read

     * @expose

     */

  // readUint32(offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 4 > this.buffer.byteLength) {
  //       throw RangeError('Illegal offset: 0 <= ' + offset + ' (+4) <= ' + this.buffer.byteLength)
  //     }
  //   }

  //   const value = this.view.getUint32(offset, this.littleEndian)

  //   if (relative) {
  //     this.offset += 4
  //   }

  //   return value
  // }

  /**

     * Reads a 32bit unsigned integer. This is an alias of {@link ByteBuffer#readUint32}.

     * @function

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @returns {number} Value read

     * @expose

     */

  readUInt32 = this.readUint32

  /**

     * Writes a 32bit float.

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  // writeFloat32(value, offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof value !== 'number') {
  //       throw TypeError('Illegal value: ' + value + ' (not a number)')
  //     }

  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 0 > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal offset: 0 <= ' +
  //           offset +
  //           ' (+0) <= ' +
  //           this.buffer.byteLength
  //       )
  //     }
  //   }

  //   offset += 4

  //   let capacity8 = this.buffer.byteLength

  //   if (offset > capacity8) {
  //     this.resize((capacity8 *= 2) > offset ? capacity8 : offset)
  //   }

  //   offset -= 4

  //   this.view.setFloat32(offset, value, this.littleEndian)

  //   if (relative) {
  //     this.offset += 4
  //   }

  //   return this
  // }

  /**

     * Writes a 32bit float. This is an alias of {@link ByteBuffer#writeFloat32}.

     * @function

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  // writeFloat = this.writeFloat32

  /**

     * Reads a 32bit float.

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @returns {number}

     * @expose

     */

  // readFloat32(offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 4 > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal offset: 0 <= ' +
  //           offset +
  //           ' (+4) <= ' +
  //           this.buffer.byteLength
  //       )
  //     }
  //   }

  //   const value = this.view.getFloat32(offset, this.littleEndian)

  //   if (relative) {
  //     this.offset += 4
  //   }

  //   return value
  // }

  /**

     * Reads a 32bit float. This is an alias of {@link ByteBuffer#readFloat32}.

     * @function

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.

     * @returns {number}

     * @expose

     */

  // readFloat = this.readFloat32

  // types/floats/float64

  /**

     * Writes a 64bit float.

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  // writeFloat64(value, offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof value !== 'number') {
  //       throw TypeError('Illegal value: ' + value + ' (not a number)')
  //     }

  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 0 > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal offset: 0 <= ' +
  //           offset +
  //           ' (+0) <= ' +
  //           this.buffer.byteLength
  //       )
  //     }
  //   }

  //   offset += 8

  //   let capacity9 = this.buffer.byteLength

  //   if (offset > capacity9) {
  //     this.resize((capacity9 *= 2) > offset ? capacity9 : offset)
  //   }

  //   offset -= 8

  //   this.view.setFloat64(offset, value, this.littleEndian)

  //   if (relative) {
  //     this.offset += 8
  //   }

  //   return this
  // }

  /**

     * Writes a 64bit float. This is an alias of {@link ByteBuffer#writeFloat64}.

     * @function

     * @param {number} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  // writeDouble = this.writeFloat64

  /**

     * Reads a 64bit float.

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {number}

     * @expose

     */

  // readFloat64(offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 8 > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal offset: 0 <= ' +
  //           offset +
  //           ' (+8) <= ' +
  //           this.buffer.byteLength
  //       )
  //     }
  //   }

  //   const value = this.view.getFloat64(offset, this.littleEndian)

  //   if (relative) {
  //     this.offset += 8
  //   }

  //   return value
  // }

  /**

     * Reads a 64bit float. This is an alias of {@link ByteBuffer#readFloat64}.

     * @function

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {number}

     * @expose

     */

  // readDouble = this.readFloat64

  /**

     * Appends some data to this ByteBuffer. This will overwrite any contents behind the specified offset up to the appended

     *  data's length.

     * @param {!ByteBuffer|!ArrayBuffer|!Uint8Array} source Data to append. If `source` is a ByteBuffer, its offsets

     *  will be modified according to the performed read operation.

     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")

     * @param {number=} offset Offset to append at. Will use and increase {@link ByteBuffer#offset} by the number of bytes

     *  written if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     * @example A relative `<01 02>03.append(<04 05>)` will result in `<01 02 04 05>, 04 05|`

     * @example An absolute `<01 02>03.append(04 05>, 1)` will result in `<01 04>05, 04 05|`

     */

  append(source, offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    }

    if (!(source instanceof ByteBuffer)) {
      source = ByteBuffer.wrap(source)
    }

    const length = source.limit - source.offset

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
      new Uint8Array(source.buffer).subarray(source.offset, source.limit)
    )

    source.offset += length

    if (relative) {
      this.offset += length
    }

    return this
  }

  /**

     * Appends this ByteBuffer's contents to another ByteBuffer. This will overwrite any contents at and after the

        specified offset up to the length of this ByteBuffer's data.

     * @param {!ByteBuffer} target Target ByteBuffer

     * @param {number=} offset Offset to append to. Will use and increase {@link ByteBuffer#offset} by the number of bytes

     *  read if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     * @see ByteBuffer#append

     */

  // appendTo(target, offset) {
  //   target.append(this, offset)

  //   return this
  // }

  /**

     * Enables or disables assertions of argument types and offsets. Assertions are enabled by default but you can opt to

     *  disable them if your code already makes sure that everything is valid.

     * @param {boolean} assert `true` to enable assertions, otherwise `false`

     * @returns {!ByteBuffer} this

     * @expose

     */

  // assert(assert) {
  //   this.noAssert = !assert

  //   return this
  // }

  /**

     * Gets the capacity of this ByteBuffer's backing buffer.

     * @returns {number} Capacity of the backing buffer

     * @expose

     */

  // capacity() {
  //   return this.buffer.byteLength
  // }

  /**

     * Clears this ByteBuffer's offsets by setting {@link ByteBuffer#offset} to `0` and {@link ByteBuffer#limit} to the

     *  backing buffer's capacity. Discards {@link ByteBuffer#markedOffset}.

     * @returns {!ByteBuffer} this

     * @expose

     */

  // clear() {
  //   this.offset = 0

  //   this.limit = this.buffer.byteLength

  //   this.markedOffset = -1

  //   return this
  // }

  /**

     * Creates a cloned instance of this ByteBuffer, preset with this ByteBuffer's values for {@link ByteBuffer#offset},

     *  {@link ByteBuffer#markedOffset} and {@link ByteBuffer#limit}.

     * @param {boolean=} copy Whether to copy the backing buffer or to return another view on the same, defaults to `false`

     * @returns {!ByteBuffer} Cloned instance

     * @expose

     */

  clone(copy) {
    const bb = new ByteBuffer(0, this.littleEndian, this.noAssert)

    if (copy) {
      bb.buffer = new ArrayBuffer(this.buffer.byteLength)

      new Uint8Array(bb.buffer).set(this.buffer)

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

     * Compacts this ByteBuffer to be backed by a {@link ByteBuffer#buffer} of its contents' length. Contents are the bytes

     *  between {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. Will set `offset = 0` and `limit = capacity` and

     *  adapt {@link ByteBuffer#markedOffset} to the same relative position if set.

     * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}

     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}

     * @returns {!ByteBuffer} this

     * @expose

     */

  // compact(begin, end) {
  //   if (typeof begin === 'undefined') {
  //     begin = this.offset
  //   }

  //   if (typeof end === 'undefined') {
  //     end = this.limit
  //   }

  //   if (!this.noAssert) {
  //     if (typeof begin !== 'number' || begin % 1 !== 0) {
  //       throw TypeError('Illegal begin: Not an integer')
  //     }

  //     begin >>>= 0

  //     if (typeof end !== 'number' || end % 1 !== 0) {
  //       throw TypeError('Illegal end: Not an integer')
  //     }

  //     end >>>= 0

  //     if (begin < 0 || begin > end || end > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal range: 0 <= ' + begin + ' <= ' + end + ' <= ' + this.buffer.byteLength
  //       )
  //     }
  //   }

  //   if (begin === 0 && end === this.buffer.byteLength) {
  //     return this
  //   }

  //   const len = end - begin

  //   if (len === 0) {
  //     this.buffer = EMPTY_BUFFER

  //     this.view = new DataView(EMPTY_BUFFER)

  //     if (this.markedOffset >= 0) {
  //       this.markedOffset -= begin
  //     }

  //     this.offset = 0

  //     this.limit = 0

  //     return this
  //   }

  //   const buffer = new ArrayBuffer(len)

  //   new Uint8Array(buffer).set(new Uint8Array(this.buffer).subarray(begin, end))

  //   this.buffer = buffer

  //   this.view = new DataView(buffer)

  //   if (this.markedOffset >= 0) {
  //     this.markedOffset -= begin
  //   }

  //   this.offset = 0

  //   this.limit = len

  //   return this
  // }

  /**

     * Creates a copy of this ByteBuffer's contents. Contents are the bytes between {@link ByteBuffer#offset} and

     *  {@link ByteBuffer#limit}.

     * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.

     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.

     * @returns {!ByteBuffer} Copy

     * @expose

     */

  copy(begin, end) {
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

     * Copies this ByteBuffer's contents to another ByteBuffer. Contents are the bytes between {@link ByteBuffer#offset} and

     *  {@link ByteBuffer#limit}.

     * @param {!ByteBuffer} target Target ByteBuffer

     * @param {number=} targetOffset Offset to copy to. Will use and increase the target's {@link ByteBuffer#offset}

     *  by the number of bytes copied if omitted.

     * @param {number=} sourceOffset Offset to start copying from. Will use and increase {@link ByteBuffer#offset} by the

     *  number of bytes copied if omitted.

     * @param {number=} sourceLimit Offset to end copying from, defaults to {@link ByteBuffer#limit}

     * @returns {!ByteBuffer} this

     * @expose

     */

  copyTo(target, targetOffset, sourceOffset, sourceLimit) {
    const targetRelative = typeof targetOffset === 'undefined'
    const relative = typeof sourceOffset === 'undefined'

    if (!this.noAssert) {
      if (!(target instanceof ByteBuffer)) {
        throw TypeError('Illegal target: Not a ByteBuffer')
      }
    }

    targetOffset = targetRelative ? target.offset : targetOffset | 0

    sourceOffset = relative ? this.offset : sourceOffset | 0

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

     * Makes sure that this ByteBuffer is backed by a {@link ByteBuffer#buffer} of at least the specified capacity. If the

     *  current capacity is exceeded, it will be doubled. If double the current capacity is less than the required capacity,

     *  the required capacity will be used instead.

     * @param {number} capacity Required capacity

     * @returns {!ByteBuffer} this

     * @expose

     */

  ensureCapacity(capacity) {
    let current = this.buffer.byteLength

    if (current < capacity) {
      return this.resize((current *= 2) > capacity ? current : capacity)
    }

    return this
  }

  /**

     * Overwrites this ByteBuffer's contents with the specified value. Contents are the bytes between

     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.

     * @param {number|string} value Byte value to fill with. If given as a string, the first character is used.

     * @param {number=} begin Begin offset. Will use and increase {@link ByteBuffer#offset} by the number of bytes

     *  written if omitted. defaults to {@link ByteBuffer#offset}.

     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.

     * @returns {!ByteBuffer} this

     * @expose

     * @example `someByteBuffer.clear().fill(0)` fills the entire backing buffer with zeroes

     */

  // fill(value, begin, end) {
  //   const relative = typeof begin === 'undefined'

  //   if (relative) {
  //     begin = this.offset
  //   }

  //   if (typeof value === 'string' && value.length > 0) {
  //     value = value.charCodeAt(0)
  //   }

  //   if (typeof begin === 'undefined') {
  //     begin = this.offset
  //   }

  //   if (typeof end === 'undefined') {
  //     end = this.limit
  //   }

  //   if (!this.noAssert) {
  //     if (typeof value !== 'number' || value % 1 !== 0) {
  //       throw TypeError('Illegal value: ' + value + ' (not an integer)')
  //     }

  //     value |= 0

  //     if (typeof begin !== 'number' || begin % 1 !== 0) {
  //       throw TypeError('Illegal begin: Not an integer')
  //     }

  //     begin >>>= 0

  //     if (typeof end !== 'number' || end % 1 !== 0) {
  //       throw TypeError('Illegal end: Not an integer')
  //     }

  //     end >>>= 0

  //     if (begin < 0 || begin > end || end > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal range: 0 <= ' + begin + ' <= ' + end + ' <= ' + this.buffer.byteLength
  //       )
  //     }
  //   }

  //   if (begin >= end) {
  //     return this
  //   }

  //   while (begin < end) {
  //     this.view.setUint8(begin++, value)
  //   }

  //   if (relative) {
  //     this.offset = begin
  //   }

  //   return this
  // }

  /**

     * Makes this ByteBuffer ready for a new sequence of write or relative read operations. Sets `limit = offset` and

     *  `offset = 0`. Make sure always to flip a ByteBuffer when all relative read or write operations are complete.

     * @returns {!ByteBuffer} this

     * @expose

     */

  flip() {
    this.limit = this.offset

    this.offset = 0

    return this
  }

  /**

     * Marks an offset on this ByteBuffer to be used later.

     * @param {number=} offset Offset to mark. Defaults to {@link ByteBuffer#offset}.

     * @returns {!ByteBuffer} this

     * @throws {TypeError} If `offset` is not a valid number

     * @throws {RangeError} If `offset` is out of bounds

     * @see ByteBuffer#reset

     * @expose

     */

  // mark(offset) {
  //   offset = typeof offset === 'undefined' ? this.offset : offset

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 0 > this.buffer.byteLength) {
  //       throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
  //     }
  //   }

  //   this.markedOffset = offset

  //   return this
  // }

  /**

     * Sets the byte order.

     * @param {boolean} littleEndian `true` for little endian byte order, `false` for big endian

     * @returns {!ByteBuffer} this

     * @expose

     */

  // order(littleEndian) {
  //   if (!this.noAssert) {
  //     if (typeof littleEndian !== 'boolean') {
  //       throw TypeError('Illegal littleEndian: Not a boolean')
  //     }
  //   }

  //   this.littleEndian = !!littleEndian

  //   return this
  // }

  /**

     * Switches (to) little endian byte order.

     * @param {boolean=} littleEndian Defaults to `true`, otherwise uses big endian

     * @returns {!ByteBuffer} this

     * @expose

     */

  // LE(littleEndian) {
  //   this.littleEndian = typeof littleEndian !== 'undefined' ? !!littleEndian : true

  //   return this
  // }

  /**

     * Switches (to) big endian byte order.

     * @param {boolean=} bigEndian Defaults to `true`, otherwise uses little endian

     * @returns {!ByteBuffer} this

     * @expose

     */

  // BE(bigEndian) {
  //   this.littleEndian = typeof bigEndian !== 'undefined' ? !bigEndian : false

  //   return this
  // }

  /**

     * Prepends some data to this ByteBuffer. This will overwrite any contents before the specified offset up to the

     *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer

     *  will be resized and its contents moved accordingly.

     * @param {!ByteBuffer|!ArrayBuffer} source Data to prepend. If `source` is a ByteBuffer, its offset will be

     *  modified according to the performed read operation.

     * @param {(string|number)=} encoding Encoding if `data` is a string ("base64", "hex", "binary", defaults to "utf8")

     * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes

     *  prepended if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     * @example A relative `00<01 02 03>.prepend(<04 05>)` results in `<04 05 01 02 03>, 04 05|`

     * @example An absolute `00<01 02 03>.prepend(<04 05>, 2)` results in `04<05 02 03>, 04 05|`

     */

  // prepend(source, offset) {
  //   const relative = typeof offset === 'undefined'

  //   if (relative) {
  //     offset = this.offset
  //   }

  //   if (!this.noAssert) {
  //     if (typeof offset !== 'number' || offset % 1 !== 0) {
  //       throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
  //     }

  //     offset >>>= 0

  //     if (offset < 0 || offset + 0 > this.buffer.byteLength) {
  //       throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
  //     }
  //   }

  //   if (!(source instanceof ByteBuffer)) {
  //     source = ByteBuffer.wrap(source)
  //   }

  //   const len = source.limit - source.offset

  //   if (len <= 0) {
  //     return this
  //   }

  //   const diff = len - offset

  //   if (diff > 0) {
  //     const buffer = new ArrayBuffer(this.buffer.byteLength + diff)

  //     const arrayView = new Uint8Array(buffer)

  //     arrayView.set(new Uint8Array(this.buffer).subarray(offset, this.buffer.byteLength), len)

  //     this.buffer = buffer

  //     this.view = new DataView(buffer)

  //     this.offset += diff

  //     if (this.markedOffset >= 0) {
  //       this.markedOffset += diff
  //     }

  //     this.limit += diff

  //     offset += diff
  //   } else {
  //     const arrayView = new Uint8Array(this.buffer)

  //     arrayView.set(
  //       new Uint8Array(source.buffer).subarray(source.offset, source.limit),
  //       offset - len
  //     )
  //   }

  //   source.offset = source.limit

  //   if (relative) {
  //     this.offset -= len
  //   }

  //   return this
  // }

  /**

     * Prepends this ByteBuffer to another ByteBuffer. This will overwrite any contents before the specified offset up to the

     *  prepended data's length. If there is not enough space available before the specified `offset`, the backing buffer

     *  will be resized and its contents moved accordingly.

     * @param {!ByteBuffer} target Target ByteBuffer

     * @param {number=} offset Offset to prepend at. Will use and decrease {@link ByteBuffer#offset} by the number of bytes

     *  prepended if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     * @see ByteBuffer#prepend

     */

  // prependTo(target, offset) {
  //   target.prepend(this, offset)

  //   return this
  // }

  /**

     * Gets the number of remaining readable bytes. Contents are the bytes between {@link ByteBuffer#offset} and

     *  {@link ByteBuffer#limit}, so this returns `limit - offset`.

     * @returns {number} Remaining readable bytes. May be negative if `offset > limit`.

     * @expose

     */

  // remaining() {
  //   return this.limit - this.offset
  // }

  /**

     * Resets this ByteBuffer's {@link ByteBuffer#offset}. If an offset has been marked through {@link ByteBuffer#mark}

     *  before, `offset` will be set to {@link ByteBuffer#markedOffset}, which will then be discarded. If no offset has been

     *  marked, sets `offset = 0`.

     * @returns {!ByteBuffer} this

     * @see ByteBuffer#mark

     * @expose

     */

  // reset() {
  //   if (this.markedOffset >= 0) {
  //     this.offset = this.markedOffset

  //     this.markedOffset = -1
  //   } else {
  //     this.offset = 0
  //   }

  //   return this
  // }

  /**

     * Resizes this ByteBuffer to be backed by a buffer of at least the given capacity. Will do nothing if already that

     *  large or larger.

     * @param {number} capacity Capacity required

     * @returns {!ByteBuffer} this

     * @throws {TypeError} If `capacity` is not a number

     * @throws {RangeError} If `capacity < 0`

     * @expose

     */

  resize(capacity) {
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

     * Reverses this ByteBuffer's contents.

     * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}

     * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}

     * @returns {!ByteBuffer} this

     * @expose

     */

  // reverse(begin, end) {
  //   if (typeof begin === 'undefined') {
  //     begin = this.offset
  //   }

  //   if (typeof end === 'undefined') {
  //     end = this.limit
  //   }

  //   if (!this.noAssert) {
  //     if (typeof begin !== 'number' || begin % 1 !== 0) {
  //       throw TypeError('Illegal begin: Not an integer')
  //     }

  //     begin >>>= 0

  //     if (typeof end !== 'number' || end % 1 !== 0) {
  //       throw TypeError('Illegal end: Not an integer')
  //     }

  //     end >>>= 0

  //     if (begin < 0 || begin > end || end > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal range: 0 <= ' + begin + ' <= ' + end + ' <= ' + this.buffer.byteLength
  //       )
  //     }
  //   }

  //   if (begin === end) {
  //     return this
  //   }

  //   Array.prototype.reverse.call(new Uint8Array(this.buffer).subarray(begin, end))

  //   this.view = new DataView(this.buffer)

  //   return this
  // }

  /**

     * Skips the next `length` bytes. This will just advance

     * @param {number} length Number of bytes to skip. May also be negative to move the offset back.

     * @returns {!ByteBuffer} this

     * @expose

     */

  skip(length) {
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

     * Slices this ByteBuffer by creating a cloned instance with `offset = begin` and `limit = end`.

     * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.

     * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.

     * @returns {!ByteBuffer} Clone of this ByteBuffer with slicing applied, backed by the same {@link ByteBuffer#buffer}

     * @expose

     */

  // slice(begin, end) {
  //   if (typeof begin === 'undefined') {
  //     begin = this.offset
  //   }

  //   if (typeof end === 'undefined') {
  //     end = this.limit
  //   }

  //   if (!this.noAssert) {
  //     if (typeof begin !== 'number' || begin % 1 !== 0) {
  //       throw TypeError('Illegal begin: Not an integer')
  //     }

  //     begin >>>= 0

  //     if (typeof end !== 'number' || end % 1 !== 0) {
  //       throw TypeError('Illegal end: Not an integer')
  //     }

  //     end >>>= 0

  //     if (begin < 0 || begin > end || end > this.buffer.byteLength) {
  //       throw RangeError(
  //         'Illegal range: 0 <= ' + begin + ' <= ' + end + ' <= ' + this.buffer.byteLength
  //       )
  //     }
  //   }

  //   const bb = this.clone()

  //   bb.offset = begin

  //   bb.limit = end

  //   return bb
  // }

  /**

     * Writes a 64bit signed integer.

     * @param {number|bigint} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  writeInt64(value, offset) {
    const relative = typeof offset === 'undefined'

    if (typeof offset === 'undefined') {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value === 'number') {
        value = BigInt(value)
      }

      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    }

    if (typeof value === 'number') {
      value = BigInt(value)
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

     * @param {number|!bigint} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  writeLong = this.writeInt64

  /**

     * Reads a 64bit signed integer.

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!bigint}

     * @expose

     */

  readInt64(offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 8 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+8) <= ' + this.buffer.byteLength)
      }
    }

    const value = this.view.getBigInt64(offset, this.littleEndian)

    if (relative) {
      this.offset += 8
    }

    return value
  }

  /**

     * Reads a 64bit signed integer. This is an alias of {@link ByteBuffer#readInt64}.

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!bigint}

     * @expose

     */

  readLong = this.readInt64

  /**

     * Writes a 64bit unsigned integer.

     * @param {number|!bigint} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  writeUint64(value, offset) {
    const relative = typeof offset === 'undefined'

    if (typeof offset === 'undefined') {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof value === 'number') {
        value = BigInt(value)
      }

      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+0) <= ' + this.buffer.byteLength)
      }
    }

    if (typeof value === 'number') {
      value = BigInt(value)
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

     * @function

     * @param {number|!bigint} value Value to write

     * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!ByteBuffer} this

     * @expose

     */

  writeUInt64 = this.writeUint64

  /**

     * Reads a 64bit unsigned integer.

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!bigint}

     * @expose

     */

  readUint64(offset) {
    const relative = typeof offset === 'undefined'

    if (relative) {
      offset = this.offset
    }

    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }

      offset >>>= 0

      if (offset < 0 || offset + 8 > this.buffer.byteLength) {
        throw RangeError('Illegal offset: 0 <= ' + offset + ' (+8) <= ' + this.buffer.byteLength)
      }
    }

    const value = this.view.getBigUint64(offset, this.littleEndian)

    if (relative) {
      this.offset += 8
    }

    return value
  }

  /**

     * Reads a 64bit unsigned integer. This is an alias of {@link ByteBuffer#readUint64}.

     * @function

     * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.

     * @returns {!Long}

     * @expose

     */

  readUInt64 = this.readUint64

  /**

     * Returns a copy of the backing buffer that contains this ByteBuffer's contents. Contents are the bytes between

     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.

     * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory if

     *  possible. Defaults to `false`

     * @returns {!ArrayBuffer} Contents as an ArrayBuffer

     * @expose

     */

  toBuffer(forceCopy?) {
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

     * Returns a raw buffer compacted to contain this ByteBuffer's contents. Contents are the bytes between

     *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. This is an alias of {@link ByteBuffer#toBuffer}.

     * @function

     * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory.

     *  Defaults to `false`

     * @returns {!ArrayBuffer} Contents as an ArrayBuffer

     * @expose

     */

  toArrayBuffer = this.toBuffer

  writeVarint32(value, offset) {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    if (!this.noAssert) {
      if (typeof value !== 'number' || value % 1 !== 0) {
        throw TypeError('Illegal value: ' + value + ' (not an integer)')
      }
      value |= 0
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset >>>= 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + offset + ' (+' + 0 + ') <= ' + this.buffer.byteLength
        )
      }
    }
    const size = this.calculateVarint32(value)
    let b
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

  readVarint32 = function (offset) {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset >>>= 0
      if (offset < 0 || offset + 1 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + offset + ' (+' + 1 + ') <= ' + this.buffer.byteLength
        )
      }
    }
    let c = 0
    let value = 0 >>> 0
    let b
    do {
      if (!this.noAssert && offset > this.limit) {
        const err = Error('Truncated')
        err.truncated = true
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

  calculateVarint32(value) {
    // ref: src/google/protobuf/io/coded_stream.cc
    value = value >>> 0
    if (value < 1 << 7) return 1
    else if (value < 1 << 14) return 2
    else if (value < 1 << 21) return 3
    else if (value < 1 << 28) return 4
    else return 5
  }

  writeVString(str, offset?) {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    if (!this.noAssert) {
      if (typeof str !== 'string') {
        throw TypeError('Illegal str: Not a string')
      }
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset >>>= 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + offset + ' (+' + 0 + ') <= ' + this.buffer.byteLength
        )
      }
    }
    const start = offset
    const k = utfx.calculateUTF16asUTF8(stringSource(str), this.noAssert)[1]
    const l = this.calculateVarint32(k)
    offset += l + k
    let capacity15 = this.buffer.byteLength
    if (offset > capacity15) {
      this.resize((capacity15 *= 2) > offset ? capacity15 : offset)
    }
    offset -= l + k
    offset += this.writeVarint32(k, offset)
    utfx.encodeUTF16toUTF8(
      stringSource(str),
      function (b) {
        this.view.setUint8(offset++, b)
      }.bind(this)
    )
    if (offset !== start + k + l) {
      throw RangeError('Illegal range: Truncated data, ' + offset + ' == ' + (offset + k + l))
    }
    if (relative) {
      this.offset = offset
      return this
    }
    return offset - start
  }

  readVString(offset) {
    const relative = typeof offset === 'undefined'
    if (relative) offset = this.offset
    if (!this.noAssert) {
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset >>>= 0
      if (offset < 0 || offset + 1 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + offset + ' (+' + 1 + ') <= ' + this.buffer.byteLength
        )
      }
    }
    const start = offset
    const len = this.readVarint32(offset)
    const str = this.readUTF8String(len.value, ByteBuffer.METRICS_BYTES, (offset += len.length))
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

  readUTF8String(length, metrics, offset) {
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
      if (typeof offset !== 'number' || offset % 1 !== 0) {
        throw TypeError('Illegal offset: ' + offset + ' (not an integer)')
      }
      offset >>>= 0
      if (offset < 0 || offset + 0 > this.buffer.byteLength) {
        throw RangeError(
          'Illegal offset: 0 <= ' + offset + ' (+' + 0 + ') <= ' + this.buffer.byteLength
        )
      }
    }
    let i = 0
    const start = offset
    let sd
    if (metrics === ByteBuffer.METRICS_CHARS) {
      // The same for node and the browser
      sd = stringDestination()
      utfx.decodeUTF8(
        function () {
          return i < length && offset < this.limit ? this.view.getUint8(offset++) : null
        }.bind(this),
        function (cp) {
          ++i
          utfx.UTF8toUTF16(cp, sd)
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
      utfx.decodeUTF8toUTF16(
        function () {
          return offset < k ? this.view.getUint8(offset++) : null
        }.bind(this),
        (sd = stringDestination()),
        this.noAssert
      )
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
function stringDestination() {
  const cs = []
  const ps = []
  return function () {
    if (arguments.length === 0) {
      return ps.join('') + stringFromCharCode.apply(String, cs)
    }
    if (cs.length + arguments.length > 1024) {
      ps.push(stringFromCharCode.apply(String, cs))
      cs.length = 0
    }
    Array.prototype.push.apply(cs, arguments)
  }
}
const stringFromCharCode = String.fromCharCode

function stringSource(s) {
  let i = 0
  return function () {
    return i < s.length ? s.charCodeAt(i++) : null
  }
}

const EMPTY_BUFFER = new ArrayBuffer(0)

/**
 * utfx namespace.
 * @inner
 * @type {!Object.<string,*>}
 */
const utfx = {}

/**
 * Maximum valid code point.
 * @type {number}
 * @const
 */
utfx.MAX_CODEPOINT = 0x10ffff

/**
 * Encodes UTF8 code points to UTF8 bytes.
 * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
 *  respectively `null` if there are no more code points left or a single numeric code point.
 * @param {!function(number)} dst Bytes destination as a function successively called with the next byte
 */
utfx.encodeUTF8 = function (src, dst) {
  let cp = null
  if (typeof src === 'number') {
    cp = src
    src = function () {
      return null
    }
  }
  while (cp !== null || (cp = src()) !== null) {
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

/**
 * Decodes UTF8 bytes to UTF8 code points.
 * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
 *  are no more bytes left.
 * @param {!function(number)} dst Code points destination as a function successively called with each decoded code point.
 * @throws {RangeError} If a starting byte is invalid in UTF8
 * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the
 *  remaining bytes.
 */
utfx.decodeUTF8 = function (src, dst) {
  let a
  let b
  let c
  let d
  const fail = function (b) {
    b = b.slice(0, b.indexOf(null))
    const err = Error(b.toString())
    err.name = 'TruncatedError'
    err.bytes = b
    throw err
  }
  while ((a = src()) !== null) {
    if ((a & 0x80) === 0) {
      dst(a)
    } else if ((a & 0xe0) === 0xc0) {
      ;(b = src()) === null && fail([a, b])
      dst(((a & 0x1f) << 6) | (b & 0x3f))
    } else if ((a & 0xf0) === 0xe0) {
      ;((b = src()) === null || (c = src()) === null) && fail([a, b, c])
      dst(((a & 0x0f) << 12) | ((b & 0x3f) << 6) | (c & 0x3f))
    } else if ((a & 0xf8) === 0xf0) {
      ;((b = src()) === null || (c = src()) === null || (d = src()) === null) && fail([a, b, c, d])
      dst(((a & 0x07) << 18) | ((b & 0x3f) << 12) | ((c & 0x3f) << 6) | (d & 0x3f))
    } else throw RangeError('Illegal starting byte: ' + a)
  }
}

/**
 * Converts UTF16 characters to UTF8 code points.
 * @param {!function():number|null} src Characters source as a function returning the next char code respectively
 *  `null` if there are no more characters left.
 * @param {!function(number)} dst Code points destination as a function successively called with each converted code
 *  point.
 */
utfx.UTF16toUTF8 = function (src, dst) {
  let c1
  let c2 = null
  while (true) {
    if ((c1 = c2 !== null ? c2 : src()) === null) {
      break
    }
    if (c1 >= 0xd800 && c1 <= 0xdfff) {
      if ((c2 = src()) !== null) {
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

/**
 * Converts UTF8 code points to UTF16 characters.
 * @param {(!function():number|null) | number} src Code points source, either as a function returning the next code point
 *  respectively `null` if there are no more code points left or a single numeric code point.
 * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
 * @throws {RangeError} If a code point is out of range
 */
utfx.UTF8toUTF16 = function (src, dst) {
  let cp = null
  if (typeof src === 'number') {
    cp = src
    src = function () {
      return null
    }
  }
  while (cp !== null || (cp = src()) !== null) {
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

/**
 * Converts and encodes UTF16 characters to UTF8 bytes.
 * @param {!function():number|null} src Characters source as a function returning the next char code respectively `null`
 *  if there are no more characters left.
 * @param {!function(number)} dst Bytes destination as a function successively called with the next byte.
 */
utfx.encodeUTF16toUTF8 = function (src, dst) {
  utfx.UTF16toUTF8(src, function (cp) {
    utfx.encodeUTF8(cp, dst)
  })
}

/**
 * Decodes and converts UTF8 bytes to UTF16 characters.
 * @param {!function():number|null} src Bytes source as a function returning the next byte respectively `null` if there
 *  are no more bytes left.
 * @param {!function(number)} dst Characters destination as a function successively called with each converted char code.
 * @throws {RangeError} If a starting byte is invalid in UTF8
 * @throws {Error} If the last sequence is truncated. Has an array property `bytes` holding the remaining bytes.
 */
utfx.decodeUTF8toUTF16 = function (src, dst) {
  utfx.decodeUTF8(src, function (cp) {
    utfx.UTF8toUTF16(cp, dst)
  })
}

/**
 * Calculates the byte length of an UTF8 code point.
 * @param {number} cp UTF8 code point
 * @returns {number} Byte length
 */
utfx.calculateCodePoint = function (cp) {
  return cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4
}

/**
 * Calculates the number of UTF8 bytes required to store UTF8 code points.
 * @param {(!function():number|null)} src Code points source as a function returning the next code point respectively
 *  `null` if there are no more code points left.
 * @returns {number} The number of UTF8 bytes required
 */
utfx.calculateUTF8 = function (src) {
  let cp
  let l = 0
  while ((cp = src()) !== null) {
    l += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4
  }
  return l
}

/**
 * Calculates the number of UTF8 code points respectively UTF8 bytes required to store UTF16 char codes.
 * @param {(!function():number|null)} src Characters source as a function returning the next char code respectively
 *  `null` if there are no more characters left.
 * @returns {!Array.<number>} The number of UTF8 code points at index 0 and the number of UTF8 bytes required at index 1.
 */
utfx.calculateUTF16asUTF8 = function (src) {
  let n = 0
  let l = 0
  utfx.UTF16toUTF8(src, function (cp) {
    ++n
    l += cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4
  })
  return [n, l]
}
