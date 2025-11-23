import { PublicKey } from './PublicKey';
/** ECDSA (secp256k1) signature. */
export declare class Signature {
    data: Uint8Array;
    recovery: number;
    private compressed;
    constructor(data: Uint8Array, recovery: number, compressed?: boolean);
    static from(string: any): Signature;
    toBuffer(): Uint8Array<ArrayBuffer>;
    customToString(): string;
    getPublicKey(message: Uint8Array | string): PublicKey;
}
