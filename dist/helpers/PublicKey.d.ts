import { Signature } from './Signature';
/** ECDSA (secp256k1) public key. */
export declare class PublicKey {
    key: Uint8Array;
    prefix: string;
    constructor(key: Uint8Array, prefix?: string);
    /** Create a new instance from a WIF-encoded key. */
    static fromString(wif: string): PublicKey;
    /** Create a new instance. */
    static from(value: string | PublicKey): PublicKey;
    /**
     * Verify a 32-byte signature.
     * @param message 32-byte message to verify.
     * @param signature Signature to verify.
     */
    verify(message: Uint8Array, signature: Signature): boolean;
    /** Return a WIF-encoded representation of the key. */
    toString(): string;
    /** Return JSON representation of this key, same as toString(). */
    toJSON(): string;
    inspect(): string;
}
