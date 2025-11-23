export declare const encrypt: (privateKey: any, publicKey: any, message: any, nonce?: bigint) => Promise<{
    nonce: bigint | BigInt;
    message: any;
    checksum: any;
}>;
export declare const decrypt: (privateKey: any, publicKey: any, nonce: any, message: any, checksum: any) => Promise<any>;
/**
 * This method does not use a checksum, the returned data must be validated some other way.
 * @arg {string|Uint8Array} plaintext - binary format
 * @return {Uint8Array} binary
 */
export declare const cryptoJsEncrypt: (message: any, tag: any, iv: any) => Promise<any>;
