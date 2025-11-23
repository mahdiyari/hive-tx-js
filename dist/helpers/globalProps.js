"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalProps = void 0;
const call_1 = require("./call");
/** return global properties */
const getGlobalProps = async () => {
    const res = await (0, call_1.call)('condenser_api.get_dynamic_global_properties');
    if (!res) {
        throw new Error("Couldn't resolve global properties");
    }
    if (res && (!res.id || !res.result)) {
        throw new Error('Bad response @ global props');
    }
    return res.result;
};
exports.getGlobalProps = getGlobalProps;
