import { PublicKey } from "./PublicKey.js"

/** Return null for a valid username */
export function validateUsername (username: string): null | string

/**
 * Make bitmask filter to be used with get_account_history call
 * @param allowedOperations Array of operations index numbers
 * @example
 * import { call } from 'hive-tx'
 * import { makeBitMaskFilter, operations as op } from 'hive-tx/helpers/utils.js'
 * const filter = makeBitMaskFilter([op.transfer, op.transfer_to_vesting])
 * call('condenser_api.get_account_history', ['mahdiyari', -1, 1, ...filter])
 *  .then(res => console.log(res))
 */
export function makeBitMaskFilter (allowedOperations: number[]): any[]

/** List of operations and their id */
export const operations: { string: number }

interface WitnessProps {
  account_creation_fee?: string
  account_subsidy_budget?: number
  account_subsidy_decay?: number
  key: PublicKey | string
  maximum_block_size?: number
  new_signing_key?: PublicKey | string | null
  hbd_exchange_rate?: { base: string, quote: string }
  hbd_interest_rate?: number
  url?: string
}

/** Needed for creating witness_set_properties operation
 * @example
 * import { buildWitnessSetProperties } from 'hive-tx/helpers/utils.js'
 * const owner = 'mahdiyari'
 * const props = {
 *  key: 'STM1111111111111111111111111111111114T1Anm', // Required - signing key
 *  account_creation_fee: '0.000 HIVE', // optional
 *  account_subsidy_budget: 10000, // optional
 *  account_subsidy_decay: 330782, // optional
 *  maximum_block_size: 65536, // optional
 *  hbd_interest_rate: 0, // optional
 *  hbd_exchange_rate: { base: '0.250 HBD', quote: '1.000 HIVE' }, // optional
 *  url: 'https://testurl', // optional
 *  new_signing_key: "STM1111111111111111111111111111111114T1Anm" // optional
 * }
 * const witnessOps = buildWitnessSetProperties(owner, props)
 * const trx = new Transaction().create(witnessOps)
 */
export function buildWitnessSetProperties (owner: string, props: WitnessProps): string
