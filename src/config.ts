export const config = {
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
  chain_id: 'beeab0de00000000000000000000000000000000000000000000000000000000',
  address_prefix: 'STM',
  axiosAdapter: null,
  timeout: 5, // 5 seconds
  retry: 5, // consecutive retries on one call
  healthcheckInterval: 30_000
}
