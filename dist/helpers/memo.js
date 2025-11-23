"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memo = void 0;
// @ts-nocheck
const bs58_1 = __importDefault(require("bs58"));
const ByteBuffer_1 = require("./ByteBuffer");
const serializer_1 = require("./serializer");
const PrivateKey_1 = require("./PrivateKey");
const Aes = __importStar(require("./aes"));
const PublicKey_1 = require("./PublicKey");
const deserializer_1 = require("./deserializer");
/**
 * Memo/Any message encoding using AES (aes-cbc algorithm)
 * @param privateKey Private memo key of sender
 * @param publicKey public memo key of recipient
 * @param memo message to be encrypted
 * @param testNonce nonce with high entropy
 */
const encode = async (privateKey, publicKey, memo, testNonce) => {
    if (!memo.startsWith('#')) {
        return memo;
    }
    memo = memo.substring(1);
    await checkEncryption();
    privateKey = toPrivateObj(privateKey);
    publicKey = toPublicObj(publicKey);
    const mbuf = new ByteBuffer_1.ByteBuffer(ByteBuffer_1.ByteBuffer.DEFAULT_CAPACITY, ByteBuffer_1.ByteBuffer.LITTLE_ENDIAN);
    mbuf.writeVString(memo);
    const memoBuffer = new Uint8Array(mbuf.copy(0, mbuf.offset).toBuffer());
    const { nonce, message, checksum } = await Aes.encrypt(privateKey, publicKey, memoBuffer, testNonce);
    const mbuf2 = new ByteBuffer_1.ByteBuffer(ByteBuffer_1.ByteBuffer.DEFAULT_CAPACITY, ByteBuffer_1.ByteBuffer.LITTLE_ENDIAN);
    serializer_1.Serializer.Memo(mbuf2, {
        check: checksum,
        encrypted: message,
        from: privateKey.createPublic(),
        nonce,
        to: publicKey,
    });
    mbuf2.flip();
    const data = new Uint8Array(mbuf2.toBuffer());
    return '#' + bs58_1.default.encode(data);
};
/**
 * Encrypted memo/message decryption
 * @param privateKey Private memo key of recipient
 * @param memo Encrypted message/memo
 */
const decode = async (privateKey, memo) => {
    if (!memo.startsWith('#')) {
        return memo;
    }
    memo = memo.substring(1);
    await checkEncryption();
    privateKey = toPrivateObj(privateKey);
    // memo = bs58.decode(memo)
    let memoBuffer = deserializer_1.Deserializer.Memo(bs58_1.default.decode(memo));
    const { from, to, nonce, check, encrypted } = memoBuffer;
    const pubkey = privateKey.createPublic().toString();
    const otherpub = pubkey === new PublicKey_1.PublicKey(from.key).toString()
        ? new PublicKey_1.PublicKey(to.key)
        : new PublicKey_1.PublicKey(from.key);
    memoBuffer = await Aes.decrypt(privateKey, otherpub, nonce, encrypted, check);
    const mbuf = new ByteBuffer_1.ByteBuffer(ByteBuffer_1.ByteBuffer.DEFAULT_CAPACITY, ByteBuffer_1.ByteBuffer.LITTLE_ENDIAN);
    mbuf.append(memoBuffer);
    mbuf.flip();
    return '#' + mbuf.readVString();
};
let encodeTest;
const checkEncryption = async () => {
    if (encodeTest === undefined) {
        let plaintext;
        encodeTest = true; // prevent infinate looping
        try {
            const wif = '5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw';
            const pubkey = 'STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA';
            const cyphertext = await encode(wif, pubkey, '#memo爱');
            plaintext = await decode(wif, cyphertext);
        }
        finally {
            encodeTest = plaintext === '#memo爱';
        }
    }
    if (encodeTest === false) {
        throw new Error('This environment does not support encryption.');
    }
};
const toPrivateObj = (o) => {
    if (typeof o === 'string') {
        return PrivateKey_1.PrivateKey.fromString(o);
    }
    else {
        return o;
    }
};
const toPublicObj = (o) => {
    if (typeof o === 'string') {
        return PublicKey_1.PublicKey.fromString(o);
    }
    else {
        return o;
    }
};
exports.Memo = {
    decode,
    encode,
};
