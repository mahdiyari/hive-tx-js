"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastTransaction = void 0;
// @ts-nocheck
const config_1 = require("../config");
const call_1 = require("../helpers/call");
/** Broadcast signed transaction */
const broadcastTransaction = async (signedTransaction, timeout = config_1.config.timeout, retry = config_1.config.retry) => {
    const result = await (0, call_1.call)('condenser_api.broadcast_transaction', [signedTransaction], timeout, retry);
    return result;
};
exports.broadcastTransaction = broadcastTransaction;
