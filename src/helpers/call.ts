import { config } from '../config'
// import { CallParams, MethodName } from '../types/apiTypes'
// import { TransactionType } from '../types/operationTypes'

let nodeIndex = 0
let numTries = 0

// function call<M extends MethodName>(
//   method: M,
//   params: CallParams<M>,
//   timeout?: number,
//   retry?: number
// ): Promise<any> {
//   return callImpl(method as string, params, timeout, retry)
// }

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
 * import { call } from 'hive-tx'
 *
 * // Get account information
 * const accounts = await call('condenser_api.get_accounts', [['alice']])
 *
 * // Custom timeout and retry settings
 * const data = await call('condenser_api.get_content', ['alice', 'test-post'], 10_000, 8)
 * ```
 */
const call = async (
  method: string,
  params: any[] | object = [],
  timeout = config.timeout,
  retry = config.retry
): Promise<any> => {
  // TODO: check for id missmatch
  const node = config.node[nodeIndex]
  const body = {
    jsonrpc: '2.0',
    method,
    params,
    id: 1
  }
  try {
    if (typeof AbortSignal !== 'undefined') {
      const res = await fetch(node, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(timeout)
      })
      numTries = 0
      return await res.json()
    } else {
      // Fallback for environments without AbortController
      const res = await Promise.race([
        fetch(node, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' }
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
      ])
      numTries = 0
      return await res.json()
    }
  } catch (e) {
    numTries++
    if (!Array.isArray(config.node) || numTries > retry) {
      throw e
    }
    await changeNode()
    return call(method, params, timeout, retry)
  }
}

export { call }

/** Validate and use another RPC node */
const changeNode = async (newNodeIndex = nodeIndex + 1) => {
  if (!Array.isArray(config.node)) {
    return
  }
  if (newNodeIndex > config.node.length - 1) {
    newNodeIndex = 0
  }
  nodeIndex = newNodeIndex
}
