"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKey = void 0;
const bs58_1 = __importDefault(require("bs58"));
const secp256k1_1 = require("@noble/curves/secp256k1");
const config_1 = require("../config");
const crypto_1 = require("./crypto");
const PublicKey_1 = require("./PublicKey");
const Signature_1 = require("./Signature");
const NETWORK_ID = new Uint8Array([0x80]);
const DEFAULT_ADDRESS_PREFIX = config_1.config.address_prefix;
/** ECDSA (secp256k1) private key. */
class PrivateKey {
    constructor(key) {
        this.key = key;
        try {
            secp256k1_1.secp256k1.getPublicKey(key);
        }
        catch (e) {
            throw new Error('invalid private key');
        }
    }
    /** Convenience to create a new instance from WIF string or Uint8Array */
    static from(value) {
        if (typeof value === 'string') {
            return PrivateKey.fromString(value);
        }
        else {
            return new PrivateKey(value);
        }
    }
    /** Create a new instance from a WIF-encoded key. */
    static fromString(wif) {
        return new PrivateKey(decodePrivate(wif).subarray(1));
    }
    /** Create a new instance from a seed. */
    static fromSeed(seed) {
        return new PrivateKey((0, crypto_1.sha256)(seed));
    }
    /** Create key from username and password. */
    static fromLogin(username, password, role = 'active') {
        const seed = username + role + password;
        return PrivateKey.fromSeed(seed);
    }
    /**
     * Sign message.
     * @param message 32-byte message.
     */
    sign(message) {
        const options = {
            extraEntropy: true,
            lowS: true,
        };
        const rv = secp256k1_1.secp256k1.sign(message, this.key, options);
        return Signature_1.Signature.from((rv.recovery + 31).toString(16) + rv.toCompactHex());
    }
    /** Derive the public key for this private key. */
    createPublic(prefix) {
        return new PublicKey_1.PublicKey(secp256k1_1.secp256k1.getPublicKey(this.key), prefix);
    }
    /** Return a WIF-encoded representation of the key. */
    toString() {
        return encodePrivate(new Uint8Array([...NETWORK_ID, ...this.key]));
    }
    /**
     * Used by `utils.inspect` and `console.log` in node.ts. Does not show the full key
     * to get the full encoded key you need to explicitly call {@link toString}.
     */
    inspect() {
        const key = this.toString();
        return `PrivateKey: ${key.slice(0, 6)}...${key.slice(-6)}`;
    }
    /**
     * Get shared secret for memo cryptography
     */
    getSharedSecret(publicKey) {
        const s = secp256k1_1.secp256k1.getSharedSecret(this.key, publicKey.key);
        // strip the parity byte
        return (0, crypto_1.sha512)(s.subarray(1));
    }
    /**
     * Returns a randomly generated instance of PrivateKey
     * Might take up to 250ms
     */
    static randomKey() {
        return new PrivateKey(secp256k1_1.secp256k1.utils.randomPrivateKey());
    }
}
exports.PrivateKey = PrivateKey;
const doubleSha256 = (input) => {
    const dbl = (0, crypto_1.sha256)((0, crypto_1.sha256)(input));
    return dbl;
};
/** Encode bs58+doubleSha256-checksum private key. */
const encodePrivate = (key) => {
    // assert.equal(key.readUInt8(0), 0x80, 'private key network id mismatch')
    const checksum = doubleSha256(key);
    return bs58_1.default.encode(new Uint8Array([...key, ...checksum.slice(0, 4)]));
};
/** Decode bs58+doubleSha256-checksum encoded private key. */
const decodePrivate = (encodedKey) => {
    const buffer = bs58_1.default.decode(encodedKey);
    // assert.deepEqual(buffer.slice(0, 1), NETWORK_ID, 'private key network id mismatch')
    // const checksum = buffer.slice(-4)
    const key = buffer.slice(0, -4);
    // const checksumVerify = doubleSha256(key).slice(0, 4)
    // assert.deepEqual(checksumVerify, checksum, 'private key checksum mismatch')
    return key;
};
