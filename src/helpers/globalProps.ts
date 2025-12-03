import { callRPC } from './call'

/** return global properties */
export const getGlobalProps = async () => {
  const res = await callRPC('condenser_api.get_dynamic_global_properties', [])
  if (!res) {
    throw new Error("Couldn't resolve global properties")
  }
  if (res && (!res.id || !res.result)) {
    throw new Error('Bad response @ global props')
  }
  return res.result
}
