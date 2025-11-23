import { PrivateKey } from './helpers/PrivateKey';
import { PublicKey } from './helpers/PublicKey';
import { Signature } from './helpers/Signature';
import { call } from './helpers/call';
import { config } from './config';
import { Memo } from './helpers/memo';
import * as utils from './helpers/utils';
import { Operation, Transaction as TransactionType, SignedTransaction, DigestData } from './types';
/** Transaction for Hive blockchain */
declare class Transaction {
    created: boolean;
    transaction: TransactionType | null;
    signedTransaction: SignedTransaction | null;
    txId?: string;
    /** A transaction object could be passed or created later
     * @param {{}} trx Object of transaction - Optional
     */
    constructor(trx?: TransactionType | SignedTransaction | null);
    /** Create the transaction by operations
     * @param {Operation[]} operations
     * @param {number} expiration Optional - Default 60 seconds
     */
    create(operations: Operation[], expiration?: number): Promise<TransactionType>;
    /** Sign the transaction by key or keys[] (supports multi signature).
     * It is also possible to sign with one key at a time for multi signature.
     * @param {PrivateKey | PrivateKey[]} keys single key or multiple keys in array
     */
    sign(keys: PrivateKey | PrivateKey[]): SignedTransaction;
    /** Broadcast the signed transaction. */
    broadcast(timeout?: number, retry?: number): Promise<any>;
    /** Return the transaction hash which can be used to verify against a signature */
    digest(): DigestData;
    /**
     * Add a signature to already created transaction. You can add multiple signatures to one transaction but one at a time.
     * This method is used when you sign your transaction with other tools instead of built-in .sign() method.
     */
    addSignature(signature?: string): SignedTransaction;
}
export { Transaction, PrivateKey, call, config, PublicKey, Signature, Memo, utils, };
declare const _default: {
    Transaction: typeof Transaction;
    PrivateKey: typeof PrivateKey;
    call: (method: any, params?: never[], timeout?: number, retry?: number) => any;
    config: {
        node: string[];
        chain_id: string;
        address_prefix: string;
        axiosAdapter: null;
        timeout: number;
        retry: number;
        healthcheckInterval: number;
    };
    PublicKey: typeof PublicKey;
    Signature: typeof Signature;
    Memo: {
        decode: (privateKey: string | PrivateKey, memo: string) => Promise<string>;
        encode: (privateKey: string | PrivateKey, publicKey: string | PublicKey, memo: string, testNonce?: bigint) => Promise<string>;
    };
    utils: typeof utils;
};
export default _default;
