import { TransactionType } from './operationTypes'

// Type definitions for API method parameters
type MethodParams =
  | ['condenser_api.get_accounts', string[][]]
  | ['condenser_api.get_dynamic_global_properties', []]

export type MethodName = MethodParams[0]
export type CallParams<O extends MethodName> = Extract<MethodParams, [O, any]>[1]
