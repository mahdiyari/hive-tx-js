import { sha256 as sh256 } from '@noble/hashes/sha256'
import { ripemd160 as rp160 } from '@noble/hashes/ripemd160'
import secureRandom from 'secure-random'

export const sha256 = (input) => {
  return Buffer.from(sh256(input))
}

export const ripemd160 = (input) => {
  return Buffer.from(rp160(input))
}

export const randomWords = (n = 32) => {
  return random32ByteBuffer()
}

// hash for .25 second
const HASH_POWER_MILLS = 250
let entropyCount = 0
const entropyArray = secureRandom.randomBuffer(101)
const random32ByteBuffer = (entropy = browserEntropy()) => {
  if (!(typeof entropy === 'string')) {
      throw new Error("string required for entropy");
  }
  if (entropy.length < 32) {
      throw new Error("expecting at least 32 bytes of entropy");
  }
  const start_t = Date.now()
  while (Date.now() - start_t < HASH_POWER_MILLS)
      entropy = sha256(entropy)
  const hash_array = []
  hash_array.push(entropy)
  // Hashing for 1 second may helps the computer is not low on entropy (this method may be called back-to-back).
  hash_array.push(secureRandom.randomBuffer(32))
  return sha256(Buffer.concat(hash_array))
}

const browserEntropy = () => {
  let entropyStr = Array(entropyArray).join()
  try {
      entropyStr += (new Date()).toString() + " " + window.screen.height + " " + window.screen.width + " " +
          window.screen.colorDepth + " " + " " + window.screen.availHeight + " " + window.screen.availWidth + " " +
          window.screen.pixelDepth + navigator.language + " " + window.location + " " + window.history.length
      console.log("INFO\tbrowserEntropy gathered", entropyCount, 'events')
  } catch(error) {
      //nodejs:ReferenceError: window is not defined
      entropyStr += sha256((new Date()).toString()).toString('hex')
  }
  const b = Buffer.from(entropyStr)
  entropyStr += b.toString('binary') + " " + (new Date()).toString()
  return entropyStr
}

