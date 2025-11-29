import { config } from '../config'
import { ofetch } from 'ofetch'

let nodeIndex = 0
let numTries = 0

/**
 * Make calls to hive node and retry - Only if provided config.node is an array
 * @param method - e.g. condenser_api.get_dynamic_global_properties
 * @param params - an array or object
 * @param timeout - optional - default 5 seconds
 * @param retry - optional - default 5 retries before throw
 */
export const call = async (
  method: string,
  params: any[] | object = [],
  timeout = config.timeout * 1000,
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
      timeout: 5000
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
