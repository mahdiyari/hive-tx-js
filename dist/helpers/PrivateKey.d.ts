import { PublicKey } from './PublicKey';
import { Signature } from './Signature';
export type KeyRole = 'owner' | 'active' | 'posting' | 'memo';
/** ECDSA (secp256k1) private key. */
export declare class PrivateKey {
    key: Uint8Array;
    constructor(key: Uint8Array);
    /** Convenience to create a new instance from WIF string or Uint8Array */
    static from(value: string | Uint8Array): PrivateKey;
    /** Create a new instance from a WIF-encoded key. */
    static fromString(wif: string): PrivateKey;
    /** Create a new instance from a seed. */
    static fromSeed(seed: string): PrivateKey;
    /** Create key from username and password. */
    static fromLogin(username: string, password: string, role?: KeyRole): PrivateKey;
    /**
     * Sign message.
     * @param message 32-byte message.
     */
    sign(message: Uint8Array): Signature;
    /** Derive the public key for this private key. */
    createPublic(prefix?: string): PublicKey;
    /** Return a WIF-encoded representation of the key. */
    toString(): string;
    /**
     * Used by `utils.inspect` and `console.log` in node.ts. Does not show the full key
     * to get the full encoded key you need to explicitly call {@link toString}.
     */
    inspect(): string;
    /**
     * Get shared secret for memo cryptography
     */
    getSharedSecret(publicKey: PublicKey): Uint8Array;
    /**
     * Returns a randomly generated instance of PrivateKey
     * Might take up to 250ms
     */
    static randomKey(): PrivateKey;
}
