"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKey = void 0;
const crypto_1 = require("./crypto");
const bs58_1 = __importDefault(require("bs58"));
const config_1 = require("../config");
const secp256k1_1 = require("@noble/curves/secp256k1");
const DEFAULT_ADDRESS_PREFIX = config_1.config.address_prefix;
/** ECDSA (secp256k1) public key. */
class PublicKey {
    constructor(key, prefix) {
        this.key = key;
        this.prefix = prefix ?? DEFAULT_ADDRESS_PREFIX;
        // assert(secp256k1.publicKeyVerify(key), 'invalid public key')
    }
    /** Create a new instance from a WIF-encoded key. */
    static fromString(wif) {
        const { key, prefix } = decodePublic(wif);
        return new PublicKey(key, prefix);
    }
    /** Create a new instance. */
    static from(value) {
        if (value instanceof PublicKey) {
            return value;
        }
        else {
            return PublicKey.fromString(value);
        }
    }
    /**
     * Verify a 32-byte signature.
     * @param message 32-byte message to verify.
     * @param signature Signature to verify.
     */
    verify(message, signature) {
        return secp256k1_1.secp256k1.verify(signature.data, message, this.key);
    }
    /** Return a WIF-encoded representation of the key. */
    toString() {
        return encodePublic(this.key, this.prefix);
    }
    /** Return JSON representation of this key, same as toString(). */
    toJSON() {
        return this.toString();
    }
    inspect() {
        return `PublicKey: ${this.toString()}`;
    }
}
exports.PublicKey = PublicKey;
const encodePublic = (key, prefix) => {
    const checksum = (0, crypto_1.ripemd160)(key);
    return (prefix + bs58_1.default.encode(new Uint8Array([...key, ...checksum.subarray(0, 4)])));
};
/** Decode bs58+ripemd160-checksum encoded public key. */
const decodePublic = (encodedKey) => {
    const prefix = encodedKey.slice(0, 3);
    encodedKey = encodedKey.slice(3);
    const buffer = bs58_1.default.decode(encodedKey);
    const key = buffer.subarray(0, buffer.length - 4);
    return { key: key, prefix };
};
