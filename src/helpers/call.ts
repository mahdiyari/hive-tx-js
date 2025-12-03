import { config } from '../config'
import { APIMethods, APIPaths, CallResponse } from '../types'

let rpcIndex = 0
let restIndex = 0
let rpcTries = 0
let restTries = 0

/**
 * Makes API calls to Hive blockchain nodes with automatic retry and failover support.
 * Automatically switches between multiple nodes.
 *
 * The method supports JSON-RPC 2.0 protocol used by Hive API nodes.
 * If the current node fails, it will automatically try the next node in the list.
 *
 * @param method - The API method name (e.g., 'condenser_api.get_accounts')
 * @param params - Parameters for the API method as array or object
 * @param timeout - Request timeout in milliseconds (default: config.timeout)
 * @param retry - Number of retry attempts before throwing an error (default: config.retry)
 * @returns Promise resolving to the API response
 * @throws Error if all retry attempts fail or network connectivity issues occur
 *
 * @example
 * ```typescript
 * import { callRPC } from 'hive-tx'
 *
 * // Get account information
 * const accounts = await callRPC('condenser_api.get_accounts', [['alice']])
 *
 * // Custom timeout and retry settings
 * const data = await callRPC('condenser_api.get_content', ['alice', 'test-post'], 10_000, 8)
 * ```
 */
export const callRPC = async <T = any>(
  method: string,
  params: any[] | object = [],
  timeout = config.timeout,
  retry = config.retry
): Promise<T> => {
  if (!Array.isArray(config.nodes)) {
    throw new Error('config.nodes is not an array')
  }
  const node = config.nodes[rpcIndex]
  const id = Math.floor(Math.random() * 100_000_000)
  const body = {
    jsonrpc: '2.0',
    method,
    params,
    id
  }
  try {
    const res = await fetch(node, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(timeout)
    })
    const result = (await res.json()) as CallResponse<T>
    if (
      !result ||
      typeof result.id === 'undefined' ||
      result.id !== id ||
      result.jsonrpc !== '2.0'
    ) {
      throw new Error('JSONRPC id missmatch')
    }
    if ('result' in result) {
      rpcTries = 0
      return result.result
    }
    if ('error' in result) {
      throw result.error
    }
    // Had valid id but no result or error?
    throw result
  } catch (e) {
    rpcTries++
    if (rpcTries > retry) {
      throw e
    }
    await changeRPCNode()
    return callRPC(method, params, timeout, retry)
  }
}

const apiMethods: Record<APIMethods, string> = {
  balance: '/balance-api',
  hafah: '/hafah-api',
  hafbe: '/hafbe-api',
  hivemind: '/hivemind-api',
  hivesense: '/hivesense-api',
  reputation: '/reputation-api',
  'nft-tracker': '/nft-tracker-api',
  hafsql: '/hafsql',
  status: '/status-api'
}

type GetResponse<T> = T extends {
  responses: { '200'?: { content: { 'application/json': infer R } } }
}
  ? R
  : never
type SafeGet<T> = T extends { get: infer G } ? G : never
type SafePathParams<T> =
  SafeGet<T> extends {
    parameters: { path: infer P }
  }
    ? P
    : {}
type SafeQueryParams<T> =
  SafeGet<T> extends {
    parameters: { query: infer Q }
  }
    ? Q
    : SafeGet<T> extends {
          parameters: {
            query?: infer Q
          }
        }
      ? Q
      : {}
type ParamsForEndpoint<T> = SafePathParams<T> & SafeQueryParams<T>

/**
 * Makes REST API calls to Hive blockchain REST endpoints with automatic retry and failover support.
 * Automatically switches between multiple REST nodes and handles path/query parameter processing.
 *
 * This function provides type-safe access to various Hive REST APIs including balance, hafah, hafbe,
 * hivemind, hivesense, reputation, nft-tracker, hafsql, and status APIs.
 *
 * @template Api - The REST API method type (e.g., 'balance', 'hafah', 'hivemind', etc.)
 * @template P - The endpoint path type for the specified API
 *
 * @param api - The REST API method name to call
 * @param endpoint - The specific endpoint path within the API
 * @param params - Optional parameters for path and query string replacement
 * @param timeout - Request timeout in milliseconds (default: config.timeout)
 * @param retry - Number of retry attempts before throwing an error (default: config.retry)
 *
 * @returns Promise resolving to the API response data with proper typing
 * @throws Error if all retry attempts fail, network connectivity issues occur, or HTTP errors are encountered
 *
 * @example
 * ```typescript
 * import { callREST } from 'hive-tx'
 *
 * // Get account balance
 * const balance = await callREST('balance', '/accounts/{account-name}/balances', { "account-name": 'alice' })
 *
 * const data = await callREST('balance', '/accounts/{account-name}/aggregated-history', {
 *  'account-name': 'mahdiyari',
 *  'coin-type': 'HBD'
 * })
 *
 * // Custom timeout and retry settings
 * const data = await callREST('status', '/status', undefined, 10_000, 3)
 * ```
 */
export async function callREST<Api extends APIMethods, P extends keyof APIPaths[Api]>(
  api: Api,
  endpoint: P,
  params?: ParamsForEndpoint<APIPaths[Api][P]>,
  timeout = config.timeout,
  retry = config.retry
): Promise<GetResponse<SafeGet<APIPaths[Api][P]>>> {
  if (!Array.isArray(config.restNodes)) {
    throw new Error('config.restNodes is not an array')
  }
  const node = config.restNodes[restIndex]
  const baseUrl = node + apiMethods[api]
  let path = endpoint as string
  const paramObj = params || ({} as Record<string, any>)
  const processedPathParams = new Set<string>()

  // Replace path params ONLY
  Object.entries(paramObj).forEach(([key, value]) => {
    if (path.includes(`{${key}}`)) {
      path = path.replace(`{${key}}`, encodeURIComponent(String(value)))
      processedPathParams.add(key)
    }
  })
  const url = new URL(baseUrl + path)
  // Add ONLY remaining params as query (if any)
  Object.entries(paramObj).forEach(([key, value]) => {
    if (!processedPathParams.has(key)) {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)))
      } else {
        url.searchParams.set(key, String(value))
      }
    }
  })
  try {
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json() as any
  } catch (e) {
    restTries++
    if (restTries > retry) {
      throw e
    }
    await changeRESTNode()
    return callREST(api, endpoint, params, timeout, retry)
  }
}

const changeRPCNode = async (newNodeIndex = rpcIndex + 1) => {
  if (newNodeIndex > config.nodes.length - 1) {
    newNodeIndex = 0
  }
  rpcIndex = newNodeIndex
}

const changeRESTNode = async (newNodeIndex = restIndex + 1) => {
  if (newNodeIndex > config.restNodes.length - 1) {
    newNodeIndex = 0
  }
  restIndex = newNodeIndex
}
