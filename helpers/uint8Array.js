export const hexToUint8Array = (hexString) => {
  const bytes = []
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16))
  }
  return new Uint8Array(bytes)
}
export const uint8ArrayToHex = (uint8Array) => {
  return Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}
