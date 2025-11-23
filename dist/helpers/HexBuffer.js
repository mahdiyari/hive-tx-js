"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexBuffer = void 0;
const uint8Array_1 = require("./uint8Array");
/** Buffer wrapper that serializes to a hex-encoded string. */
class HexBuffer {
    /** Convenience to create a new HexBuffer, does not copy data if value passed is already a buffer. */
    static from(value) {
        if (value instanceof HexBuffer) {
            return value;
        }
        else if (value instanceof Uint8Array) {
            return new HexBuffer(value);
        }
        else if (typeof value === 'string') {
            return new HexBuffer((0, uint8Array_1.hexToUint8Array)(value));
        }
        else {
            return new HexBuffer(new Uint8Array(value));
        }
    }
    constructor(buffer) {
        this.buffer = buffer;
    }
    toString(encoding = 'hex') {
        return (0, uint8Array_1.uint8ArrayToHex)(this.buffer);
    }
    toJSON() {
        return this.toString();
    }
}
exports.HexBuffer = HexBuffer;
