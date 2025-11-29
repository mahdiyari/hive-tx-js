/**
 * Configuration object for customizing hive-tx library behavior.
 * Modify these values to change the default node endpoints, timeouts, and other settings.
 *
 * @example
 * ```typescript
 * import { config } from 'hive-tx'
 *
 * // Use a specific node instead of the default array
 * config.node = ['https://api.hive.blog']
 *
 * // Custom timeout and retry settings
 * config.timeout = 10
 * config.retry = 3
 * ```
 */
export const config = {
  /**
   * Array of Hive API node endpoints for load balancing and failover.
   * @default Array of multiple Hive API endpoints
   */
  node: [
    'https://api.hive.blog',
    'https://api.deathwing.me',
    'https://rpc.mahdiyari.info',
    'https://techcoderx.com',
    'https://hiveapi.actifit.io',
    'https://hive-api.dlux.io',
    'https://hive-api.arcange.eu',
    'https://api.c0ff33a.uk'
  ],

  /**
   * The Hive blockchain chain ID for transaction signing and verification.
   * @default Mainnet chain ID
   */
  chain_id: 'beeab0de00000000000000000000000000000000000000000000000000000000',

  /**
   * Address prefix used for public key formatting (STM for mainnet).
   * @default 'STM'
   */
  address_prefix: 'STM',

  /**
   * Timeout in seconds for individual API calls.
   * @default 5
   */
  timeout: 5,

  /**
   * Number of retry attempts for failed API calls.
   * @default 5
   */
  retry: 5,

  /**
   * Interval in milliseconds for periodic node health checks.
   * @default 30000
   */
  healthcheckInterval: 30_000
}
