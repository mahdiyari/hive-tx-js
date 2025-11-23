"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
const globalProps_1 = require("../helpers/globalProps");
const uint8Array_1 = require("../helpers/uint8Array");
/** Create transaction by operations */
const createTransaction = async (operations, exp) => {
    const expireTime = exp ? 1000 * exp : 1000 * 60;
    const props = await (0, globalProps_1.getGlobalProps)();
    const refBlockNum = props.head_block_number & 0xffff;
    const uintArray = (0, uint8Array_1.hexToUint8Array)(props.head_block_id);
    const dataView = new DataView(uintArray.buffer);
    const refBlockPrefix = dataView.getUint32(4, true);
    const expiration = new Date(Date.now() + expireTime)
        .toISOString()
        .slice(0, -5);
    const extensions = [];
    return {
        expiration,
        extensions,
        operations,
        ref_block_num: refBlockNum,
        ref_block_prefix: refBlockPrefix
    };
};
exports.createTransaction = createTransaction;
