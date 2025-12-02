// API Response Types
export interface BroadcastResponse {
  id: number
  jsonrpc: string
  result: BroadcastResult
}

export interface BroadcastError {
  id: number
  jsonrpc: string
  error: {
    code: number
    message: string
    data?: any
  }
}

export type CallResponse<T = any> =
  | {
      id: number
      jsonrpc: string
      result: T
    }
  | BroadcastError

export interface BroadcastResult {
  tx_id: string
  status: string
}

export interface DigestData {
  digest: Uint8Array
  txId: string
}

export interface Config {
  address_prefix: string
  chain_id: string
  node: string[]
  timeout: number
  retry: number
  healthcheckInterval: number
}

// export * from './apiTypes'
export * from './operationTypes'
