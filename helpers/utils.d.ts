/** Return null for a valid username */
export function validateUsername(username: string): null | string

/**
 * Make bitmask filter to be used with get_account_history call
 * @param allowedOperations Array of operations index numbers
 * @example
 * ```js
 * import { call } from 'hive-tx'
 * import { makeBitMaskFilter, operations as op } from 'hive-tx/helpers/utils.js'
 * const filter = makeBitMaskFilter([
 *  op.transfer,
 *  op.transfer_to_vesting
 * ])
 * call('condenser_api.get_account_history', ['mahdiyari', -1, 1, ...filter])
 *  .then(res => console.log(res))
 * ```
 */
export function makeBitMaskFilter(allowedOperations: number[]) : any[]

/** List of operations and their id */
export const operations : {string: number}