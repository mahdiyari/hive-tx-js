// @ts-nocheck
import { config } from '../config'

// Conditionally import axios or use a minimal browser implementation
let axios
if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
  // Browser environment - use a minimal fetch wrapper
  axios = {
    CancelToken: {
      source: () => ({
        token: {},
        cancel: () => {},
      }),
    },
    post: async (url, body, options = {}) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        options.timeout || 5000
      )

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: typeof body === 'string' ? body : JSON.stringify(body),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return {
          status: response.status,
          data: await response.json(),
        }
      } catch (error) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          throw new Error('Request timeout')
        }
        throw error
      }
    },
  }
} else {
  // Node.js environment - use axios
  axios = require('axios')
}

let nodeIndex = 0
let numTries = 0

/**
 * Make calls to hive node and retry - Only if provided config.node is an array
 * @param {string}method - e.g. condenser_api.get_dynamic_global_properties
 * @param {[any]|object}params - an array or object
 * @param {number}timeout - optional - default 5 seconds
 * @param {number}retry - optional - default 5 retries before throw
 */
export const call = async (
  method,
  params = [],
  timeout = config.timeout,
  retry = config.retry
) => {
  let node = ''
  if (Array.isArray(config.node) && config.node.length > 0) {
    node = config.node[nodeIndex]
  } else {
    node = config.node
  }
  const body = JSON.stringify({
    jsonrpc: '2.0',
    method,
    params,
    id: 1,
  })
  try {
    const res = await callWithTimeout(node, body, timeout)
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

const callWithTimeout = (url, body, timeout) => {
  const conf = {}
  if (config.axiosAdapter !== null) {
    conf.adapter = config.axiosAdapter
  }

  if (axios.CancelToken) {
    // Axios implementation
    const source = axios.CancelToken.source()
    let resolved = 0
    let timerId
    return new Promise((resolve, reject) => {
      axios
        .post(url, body, { ...conf, cancelToken: source.token })
        .then((res) => {
          if (res && res.status === 200) {
            resolved = 1
            resolve(res.data)
          } else {
            reject(new Error(`Unexpected response status: ${res.status}`))
          }
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          if (timerId) {
            clearTimeout(timerId)
          }
        })
      timerId = setTimeout(() => {
        if (!resolved) {
          source.cancel('Operation canceled by timeout')
          reject(new Error(`Network timeout: ${url}: ${body}`))
        }
      }, timeout * 1000)
    })
  } else {
    // Fetch implementation (already has timeout built-in)
    return axios.post(url, body, { timeout: timeout * 1000 })
  }
}

// The default axios adapter creates infinite sockets which leads to memory leak in Deno
// Confirmed to NOT be a problem in nodejs
// The following fixes the problem in Deno
if ('Deno' in globalThis) {
  config.axiosAdapter = async (config) => {
    const { method, url, headers, data, ...rest } = config
    const response = await fetch(url, {
      method,
      headers: new Headers(headers),
      body: data,
      ...rest, // Additional configurations if needed
    })
    return {
      data: await response.json(),
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      config,
      request: response,
    }
  }
}

/** Validate and use another RPC node */
const changeNode = async (newNodeIndex = nodeIndex + 1, tries = 0) => {
  if (!Array.isArray(config.node)) {
    return
  }
  if (tries > config.node.length) {
    throw new Error(
      `Can't find a working node! Current nodes are: ${config.node.join(', ')}`
    )
  }
  if (newNodeIndex > config.node.length - 1) {
    newNodeIndex = 0
  }
  const body = JSON.stringify({
    jsonrpc: '2.0',
    method: 'condenser_api.get_accounts',
    params: [['mahdiyari']],
    id: 189,
  })
  try {
    const res = await callWithTimeout(
      config.node[newNodeIndex],
      body,
      config.timeout
    )
    if (
      res &&
      res.id === 189 &&
      res.result &&
      res.result[0] &&
      res.result[0].name === 'mahdiyari'
    ) {
      nodeIndex = newNodeIndex
    } else {
      return changeNode(newNodeIndex + 1, tries + 1)
    }
  } catch {
    return changeNode(newNodeIndex + 1, tries + 1)
  }
}

// Periodic healthcheck of the current node every 30s
const healthcheck = setInterval(async () => {
  if (!Array.isArray(config.node)) {
    return
  }
  const body = JSON.stringify({
    jsonrpc: '2.0',
    method: 'condenser_api.get_accounts',
    params: [['mahdiyari']],
    id: 88885,
  })
  try {
    const res = await callWithTimeout(
      config.node[nodeIndex],
      body,
      config.timeout
    )
    if (
      res &&
      res.id === 88885 &&
      res.result &&
      res.result[0] &&
      res.result[0].name === 'mahdiyari'
    ) {
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
