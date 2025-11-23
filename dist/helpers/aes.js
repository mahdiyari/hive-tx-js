"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoJsEncrypt = exports.decrypt = exports.encrypt = void 0;
// @ts-nocheck
const ByteBuffer_1 = require("./ByteBuffer");
const crypto_1 = require("./crypto");
const aes_1 = require("@noble/ciphers/aes");
const secp256k1_1 = require("@noble/curves/secp256k1");
const encrypt = (privateKey, publicKey, message, nonce = uniqueNonce()) => crypt(privateKey, publicKey, nonce, message);
exports.encrypt = encrypt;
const decrypt = async (privateKey, publicKey, nonce, message, checksum) => {
    const d = await crypt(privateKey, publicKey, nonce, message, checksum);
    return d.message;
};
exports.decrypt = decrypt;
/**
 * @arg {Uint8Array} message - Encrypted or plain text message (see checksum)
 * @arg {number} checksum - shared secret checksum (null to encrypt, non-null to decrypt)
 */
const crypt = async (privateKey, publicKey, nonce, message, checksum) => {
    const nonceL = nonce instanceof BigInt ? nonce : BigInt(nonce);
    const S = privateKey.getSharedSecret(publicKey);
    let ebuf = new ByteBuffer_1.ByteBuffer(ByteBuffer_1.ByteBuffer.DEFAULT_CAPACITY, ByteBuffer_1.ByteBuffer.LITTLE_ENDIAN);
    ebuf.writeUint64(nonceL);
    ebuf.append(S);
    ebuf.flip();
    ebuf = new Uint8Array(ebuf.toBuffer());
    const encryptionKey = (0, crypto_1.sha512)(ebuf);
    const iv = encryptionKey.subarray(32, 48);
    const tag = encryptionKey.subarray(0, 32);
    // check if first 64 bit of sha256 hash treated as uint64_t truncated to 32 bits.
    const check = (0, crypto_1.sha256)(encryptionKey).subarray(0, 4);
    const cbuf = new ByteBuffer_1.ByteBuffer(ByteBuffer_1.ByteBuffer.DEFAULT_CAPACITY, ByteBuffer_1.ByteBuffer.LITTLE_ENDIAN);
    cbuf.append(check);
    cbuf.flip();
    const check32 = cbuf.readUint32();
    if (checksum) {
        if (check32 !== checksum) {
            throw new Error('Invalid key');
        }
        message = await cryptoJsDecrypt(message, tag, iv);
    }
    else {
        message = await (0, exports.cryptoJsEncrypt)(message, tag, iv);
    }
    return { nonce: nonceL, message, checksum: check32 };
};
/**
 * This method does not use a checksum, the returned data must be validated some other way.
 * @arg {string|Uint8Array} ciphertext - binary format
 * @return {Uint8Array} the decrypted message
 */
const cryptoJsDecrypt = async (message, tag, iv) => {
    let messageBuffer = message;
    const decipher = (0, aes_1.cbc)(tag, iv);
    messageBuffer = await decipher.decrypt(messageBuffer);
    // return Uint8Array.from(messageBuffer)
    return messageBuffer;
};
/**
 * This method does not use a checksum, the returned data must be validated some other way.
 * @arg {string|Uint8Array} plaintext - binary format
 * @return {Uint8Array} binary
 */
const cryptoJsEncrypt = async (message, tag, iv) => {
    let messageBuffer = message;
    const cipher = (0, aes_1.cbc)(tag, iv);
    messageBuffer = await cipher.encrypt(messageBuffer);
    // return Uint8Array.from(messageBuffer)
    return messageBuffer;
};
exports.cryptoJsEncrypt = cryptoJsEncrypt;
/** @return {string} unique 64 bit unsigned number string.  Being time based,
 * this is careful to never choose the same nonce twice.  This value could
 * clsbe recorded in the blockchain for a long time.
 */
let uniqueNonceEntropy = null;
const uniqueNonce = () => {
    if (uniqueNonceEntropy === null) {
        const uint8randomArr = new Uint8Array(2);
        for (let i = 0; i < 2; ++i) {
            uint8randomArr[i] = secp256k1_1.secp256k1.utils.randomPrivateKey()[i];
        }
        uniqueNonceEntropy = Math.round((uint8randomArr[0] << 8) | uint8randomArr[1]);
    }
    let long = BigInt(Date.now());
    const entropy = ++uniqueNonceEntropy % 0xffff;
    long = (long << BigInt(16)) | BigInt(entropy);
    return long;
};
// const toLongObj = (o) => (o ? (Long.isLong(o) ? o : Long.fromString(o)) : o)
