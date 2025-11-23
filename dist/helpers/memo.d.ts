import { PrivateKey } from './PrivateKey';
import { PublicKey } from './PublicKey';
export type Memo = {
    encode(privateKey: string | PrivateKey, publicKey: string | PublicKey, memo: string, testNonce?: any): Promise<string>;
    decode(privateKey: string | PrivateKey, memo: string): Promise<string>;
};
export declare const Memo: {
    decode: (privateKey: string | PrivateKey, memo: string) => Promise<string>;
    encode: (privateKey: string | PrivateKey, publicKey: string | PublicKey, memo: string, testNonce?: bigint) => Promise<string>;
};
