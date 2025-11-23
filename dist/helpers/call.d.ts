/**
 * Make calls to hive node and retry - Only if provided config.node is an array
 * @param {string}method - e.g. condenser_api.get_dynamic_global_properties
 * @param {[any]|object}params - an array or object
 * @param {number}timeout - optional - default 5 seconds
 * @param {number}retry - optional - default 5 retries before throw
 */
export declare const call: (method: any, params?: never[], timeout?: number, retry?: number) => any;
