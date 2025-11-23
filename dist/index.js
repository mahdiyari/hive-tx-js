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
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.Memo = exports.Signature = exports.PublicKey = exports.config = exports.call = exports.PrivateKey = exports.Transaction = void 0;
const signTransaction_1 = require("./transactions/signTransaction");
const createTransaction_1 = require("./transactions/createTransaction");
const broadcastTransaction_1 = require("./transactions/broadcastTransaction");
const PrivateKey_1 = require("./helpers/PrivateKey");
Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function () { return PrivateKey_1.PrivateKey; } });
const PublicKey_1 = require("./helpers/PublicKey");
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return PublicKey_1.PublicKey; } });
const Signature_1 = require("./helpers/Signature");
Object.defineProperty(exports, "Signature", { enumerable: true, get: function () { return Signature_1.Signature; } });
const call_1 = require("./helpers/call");
Object.defineProperty(exports, "call", { enumerable: true, get: function () { return call_1.call; } });
const config_1 = require("./config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } });
const memo_1 = require("./helpers/memo");
Object.defineProperty(exports, "Memo", { enumerable: true, get: function () { return memo_1.Memo; } });
const utils = __importStar(require("./helpers/utils"));
exports.utils = utils;
/** Transaction for Hive blockchain */
class Transaction {
    /** A transaction object could be passed or created later
     * @param {{}} trx Object of transaction - Optional
     */
    constructor(trx = null) {
        this.signedTransaction = null;
        this.created = !!trx;
        this.transaction = trx && !('signatures' in trx) ? trx : null;
        this.signedTransaction = trx && 'signatures' in trx ? trx : null;
    }
    /** Create the transaction by operations
     * @param {Operation[]} operations
     * @param {number} expiration Optional - Default 60 seconds
     */
    async create(operations, expiration = 60) {
        this.transaction = await (0, createTransaction_1.createTransaction)(operations, expiration);
        this.created = true;
        return this.transaction;
    }
    /** Sign the transaction by key or keys[] (supports multi signature).
     * It is also possible to sign with one key at a time for multi signature.
     * @param {PrivateKey | PrivateKey[]} keys single key or multiple keys in array
     */
    sign(keys) {
        if (!this.created) {
            throw new Error('First create a transaction by .create(operations)');
        }
        if (this.signedTransaction) {
            const { signedTransaction, txId } = (0, signTransaction_1.signTransaction)(this.signedTransaction, keys);
            this.signedTransaction = signedTransaction;
            this.txId = txId;
        }
        else if (this.transaction) {
            const { signedTransaction, txId } = (0, signTransaction_1.signTransaction)(this.transaction, keys);
            this.signedTransaction = signedTransaction;
            this.txId = txId;
        }
        else {
            throw new Error('No transaction to sign');
        }
        return this.signedTransaction;
    }
    /** Broadcast the signed transaction. */
    async broadcast(timeout = 5, retry = 5) {
        if (!this.created) {
            throw new Error('First create a transaction by .create(operations)');
        }
        if (!this.signedTransaction) {
            throw new Error('First sign the transaction by .sign(keys)');
        }
        const result = await (0, broadcastTransaction_1.broadcastTransaction)(this.signedTransaction, timeout, retry);
        if (result.error) {
            // When we retry, we might have already broadcasted the transaction
            // So catch duplicate trx error and return trx id
            if (result.error.message.includes('Duplicate transaction check failed')) {
                return {
                    id: 1,
                    jsonrpc: '2.0',
                    result: { tx_id: this.txId, status: 'unkown' },
                };
            }
            return result;
        }
        if (!this.txId) {
            this.txId = this.digest().txId;
        }
        return {
            id: 1,
            jsonrpc: '2.0',
            result: { tx_id: this.txId, status: 'unkown' },
        };
    }
    /** Return the transaction hash which can be used to verify against a signature */
    digest() {
        if (!this.created || !this.transaction) {
            throw new Error('First create a transaction by .create(operations)');
        }
        return (0, signTransaction_1.transactionDigest)(this.transaction);
    }
    /**
     * Add a signature to already created transaction. You can add multiple signatures to one transaction but one at a time.
     * This method is used when you sign your transaction with other tools instead of built-in .sign() method.
     */
    addSignature(signature = '') {
        if (!this.created || !this.transaction) {
            throw new Error('First create a transaction by .create(operations)');
        }
        if (typeof signature !== 'string') {
            throw new Error('Signature must be string');
        }
        if (signature.length !== 130) {
            throw new Error('Signature must be 130 characters long');
        }
        if (!this.signedTransaction) {
            this.signedTransaction = {
                ...this.transaction,
                signatures: [],
            };
        }
        this.signedTransaction.signatures.push(signature);
        return this.signedTransaction;
    }
}
exports.Transaction = Transaction;
exports.default = {
    Transaction,
    PrivateKey: PrivateKey_1.PrivateKey,
    call: call_1.call,
    config: config_1.config,
    PublicKey: PublicKey_1.PublicKey,
    Signature: Signature_1.Signature,
    Memo: memo_1.Memo,
    utils,
};
