"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deserializer = void 0;
// @ts-nocheck
const ByteBuffer_1 = require("./ByteBuffer");
const PublicKey_1 = require("./PublicKey");
const PublicKeyDeserializer = (buf) => {
    const c = fixedBuf(buf, 33);
    return new PublicKey_1.PublicKey(c);
};
const UInt64Deserializer = (b) => {
    b.flip();
    return b.readUint64();
};
const UInt32Deserializer = (b) => {
    b.flip();
    return b.readUint32();
};
const BinaryDeserializer = (b) => {
    b.flip();
    const len = b.readVarint32();
    const bCopy = b.copy(b.offset, b.offset + len);
    b.skip(len);
    return new Uint8Array(bCopy.toBuffer());
};
const BufferDeserializer = (keyDeserializers) => (buf) => {
    const obj = {};
    for (const [key, deserializer] of keyDeserializers) {
        try {
            // Decodes a binary encoded string to a ByteBuffer.
            const temp = new ByteBuffer_1.ByteBuffer(ByteBuffer_1.ByteBuffer.DEFAULT_CAPACITY, ByteBuffer_1.ByteBuffer.LITTLE_ENDIAN);
            buf = temp.append(buf);
            obj[key] = deserializer(buf);
        }
        catch (error) {
            error.message = `${key}: ${error.message}`;
            throw error;
        }
    }
    return obj;
};
function fixedBuf(b, len) {
    if (!b) {
        throw Error('No buffer found on first parameter');
    }
    else {
        b.flip();
        const bCopy = b.copy(b.offset, b.offset + len);
        b.skip(len);
        return new Uint8Array(bCopy.toBuffer());
    }
}
const EncryptedMemoDeserializer = BufferDeserializer([
    ['from', PublicKeyDeserializer],
    ['to', PublicKeyDeserializer],
    ['nonce', UInt64Deserializer],
    ['check', UInt32Deserializer],
    ['encrypted', BinaryDeserializer]
]);
exports.Deserializer = {
    Memo: EncryptedMemoDeserializer
};
