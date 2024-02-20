import { sha256 as sh256 } from '@noble/hashes/sha256'
import { sha512 as sh512 } from '@noble/hashes/sha512'
import { ripemd160 as rp160 } from '@noble/hashes/ripemd160'

export const sha256 = (input) => {
  return Buffer.from(sh256(input))
}

export const sha512 = (input) => {
  return Buffer.from(sh512(input))
}

export const ripemd160 = (input) => {
  return Buffer.from(rp160(input))
}
