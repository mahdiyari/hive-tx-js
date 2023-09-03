import { sha256 as sh256 } from '@noble/hashes/sha256'
import { sha512 as sh512 } from '@noble/hashes/sha512'
import { ripemd160 as rp160 } from '@noble/hashes/ripemd160'
import secureRandom from 'secure-random-hive-tx'

export const sha256 = (input) => {
  return Buffer.from(sh256(input))
}

export const sha512 = (input) => {
  return Buffer.from(sh512(input))
}

export const ripemd160 = (input) => {
  return Buffer.from(rp160(input))
}

export const randomWords = (n = 32) => {
  return random32ByteBuffer()
}

// hash for .25 second
const HASH_POWER_MILLS = 250
const entropyCount = 0
const entropyArray = secureRandom.randomBuffer(101)
const random32ByteBuffer = (entropy = browserEntropy()) => {
  if (!(typeof entropy === 'string')) {
    throw new Error('string required for entropy')
  }
  if (entropy.length < 32) {
    throw new Error('expecting at least 32 bytes of entropy')
  }
  const startT = Date.now()
  while (Date.now() - startT < HASH_POWER_MILLS) { entropy = sha256(entropy) }
  const hashArray = []
  hashArray.push(entropy)
  // Hashing for 1 second may helps the computer is not low on entropy (this method may be called back-to-back).
  hashArray.push(secureRandom.randomBuffer(32))
  return sha256(Buffer.concat(hashArray))
}

const browserEntropy = () => {
  let entropyStr = Array(entropyArray).join()
  try {
    const r = typeof globalThis === 'undefined' ? window : globalThis
    entropyStr += (new Date()).toString() + ' ' + r.screen.height + ' ' + r.screen.width + ' ' +
          r.screen.colorDepth + ' ' + ' ' + r.screen.availHeight + ' ' + r.screen.availWidth + ' ' +
          r.screen.pixelDepth + navigator.language + ' ' + r.location + ' ' + r.history.length
    console.log('INFO\tbrowserEntropy gathered', entropyCount, 'events')
  } catch (error) {
    // nodejs:ReferenceError: window is not defined
    entropyStr += sha256((new Date()).toString()).toString('hex')
  }
  const b = Buffer.from(entropyStr)
  entropyStr += b.toString('binary') + ' ' + (new Date()).toString()
  return entropyStr
}
