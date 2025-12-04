import {
  Transaction,
  PrivateKey,
  PublicKey,
  Signature,
  Memo,
  utils,
  callREST,
  config,
  callRPC
} from 'hive-tx'

// Test data
const testPrivateKey = '5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw'
const testPublicKey = 'STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA'
const testUsername = 'testuser'

export const coverageTests = async () => {
  console.log('Running coverage tests...\n')

  let totalTests = 0
  let passedTests = 0

  // Helper function to run tests
  const runTest = async (name: string, testFn: () => boolean | Promise<boolean>) => {
    totalTests++
    try {
      const result = await testFn()
      if (result) {
        console.log(`✅ ${name}`)
        passedTests++
      } else {
        console.log(`❌ ${name}`)
      }
    } catch (error) {
      console.log(`❌ ${name}:`, error)
    }
  }

  // PrivateKey tests
  console.log('Testing PrivateKey...')

  await runTest('PrivateKey.fromString', () => {
    const key = PrivateKey.fromString(testPrivateKey)
    return key.toString() === testPrivateKey
  })

  await runTest('PrivateKey.from (string)', () => {
    const key = PrivateKey.from(testPrivateKey)
    return key.toString() === testPrivateKey
  })

  await runTest('PrivateKey.from (Uint8Array)', () => {
    const bytes = new Uint8Array([0x1, 0x2, 0x3])
    // Since it validates secp256k1, this should throw, but let's catch
    // Actually, the constructor checks, so invalid key throws
    try {
      new PrivateKey(bytes)
      return false // Should not reach here
    } catch {
      return true // Correctly throws
    }
  })

  await runTest('PrivateKey.fromSeed', () => {
    const seed = 'test seed phrase'
    const key = PrivateKey.fromSeed(seed)
    // Just check it creates without error
    return key instanceof PrivateKey
  })

  await runTest('PrivateKey.fromLogin', () => {
    const key = PrivateKey.fromLogin(testUsername, 'password123')
    return key instanceof PrivateKey
  })

  await runTest('PrivateKey.randomKey', () => {
    const key = PrivateKey.randomKey()
    return key instanceof PrivateKey
  })

  await runTest('PrivateKey.createPublic', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const pubKey = privKey.createPublic()
    return pubKey.toString() === testPublicKey
  })

  await runTest('PrivateKey.toString', () => {
    const key = PrivateKey.fromString(testPrivateKey)
    return key.toString() === testPrivateKey
  })

  await runTest('PrivateKey.inspect', () => {
    const key = PrivateKey.fromString(testPrivateKey)
    const inspectStr = key.inspect()
    return inspectStr.startsWith('PrivateKey: 5JdeC9...BsQnsw')
  })

  await runTest('PrivateKey.getSharedSecret', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const pubKey = PublicKey.fromString(testPublicKey)
    const secret = privKey.getSharedSecret(pubKey)
    return secret.length === 64
  })

  await runTest('PrivateKey.sign', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    return sig instanceof Signature
  })

  // PublicKey tests
  console.log('Testing PublicKey...')

  await runTest('PublicKey.fromString', () => {
    const key = PublicKey.fromString(testPublicKey)
    return key.toString() === testPublicKey
  })

  await runTest('PublicKey.from (string)', () => {
    const key = PublicKey.from(testPublicKey)
    return key.toString() === testPublicKey
  })

  await runTest('PublicKey.from (PublicKey instance)', () => {
    const key1 = PublicKey.fromString(testPublicKey)
    const key2 = PublicKey.from(key1)
    return key1 === key2
  })

  await runTest('PublicKey.verify', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const pubKey = privKey.createPublic()
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    return pubKey.verify(message, sig)
  })

  await runTest('PublicKey.toString', () => {
    const key = PublicKey.fromString(testPublicKey)
    return key.toString() === testPublicKey
  })

  await runTest('PublicKey.toJSON', () => {
    const key = PublicKey.fromString(testPublicKey)
    return key.toJSON() === testPublicKey
  })

  await runTest('PublicKey.inspect', () => {
    const key = PublicKey.fromString(testPublicKey)
    const inspectStr = key.inspect()
    return inspectStr === `PublicKey: ${testPublicKey}`
  })

  // Signature tests
  console.log('Testing Signature...')

  await runTest('Signature.from', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    const sigStr = sig.customToString()
    const reconstructed = Signature.from(sigStr)
    return reconstructed.customToString() === sigStr
  })

  await runTest('Signature.toBuffer', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    const buf = sig.toBuffer()
    return buf.length === 65
  })

  await runTest('Signature.customToString', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    const str = sig.customToString()
    return str.length === 130 && /^[0-9a-fA-F]+$/.test(str)
  })

  await runTest('Signature.getPublicKey', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    const recoveredPub = sig.getPublicKey(message)
    const expectedPub = privKey.createPublic()
    return recoveredPub.toString() === expectedPub.toString()
  })

  // Memo tests
  console.log('Testing Memo...')

  await runTest('Memo.encode (plaintext)', () => {
    const memo = 'This is a plain text memo'
    const encoded = Memo.encode(testPrivateKey, testPublicKey, memo)
    return encoded === memo
  })

  await runTest('Memo.encode (encrypted)', () => {
    const memo = '#This is an encrypted memo'
    const encoded = Memo.encode(testPrivateKey, testPublicKey, memo)
    return encoded.startsWith('#') && encoded !== memo
  })

  await runTest('Memo.decode (plaintext)', () => {
    const memo = 'Plain text memo'
    const decoded = Memo.decode(testPrivateKey, memo)
    return decoded === memo
  })

  // For encrypted, we need to encode first then decode
  await runTest('Memo.decode (encrypted)', () => {
    try {
      const original = '#Test encrypted message'
      const encoded = Memo.encode(testPrivateKey, testPublicKey, original)
      const decoded = Memo.decode(testPrivateKey, encoded)
      return decoded === original
    } catch (e) {
      console.error('Memo test error:', e)
      return false
    }
  })

  // Utils tests
  console.log('Testing utils...')

  await runTest('utils.validateUsername (valid)', () => {
    const error = utils.validateUsername('alice')
    return error === null
  })

  await runTest('utils.validateUsername (invalid: empty)', () => {
    const error = utils.validateUsername('')
    return error !== null
  })

  await runTest('utils.validateUsername (invalid: too short)', () => {
    const error = utils.validateUsername('ab')
    return error !== null
  })

  await runTest('utils.validateUsername (invalid: too long)', () => {
    const error = utils.validateUsername('a'.repeat(17))
    return error !== null
  })

  await runTest('utils.validateUsername (invalid: starts with digit)', () => {
    const error = utils.validateUsername('1alice')
    return error !== null
  })

  await runTest('utils.validateUsername (invalid: uppercase)', () => {
    const error = utils.validateUsername('Alice')
    return error !== null
  })

  await runTest('utils.makeBitMaskFilter', () => {
    const filter = utils.makeBitMaskFilter([0, 1, 64])
    return Array.isArray(filter) && filter.length === 2
  })

  await runTest('utils.buildWitnessSetProperties', () => {
    const props = {
      key: testPublicKey,
      account_creation_fee: '3.000 HIVE',
      maximum_block_size: 65536
    }
    const result = utils.buildWitnessSetProperties('testuser', props)
    return (
      Array.isArray(result) &&
      result[0] === 'witness_set_properties' &&
      JSON.stringify(result[1]) ===
        '{"extensions":[],"owner":"testuser","props":[["account_creation_fee","b80b00000000000003535445454d0000"],["key","03fdf4907810a9f5d9462a1ae09feee5ab205d32798b0ffcc379442021f84c5bbf"],["maximum_block_size","00000100"]]}'
    )
  })

  // Transaction additional tests
  console.log('Testing Transaction extras...')

  await runTest('Transaction.sign & verify', async () => {
    const trx = new Transaction()
    await trx.addOperation('transfer', {
      from: 'testuser',
      to: 'alice',
      amount: '1.000 HIVE',
      memo: 'test'
    })
    const privKey = PrivateKey.fromString(testPrivateKey)
    trx.sign(privKey)
    return privKey
      .createPublic()
      .verify(trx.digest().digest, Signature.from(trx.transaction!.signatures[0]))
  })

  await runTest('Transaction.digest', async () => {
    const trx = new Transaction()
    await trx.addOperation('transfer', {
      from: 'testuser',
      to: 'alice',
      amount: '1.000 HIVE',
      memo: 'test'
    })
    const digest = trx.digest()
    return digest.digest.length === 32 && typeof digest.txId === 'string'
  })

  await runTest('Transaction.addSignature', async () => {
    const trx = new Transaction()
    await trx.addOperation('transfer', {
      from: 'testuser',
      to: 'alice',
      amount: '1.000 HIVE',
      memo: 'test'
    })
    const signature = '1f6a9a9c4e6a8b7...2d00' // 130 char hex
    const paddedSig = signature.padEnd(130, '0')
    const signed = trx.addSignature(paddedSig)
    return signed.signatures.includes(paddedSig)
  })

  console.log('Testing API calls...')

  await runTest('callRPC(condenser_api.get_accounts)', async () => {
    try {
      const res = await callRPC('condenser_api.get_accounts', [['mahdiyari']])
      return res[0].name === 'mahdiyari'
    } catch {
      return false
    }
  })

  await runTest('callRPC() failover', async () => {
    const temp = config.nodes
    try {
      config.nodes = ['https://bad-url-very-very-bad-url', 'https://another-bad-url', ...temp]
      const res = await callRPC('condenser_api.get_accounts', [['mahdiyari']])
      return res[0].name === 'mahdiyari'
    } catch {
      return false
    } finally {
      config.nodes = temp
    }
  })

  await runTest('callREST(hafbe, /accounts/{account-name})', async () => {
    try {
      const res = await callREST('hafbe', '/accounts/{account-name}', {
        'account-name': 'mahdiyari'
      })
      return res.name === 'mahdiyari'
    } catch {
      return false
    }
  })

  await runTest('callREST() failover', async () => {
    const temp = config.restNodes
    try {
      config.restNodes = ['https://bad-url-very-very-bad-url', 'https://another-bad-url', ...temp]
      const res = await callREST('hafbe', '/accounts/{account-name}', {
        'account-name': 'mahdiyari'
      })
      return res.name === 'mahdiyari'
    } catch {
      return false
    } finally {
      config.restNodes = temp
    }
  })

  console.log(`\nCoverage tests completed: ${passedTests}/${totalTests} passed`)
  return passedTests === totalTests
}
