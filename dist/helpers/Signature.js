"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
const PublicKey_1 = require("./PublicKey");
const secp256k1_1 = require("@noble/curves/secp256k1");
const uint8Array_1 = require("./uint8Array");
/** ECDSA (secp256k1) signature. */
class Signature {
    constructor(data, recovery, compressed) {
        this.data = data;
        this.recovery = recovery;
        this.compressed = compressed ?? true;
    }
    static from(string) {
        if (typeof string === 'string') {
            const temp = (0, uint8Array_1.hexToUint8Array)(string);
            let recovery = parseInt((0, uint8Array_1.uint8ArrayToHex)(temp.subarray(0, 1)), 16) - 31;
            let compressed = true;
            // non-compressed signatures have -4
            // https://github.com/bitcoin/bitcoin/blob/95ea54ba089610019a74c1176a2c7c0dba144b1c/src/key.cpp#L257
            if (recovery < 0) {
                compressed = false;
                recovery = recovery + 4;
            }
            const data = temp.subarray(1);
            return new Signature(data, recovery, compressed);
        }
        else {
            throw new Error('Expected string for data');
        }
    }
    toBuffer() {
        const buffer = new Uint8Array(65).fill(0);
        if (this.compressed) {
            buffer[0] = (this.recovery + 31) & 0xff;
        }
        else {
            buffer[0] = (this.recovery + 27) & 0xff;
        }
        buffer.set(this.data, 1);
        return buffer;
    }
    customToString() {
        return (0, uint8Array_1.uint8ArrayToHex)(this.toBuffer());
    }
    getPublicKey(message) {
        if ((message instanceof Uint8Array && message.length !== 32) ||
            (typeof message === 'string' && message.length !== 64)) {
            throw new Error('Expected a valid sha256 hash as message');
        }
        const sig = secp256k1_1.secp256k1.Signature.fromCompact(this.data);
        const temp = new secp256k1_1.secp256k1.Signature(sig.r, sig.s, this.recovery);
        return new PublicKey_1.PublicKey(temp.recoverPublicKey(message).toRawBytes());
    }
}
exports.Signature = Signature;
