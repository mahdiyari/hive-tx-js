export interface paths {
  '/accounts/{account-name}/reputation': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Account reputation
     * @description Returns calculated reputation with formula found in:
     *     https://hive.blog/steemit/@digitalnotvir/how-reputation-scores-are-calculated-the-details-explained-with-simple-math
     *
     *     SQL example
     *     * `SELECT * FROM reptracker_endpoints.get_account_reputation('blocktrades');`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/reputation-api/accounts/blocktrades/reputation'`
     */
    get: operations['reptracker_endpoints.get_account_reputation']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/version': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get reputation tracker's version
     * @description Get reputation tracker's last commit hash (versions set by by hash value).
     *
     *     SQL example
     *     * `SELECT * FROM reptracker_endpoints.get_reptracker_version();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/balance-api/version'`
     */
    get: operations['reptracker_endpoints.get_reptracker_version']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/last-synced-block': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get last block number synced by reputation tracker
     * @description Get the block number of the last block synced by reputation tracker.
     *
     *     SQL example
     *     * `SELECT * FROM reptracker_endpoints.get_rep_last_synced_block();`
     *
     *     REST call example
     *     * `GET 'https://rpc.mahdiyari.info/reputation-api/last-synced-block'`
     */
    get: operations['reptracker_endpoints.get_rep_last_synced_block']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: never
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  'reptracker_endpoints.get_account_reputation': {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Name of the account */
        'account-name': string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description No such account in the database */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example 69 */
          'application/json': number
        }
      }
    }
  }
  'reptracker_endpoints.get_reptracker_version': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description reputation tracker version
       *
       *     * Returns `TEXT`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example c2fed8958584511ef1a66dab3dbac8c40f3518f0 */
          'application/json': string
        }
      }
      /** @description App not installed */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  'reptracker_endpoints.get_rep_last_synced_block': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /**
       * @description Last synced block by reputation tracker
       *
       *     * Returns `INT`
       */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          /** @example 5000000 */
          'application/json': number
        }
      }
      /** @description No blocks synced */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
}
