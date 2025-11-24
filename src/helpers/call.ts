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

// const callWithTimeout = (url, body, timeout) => {
//   const conf: any = {}
//   if (config.axiosAdapter !== null) {
//     conf.adapter = config.axiosAdapter
//   }

//   if (axios.CancelToken) {
//     // Axios implementation
//     const source = axios.CancelToken.source()
//     let resolved = 0
//     let timerId
//     return new Promise((resolve, reject) => {
//       axios
//         .post(url, body, { ...conf, cancelToken: source.token })
//         .then((res) => {
//           if (res && res.status === 200) {
//             resolved = 1
//             resolve(res.data)
//           } else {
//             reject(new Error(`Unexpected response status: ${res.status}`))
//           }
//         })
//         .catch((e) => {
//           reject(e)
//         })
//         .finally(() => {
//           if (timerId) {
//             clearTimeout(timerId)
//           }
//         })
//       timerId = setTimeout(() => {
//         if (!resolved) {
//           source.cancel('Operation canceled by timeout')
//           reject(new Error(`Network timeout: ${url}: ${body}`))
//         }
//       }, timeout * 1000)
//     })
//   } else {
//     // Fetch implementation (already has timeout built-in)
//     return axios.post(url, body, { timeout: timeout * 1000 })
//   }
// }

// The default axios adapter creates infinite sockets which leads to memory leak in Deno
// Confirmed to NOT be a problem in nodejs
// The following fixes the problem in Deno
// if ('Deno' in globalThis) {
//   config.axiosAdapter = async (config) => {
//     const { method, url, headers, data, ...rest } = config
//     const response = await fetch(url, {
//       method,
//       headers: new Headers(headers),
//       body: data,
//       ...rest // Additional configurations if needed
//     })
//     return {
//       data: await response.json(),
//       status: response.status,
//       statusText: response.statusText,
//       headers: Object.fromEntries(response.headers.entries()),
//       config,
//       request: response
//     }
//   }
// }

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
