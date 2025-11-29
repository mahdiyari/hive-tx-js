import { config } from '../config'
import { ofetch } from 'ofetch'

let nodeIndex = 0
let numTries = 0

/**
 * Makes API calls to Hive blockchain nodes with automatic retry and failover support.
 * Automatically switches between multiple nodes.
 *
 * The method supports JSON-RPC 2.0 protocol used by Hive API nodes.
 * If the current node fails, it will automatically try the next node in the list.
 *
 * @param method - The API method name (e.g., 'condenser_api.get_accounts')
 * @param params - Parameters for the API method as array or object
 * @param timeout - Request timeout in seconds (default: config.timeout)
 * @param retry - Number of retry attempts before failing (default: config.retry)
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
 * // Get blockchain properties
 * const props = await call('condenser_api.get_dynamic_global_properties')
 *
 * // Custom timeout and retry settings
 * const data = await call('condenser_api.get_content', ['alice', 'test-post'], 10, 3)
 * ```
 */
export const call = async (
  method: string,
  params: any[] | object = [],
  timeout = config.timeout,
  retry = config.retry
): Promise<any> => {
  let node = ''
  const configNode = config.node
  if (Array.isArray(configNode)) {
    node = configNode[nodeIndex]
  } else {
    node = configNode
  }
  const body = {
    jsonrpc: '2.0',
    method,
    params,
    id: 1
  }
  try {
    const res = await ofetch(node, {
      method: 'POST',
      body,
      timeout: timeout * 1000
    })
    numTries = 0
    return res
  } catch (e) {
    numTries++
    if (!Array.isArray(config.node) || numTries > retry) {
      throw e
    }
    await changeNode()
    return call(method, params, timeout, retry)
  }
}

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

// Periodic healthcheck of the current node every 30s
const healthcheck = setInterval(async () => {
  if (!Array.isArray(config.node)) {
    return
  }
  try {
    const res = await call('condenser_api.get_accounts', [['mahdiyari']])
    if (res && res.result && res.result[0] && res.result[0].name === 'mahdiyari') {
      // do nothing
    } else {
      changeNode()
    }
  } catch {
    changeNode()
  }
}, config.healthcheckInterval)

// Don't keep the app active just because of this interval
if (healthcheck && healthcheck.unref) {
  healthcheck.unref()
}
