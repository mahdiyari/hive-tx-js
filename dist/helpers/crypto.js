"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ripemd160 = exports.sha512 = exports.sha256 = void 0;
const sha256_1 = require("@noble/hashes/sha256");
const sha512_1 = require("@noble/hashes/sha512");
const ripemd160_1 = require("@noble/hashes/ripemd160");
const sha256 = (input) => {
    return (0, sha256_1.sha256)(input);
    // return Uint8Array.from(sh256(input))
};
exports.sha256 = sha256;
const sha512 = (input) => {
    return (0, sha512_1.sha512)(input);
    // return Uint8Array.from(sh512(input))
};
exports.sha512 = sha512;
const ripemd160 = (input) => {
    return (0, ripemd160_1.ripemd160)(input);
    // return Uint8Array.from(rp160(input))
};
exports.ripemd160 = ripemd160;
