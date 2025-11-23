"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionDigest = exports.signTransaction = void 0;
const ByteBuffer_1 = require("../helpers/ByteBuffer");
// import ByteBuffer2 from 'bytebuffer-hex-custom'
const config_1 = require("../config");
const crypto_1 = require("../helpers/crypto");
const serializer_1 = require("../helpers/serializer");
const uint8Array_1 = require("../helpers/uint8Array");
const CHAIN_ID = (0, uint8Array_1.hexToUint8Array)(config_1.config.chain_id);
/**
 * Sign a transaction by keys (supports multi signature)
 * @param transaction - transaction to be signed
 * @param keys - Array of keys<Buffer>
 */
const signTransaction = (transaction, keys) => {
    const { digest, txId } = (0, exports.transactionDigest)(transaction, CHAIN_ID);
    const signedTransaction = { ...transaction };
    if (!signedTransaction.signatures) {
        signedTransaction.signatures = [];
    }
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    for (const key of keys) {
        const signature = key.sign(digest);
        signedTransaction.signatures.push(signature.customToString());
    }
    return { signedTransaction, txId };
};
exports.signTransaction = signTransaction;
/** Serialize transaction */
const transactionDigest = (transaction, chainId = CHAIN_ID) => {
    const buffer = new ByteBuffer_1.ByteBuffer(ByteBuffer_1.ByteBuffer.DEFAULT_CAPACITY, ByteBuffer_1.ByteBuffer.LITTLE_ENDIAN);
    // const buffer2 = new ByteBuffer2(
    //   ByteBuffer2.DEFAULT_CAPACITY,
    //   ByteBuffer2.LITTLE_ENDIAN
    // )
    const temp = { ...transaction };
    // const temp2 = { ...transaction }
    try {
        serializer_1.Serializer.Transaction(buffer, temp);
        // Serializer.Transaction(buffer2, temp2)
    }
    catch (cause) {
        throw new Error('Unable to serialize transaction: ' + cause);
    }
    buffer.flip();
    // console.log(buffer.toBuffer())
    // console.log(buffer2.toBuffer())
    const transactionData = new Uint8Array(buffer.toBuffer());
    // console.log(uint8ArrayToHex(transactionData))
    const txId = (0, uint8Array_1.uint8ArrayToHex)((0, crypto_1.sha256)(transactionData)).slice(0, 40);
    const digest = (0, crypto_1.sha256)(new Uint8Array([...chainId, ...transactionData]));
    return { digest, txId };
};
exports.transactionDigest = transactionDigest;
