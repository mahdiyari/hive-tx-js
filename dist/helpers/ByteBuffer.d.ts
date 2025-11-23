/**

 * @license bytebuffer.ts (c) 2015 Daniel Wirtz <dcode@dcode.io>

 * Backing buffer: ArrayBuffer, Accessor: DataView

 * Released under the Apache License, Version 2.0

 * see: https://github.com/dcodeIO/bytebuffer.ts for details

 * modified by @xmcl/bytebuffer

 * And customized for hive-tx

 */
export declare class ByteBuffer {
    /**
  
     * ByteBuffer version.
  
     * @type {string}
  
     * @const
  
     * @expose
  
     */
    static VERSION: string;
    /**
  
     * Little endian constant that can be used instead of its boolean value. Evaluates to `true`.
  
     * @type {boolean}
  
     * @const
  
     * @expose
  
     */
    static LITTLE_ENDIAN: boolean;
    /**
  
       * Big endian constant that can be used instead of its boolean value. Evaluates to `false`.
  
       * @type {boolean}
  
       * @const
  
       * @expose
  
       */
    static BIG_ENDIAN: boolean;
    /**
  
       * Default initial capacity of `16`.
  
       * @type {number}
  
       * @expose
  
       */
    static DEFAULT_CAPACITY: number;
    /**
  
       * Default endianess of `false` for big endian.
  
       * @type {boolean}
  
       * @expose
  
       */
    static DEFAULT_ENDIAN: boolean;
    /**
  
       * Default no assertions flag of `false`.
  
       * @type {boolean}
  
       * @expose
  
       */
    static DEFAULT_NOASSERT: boolean;
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
    static METRICS_BYTES: string;
    buffer: any;
    /**
  
       * DataView utilized to manipulate the backing buffer. Becomes `null` if the backing buffer has a capacity of `0`.
  
       * @type {?DataView}
  
       * @expose
  
       */
    view: any;
    /**
  
       * Absolute read/write offset.
  
       * @type {number}
  
       * @expose
  
       * @see ByteBuffer#flip
  
       * @see ByteBuffer#clear
  
       */
    offset: any;
    /**
  
       * Marked offset.
  
       * @type {number}
  
       * @expose
  
       * @see ByteBuffer#mark
  
       * @see ByteBuffer#reset
  
       */
    markedOffset: any;
    /**
  
       * Absolute limit of the contained data. Set to the backing buffer's capacity upon allocation.
  
       * @type {number}
  
       * @expose
  
       * @see ByteBuffer#flip
  
       * @see ByteBuffer#clear
  
       */
    limit: any;
    /**
  
       * Whether to use little endian byte order, defaults to `false` for big endian.
  
       * @type {boolean}
  
       * @expose
  
       */
    littleEndian: any;
    /**
  
       * Whether to skip assertions of offsets and values, defaults to `false`.
  
       * @type {boolean}
  
       * @expose
  
       */
    noAssert: any;
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
    constructor(capacity: any, littleEndian: any, noAssert?: boolean);
    /**
  
       * Gets the accessor type.
  
       * @returns {Function} `Buffer` under node.ts, `Uint8Array` respectively `DataView` in the browser (classes)
  
       * @expose
  
       */
    static accessor: () => DataViewConstructor;
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
    static allocate: (capacity: any, littleEndian: any, noAssert: any) => ByteBuffer;
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
    static concat: (buffers: any, littleEndian: any, noAssert: any) => ByteBuffer;
    /**
  
       * Gets the backing buffer type.
  
       * @returns {Function} `Buffer` under node.ts, `ArrayBuffer` in the browser (classes)
  
       * @expose
  
       */
    static type: () => ArrayBufferConstructor;
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
    static wrap: (buffer: any, littleEndian: any, noAssert: any) => any;
    /**
  
       * Reads the specified number of bytes.
  
       * @param {number} length Number of bytes to read
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `length` if omitted.
  
       * @returns {!ByteBuffer}
  
       * @expose
  
       */
    readBytes(length: any, offset: any): ByteBuffer;
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
    writeBytes: (source: any, offset: any) => this;
    /**
  
       * Writes an 8bit signed integer.
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeInt8(value: any, offset: any): this;
    /**
  
       * Writes an 8bit signed integer. This is an alias of {@link ByteBuffer#writeInt8}.
  
       * @function
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeByte: (value: any, offset: any) => this;
    /**
  
       * Reads an 8bit signed integer.
  
       * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
  
       * @returns {number} Value read
  
       * @expose
  
       */
    readInt8(offset: any): any;
    /**
  
       * Reads an 8bit signed integer. This is an alias of {@link ByteBuffer#readInt8}.
  
       * @function
  
       * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
  
       * @returns {number} Value read
  
       * @expose
  
       */
    readByte: (offset: any) => any;
    /**
  
       * Writes an 8bit unsigned integer.
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeUint8(value: any, offset: any): this;
    /**
  
       * Writes an 8bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint8}.
  
       * @function
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeUInt8: (value: any, offset: any) => this;
    /**
  
       * Reads an 8bit unsigned integer.
  
       * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
  
       * @returns {number} Value read
  
       * @expose
  
       */
    readUint8(offset: any): any;
    /**
  
       * Reads an 8bit unsigned integer. This is an alias of {@link ByteBuffer#readUint8}.
  
       * @function
  
       * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `1` if omitted.
  
       * @returns {number} Value read
  
       * @expose
  
       */
    readUInt8: (offset: any) => any;
    /**
  
       * Writes a 16bit signed integer.
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
  
       * @throws {TypeError} If `offset` or `value` is not a valid number
  
       * @throws {RangeError} If `offset` is out of bounds
  
       * @expose
  
       */
    writeInt16(value: any, offset: any): this;
    /**
  
       * Writes a 16bit signed integer. This is an alias of {@link ByteBuffer#writeInt16}.
  
       * @function
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
  
       * @throws {TypeError} If `offset` or `value` is not a valid number
  
       * @throws {RangeError} If `offset` is out of bounds
  
       * @expose
  
       */
    writeShort: (value: any, offset: any) => this;
    /**
  
       * Reads a 16bit signed integer.
  
       * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
  
       * @returns {number} Value read
  
       * @throws {TypeError} If `offset` is not a valid number
  
       * @throws {RangeError} If `offset` is out of bounds
  
       * @expose
  
       */
    readInt16(offset: any): any;
    /**
  
       * Reads a 16bit signed integer. This is an alias of {@link ByteBuffer#readInt16}.
  
       * @function
  
       * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
  
       * @returns {number} Value read
  
       * @throws {TypeError} If `offset` is not a valid number
  
       * @throws {RangeError} If `offset` is out of bounds
  
       * @expose
  
       */
    readShort: (offset: any) => any;
    /**
  
       * Writes a 16bit unsigned integer.
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
  
       * @throws {TypeError} If `offset` or `value` is not a valid number
  
       * @throws {RangeError} If `offset` is out of bounds
  
       * @expose
  
       */
    writeUint16(value: any, offset: any): this;
    /**
  
       * Writes a 16bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint16}.
  
       * @function
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
  
       * @throws {TypeError} If `offset` or `value` is not a valid number
  
       * @throws {RangeError} If `offset` is out of bounds
  
       * @expose
  
       */
    writeUInt16: (value: any, offset: any) => this;
    /**
  
       * Reads a 16bit unsigned integer.
  
       * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
  
       * @returns {number} Value read
  
       * @throws {TypeError} If `offset` is not a valid number
  
       * @throws {RangeError} If `offset` is out of bounds
  
       * @expose
  
       */
    readUint16(offset: any): any;
    /**
  
       * Reads a 16bit unsigned integer. This is an alias of {@link ByteBuffer#readUint16}.
  
       * @function
  
       * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `2` if omitted.
  
       * @returns {number} Value read
  
       * @throws {TypeError} If `offset` is not a valid number
  
       * @throws {RangeError} If `offset` is out of bounds
  
       * @expose
  
       */
    readUInt16: (offset: any) => any;
    /**
  
       * Writes a 32bit signed integer.
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @expose
  
       */
    writeInt32(value: any, offset: any): this;
    /**
  
       * Writes a 32bit signed integer. This is an alias of {@link ByteBuffer#writeInt32}.
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @expose
  
       */
    writeInt: (value: any, offset: any) => this;
    /**
  
       * Reads a 32bit signed integer.
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @returns {number} Value read
  
       * @expose
  
       */
    readInt32(offset: any): any;
    /**
  
       * Reads a 32bit signed integer. This is an alias of {@link ByteBuffer#readInt32}.
  
       * @param {number=} offset Offset to read from. Will use and advance {@link ByteBuffer#offset} by `4` if omitted.
  
       * @returns {number} Value read
  
       * @expose
  
       */
    readInt: (offset: any) => any;
    /**
  
       * Writes a 32bit unsigned integer.
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @expose
  
       */
    writeUint32(value: any, offset: any): this;
    /**
  
       * Writes a 32bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint32}.
  
       * @function
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @expose
  
       */
    writeUInt32: (value: any, offset: any) => this;
    /**
  
       * Reads a 32bit unsigned integer.
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @returns {number} Value read
  
       * @expose
  
       */
    readUint32(offset: any): any;
    /**
  
       * Reads a 32bit unsigned integer. This is an alias of {@link ByteBuffer#readUint32}.
  
       * @function
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @returns {number} Value read
  
       * @expose
  
       */
    readUInt32: (offset: any) => any;
    /**
  
       * Writes a 32bit float.
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeFloat32(value: any, offset: any): this;
    /**
  
       * Writes a 32bit float. This is an alias of {@link ByteBuffer#writeFloat32}.
  
       * @function
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeFloat: (value: any, offset: any) => this;
    /**
  
       * Reads a 32bit float.
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @returns {number}
  
       * @expose
  
       */
    readFloat32(offset: any): any;
    /**
  
       * Reads a 32bit float. This is an alias of {@link ByteBuffer#readFloat32}.
  
       * @function
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `4` if omitted.
  
       * @returns {number}
  
       * @expose
  
       */
    readFloat: (offset: any) => any;
    /**
  
       * Writes a 64bit float.
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeFloat64(value: any, offset: any): this;
    /**
  
       * Writes a 64bit float. This is an alias of {@link ByteBuffer#writeFloat64}.
  
       * @function
  
       * @param {number} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeDouble: (value: any, offset: any) => this;
    /**
  
       * Reads a 64bit float.
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {number}
  
       * @expose
  
       */
    readFloat64(offset: any): any;
    /**
  
       * Reads a 64bit float. This is an alias of {@link ByteBuffer#readFloat64}.
  
       * @function
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {number}
  
       * @expose
  
       */
    readDouble: (offset: any) => any;
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
    append(source: any, offset: any): this;
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
    appendTo(target: any, offset: any): this;
    /**
  
       * Enables or disables assertions of argument types and offsets. Assertions are enabled by default but you can opt to
  
       *  disable them if your code already makes sure that everything is valid.
  
       * @param {boolean} assert `true` to enable assertions, otherwise `false`
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    assert(assert: any): this;
    /**
  
       * Gets the capacity of this ByteBuffer's backing buffer.
  
       * @returns {number} Capacity of the backing buffer
  
       * @expose
  
       */
    capacity(): any;
    /**
  
       * Clears this ByteBuffer's offsets by setting {@link ByteBuffer#offset} to `0` and {@link ByteBuffer#limit} to the
  
       *  backing buffer's capacity. Discards {@link ByteBuffer#markedOffset}.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    clear(): this;
    /**
  
       * Creates a cloned instance of this ByteBuffer, preset with this ByteBuffer's values for {@link ByteBuffer#offset},
  
       *  {@link ByteBuffer#markedOffset} and {@link ByteBuffer#limit}.
  
       * @param {boolean=} copy Whether to copy the backing buffer or to return another view on the same, defaults to `false`
  
       * @returns {!ByteBuffer} Cloned instance
  
       * @expose
  
       */
    clone(copy: any): ByteBuffer;
    /**
  
       * Compacts this ByteBuffer to be backed by a {@link ByteBuffer#buffer} of its contents' length. Contents are the bytes
  
       *  between {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. Will set `offset = 0` and `limit = capacity` and
  
       *  adapt {@link ByteBuffer#markedOffset} to the same relative position if set.
  
       * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
  
       * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    compact(begin: any, end: any): this;
    /**
  
       * Creates a copy of this ByteBuffer's contents. Contents are the bytes between {@link ByteBuffer#offset} and
  
       *  {@link ByteBuffer#limit}.
  
       * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
  
       * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
  
       * @returns {!ByteBuffer} Copy
  
       * @expose
  
       */
    copy(begin: any, end: any): ByteBuffer;
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
    copyTo(target: any, targetOffset: any, sourceOffset: any, sourceLimit: any): any;
    /**
  
       * Makes sure that this ByteBuffer is backed by a {@link ByteBuffer#buffer} of at least the specified capacity. If the
  
       *  current capacity is exceeded, it will be doubled. If double the current capacity is less than the required capacity,
  
       *  the required capacity will be used instead.
  
       * @param {number} capacity Required capacity
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    ensureCapacity(capacity: any): this;
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
    fill(value: any, begin: any, end: any): this;
    /**
  
       * Makes this ByteBuffer ready for a new sequence of write or relative read operations. Sets `limit = offset` and
  
       *  `offset = 0`. Make sure always to flip a ByteBuffer when all relative read or write operations are complete.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    flip(): this;
    /**
  
       * Marks an offset on this ByteBuffer to be used later.
  
       * @param {number=} offset Offset to mark. Defaults to {@link ByteBuffer#offset}.
  
       * @returns {!ByteBuffer} this
  
       * @throws {TypeError} If `offset` is not a valid number
  
       * @throws {RangeError} If `offset` is out of bounds
  
       * @see ByteBuffer#reset
  
       * @expose
  
       */
    mark(offset: any): this;
    /**
  
       * Sets the byte order.
  
       * @param {boolean} littleEndian `true` for little endian byte order, `false` for big endian
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    order(littleEndian: any): this;
    /**
  
       * Switches (to) little endian byte order.
  
       * @param {boolean=} littleEndian Defaults to `true`, otherwise uses big endian
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    LE(littleEndian: any): this;
    /**
  
       * Switches (to) big endian byte order.
  
       * @param {boolean=} bigEndian Defaults to `true`, otherwise uses little endian
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    BE(bigEndian: any): this;
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
    prepend(source: any, offset: any): this;
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
    prependTo(target: any, offset: any): this;
    /**
  
       * Gets the number of remaining readable bytes. Contents are the bytes between {@link ByteBuffer#offset} and
  
       *  {@link ByteBuffer#limit}, so this returns `limit - offset`.
  
       * @returns {number} Remaining readable bytes. May be negative if `offset > limit`.
  
       * @expose
  
       */
    remaining(): number;
    /**
  
       * Resets this ByteBuffer's {@link ByteBuffer#offset}. If an offset has been marked through {@link ByteBuffer#mark}
  
       *  before, `offset` will be set to {@link ByteBuffer#markedOffset}, which will then be discarded. If no offset has been
  
       *  marked, sets `offset = 0`.
  
       * @returns {!ByteBuffer} this
  
       * @see ByteBuffer#mark
  
       * @expose
  
       */
    reset(): this;
    /**
  
       * Resizes this ByteBuffer to be backed by a buffer of at least the given capacity. Will do nothing if already that
  
       *  large or larger.
  
       * @param {number} capacity Capacity required
  
       * @returns {!ByteBuffer} this
  
       * @throws {TypeError} If `capacity` is not a number
  
       * @throws {RangeError} If `capacity < 0`
  
       * @expose
  
       */
    resize(capacity: any): this;
    /**
  
       * Reverses this ByteBuffer's contents.
  
       * @param {number=} begin Offset to start at, defaults to {@link ByteBuffer#offset}
  
       * @param {number=} end Offset to end at, defaults to {@link ByteBuffer#limit}
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    reverse(begin: any, end: any): this;
    /**
  
       * Skips the next `length` bytes. This will just advance
  
       * @param {number} length Number of bytes to skip. May also be negative to move the offset back.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    skip(length: any): this;
    /**
  
       * Slices this ByteBuffer by creating a cloned instance with `offset = begin` and `limit = end`.
  
       * @param {number=} begin Begin offset, defaults to {@link ByteBuffer#offset}.
  
       * @param {number=} end End offset, defaults to {@link ByteBuffer#limit}.
  
       * @returns {!ByteBuffer} Clone of this ByteBuffer with slicing applied, backed by the same {@link ByteBuffer#buffer}
  
       * @expose
  
       */
    slice(begin: any, end: any): ByteBuffer;
    /**
  
       * Writes a 64bit signed integer.
  
       * @param {number|bigint} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeInt64(value: any, offset: any): this;
    /**
  
       * Writes a 64bit signed integer. This is an alias of {@link ByteBuffer#writeInt64}.
  
       * @param {number|!bigint} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeLong: (value: any, offset: any) => this;
    /**
  
       * Reads a 64bit signed integer.
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!bigint}
  
       * @expose
  
       */
    readInt64(offset: any): any;
    /**
  
       * Reads a 64bit signed integer. This is an alias of {@link ByteBuffer#readInt64}.
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!bigint}
  
       * @expose
  
       */
    readLong: (offset: any) => any;
    /**
  
       * Writes a 64bit unsigned integer.
  
       * @param {number|!bigint} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeUint64(value: any, offset: any): this;
    /**
  
       * Writes a 64bit unsigned integer. This is an alias of {@link ByteBuffer#writeUint64}.
  
       * @function
  
       * @param {number|!bigint} value Value to write
  
       * @param {number=} offset Offset to write to. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!ByteBuffer} this
  
       * @expose
  
       */
    writeUInt64: (value: any, offset: any) => this;
    /**
  
       * Reads a 64bit unsigned integer.
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!bigint}
  
       * @expose
  
       */
    readUint64(offset: any): any;
    /**
  
       * Reads a 64bit unsigned integer. This is an alias of {@link ByteBuffer#readUint64}.
  
       * @function
  
       * @param {number=} offset Offset to read from. Will use and increase {@link ByteBuffer#offset} by `8` if omitted.
  
       * @returns {!Long}
  
       * @expose
  
       */
    readUInt64: (offset: any) => any;
    /**
  
       * Returns a copy of the backing buffer that contains this ByteBuffer's contents. Contents are the bytes between
  
       *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}.
  
       * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory if
  
       *  possible. Defaults to `false`
  
       * @returns {!ArrayBuffer} Contents as an ArrayBuffer
  
       * @expose
  
       */
    toBuffer(forceCopy?: any): any;
    /**
  
       * Returns a raw buffer compacted to contain this ByteBuffer's contents. Contents are the bytes between
  
       *  {@link ByteBuffer#offset} and {@link ByteBuffer#limit}. This is an alias of {@link ByteBuffer#toBuffer}.
  
       * @function
  
       * @param {boolean=} forceCopy If `true` returns a copy, otherwise returns a view referencing the same memory.
  
       *  Defaults to `false`
  
       * @returns {!ArrayBuffer} Contents as an ArrayBuffer
  
       * @expose
  
       */
    toArrayBuffer: (forceCopy?: any) => any;
    writeVarint32(value: any, offset: any): 5 | 1 | 2 | 4 | 3 | this;
    readVarint32: (offset: any) => number | {
        value: number;
        length: number;
    };
    calculateVarint32(value: any): 5 | 1 | 2 | 4 | 3;
    writeVString(str: any, offset?: any): number | this;
    readVString(offset: any): any;
    readUTF8String(length: any, metrics: any, offset: any): any;
}
