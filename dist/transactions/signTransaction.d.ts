import { PrivateKey } from '../helpers/PrivateKey';
import { Transaction as TransactionType, SignedTransaction } from '../types';
/**
 * Sign a transaction by keys (supports multi signature)
 * @param transaction - transaction to be signed
 * @param keys - Array of keys<Buffer>
 */
export declare const signTransaction: (transaction: TransactionType | SignedTransaction, keys: PrivateKey | PrivateKey[]) => {
    signedTransaction: SignedTransaction;
    txId: string;
};
/** Serialize transaction */
export declare const transactionDigest: (transaction: any, chainId?: Uint8Array<ArrayBuffer>) => {
    digest: Uint8Array<ArrayBufferLike>;
    txId: string;
};
