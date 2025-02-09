import { sha256 as sh256 } from '@noble/hashes/sha256'
import { sha512 as sh512 } from '@noble/hashes/sha512'
import { ripemd160 as rp160 } from '@noble/hashes/ripemd160'

export const sha256 = (input) => {
  return sh256(input)
  // return Uint8Array.from(sh256(input))
}

export const sha512 = (input) => {
  return sh512(input)
  // return Uint8Array.from(sh512(input))
}

export const ripemd160 = (input) => {
  return rp160(input)
  // return Uint8Array.from(rp160(input))
}
