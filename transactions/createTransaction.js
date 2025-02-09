import { getGlobalProps } from '../helpers/globalProps.js'
import { hexToUint8Array } from '../helpers/uint8Array.js'

/** Create transaction by operations */
export const createTransaction = async (operations, exp) => {
  const expireTime = exp ? 1000 * exp : 1000 * 60
  const props = await getGlobalProps()
  const refBlockNum = props.head_block_number & 0xffff
  const uintArray = hexToUint8Array(props.head_block_id)
  const refBlockPrefix =
    uintArray[4] |
    (uintArray[5] << 8) |
    (uintArray[6] << 16) |
    (uintArray[7] << 24)
  const expiration = new Date(Date.now() + expireTime)
    .toISOString()
    .slice(0, -5)
  const extensions = []
  return {
    expiration,
    extensions,
    operations,
    ref_block_num: refBlockNum,
    ref_block_prefix: refBlockPrefix
  }
}
