# Testing Guide

This guide explains how to test applications built with the hive-tx library and how to contribute tests to the library itself.

## Table of Contents

- [Testing Applications](#testing-applications)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [Mocking and Stubbing](#mocking-and-stubbing)
- [Test Environment Setup](#test-environment-setup)
- [Contributing Tests](#contributing-tests)
- [Continuous Integration](#continuous-integration)

## Testing Applications

When building applications with hive-tx, you should test your integration with the library to ensure reliability.

### Basic Transaction Testing

```typescript
import { Transaction, PrivateKey } from 'hive-tx'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Transaction Operations', () => {
  let tx: Transaction
  let privateKey: PrivateKey

  beforeEach(() => {
    tx = new Transaction()
    privateKey = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
  })

  it('should create a transfer transaction', async () => {
    await tx.addOperation('transfer', {
      from: 'sender',
      to: 'receiver',
      amount: '1.000 HIVE',
      memo: 'Test transfer'
    })

    expect(tx.transaction?.operations).toHaveLength(1)
    expect(tx.transaction?.operations[0][0]).toBe('transfer')
  })

  it('should sign a transaction', async () => {
    await tx.addOperation('transfer', {
      from: 'sender',
      to: 'receiver',
      amount: '1.000 HIVE'
    })

    const signedTx = tx.sign(privateKey)
    
    expect(signedTx.signatures).toHaveLength(1)
    expect(signedTx.signatures[0]).toMatch(/^[0-9a-f]{130}$/)
  })
})
```

### API Call Testing

```typescript
import { call } from 'hive-tx'
import { vi, describe, it, expect } from 'vitest'

describe('API Calls', () => {
  it('should fetch account data', async () => {
    const result = await call('condenser_api.get_accounts', [['testuser']])
    
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('jsonrpc')
    expect(result).toHaveProperty('result')
    expect(Array.isArray(result.result)).toBe(true)
  })

  it('should handle API errors gracefully', async () => {
    await expect(call('invalid.method', []))
      .rejects
      .toThrow()
  })
})
```

## Unit Testing

Unit tests focus on individual components and functions within the hive-tx library.

### PrivateKey Unit Tests

```typescript
import { PrivateKey } from 'hive-tx'
import { describe, it, expect } from 'vitest'

describe('PrivateKey', () => {
  const validWif = '5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw'

  it('should create from valid WIF string', () => {
    const key = PrivateKey.from(validWif)
    expect(key).toBeInstanceOf(PrivateKey)
  })

  it('should throw error for invalid WIF', () => {
    expect(() => {
      PrivateKey.from('invalid-wif')
    }).toThrow()
  })

  it('should generate random key', () => {
    const key = PrivateKey.randomKey()
    expect(key).toBeInstanceOf(PrivateKey)
    expect(key.toString()).toMatch(/^5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/)
  })

  it('should create from seed', () => {
    const key = PrivateKey.fromSeed('test-seed')
    expect(key).toBeInstanceOf(PrivateKey)
  })

  it('should derive from login credentials', () => {
    const key = PrivateKey.fromLogin('testuser', 'password', 'posting')
    expect(key).toBeInstanceOf(PrivateKey)
  })

  it('should sign and verify messages', () => {
    const key = PrivateKey.from(validWif)
    const message = new Uint8Array(32).fill(1)
    const signature = key.sign(message)
    
    expect(signature).toBeDefined()
    expect(signature.customToString()).toMatch(/^[0-9a-f]{130}$/)
  })
})
```

### PublicKey Unit Tests

```typescript
import { PublicKey } from 'hive-tx'
import { describe, it, expect } from 'vitest'

describe('PublicKey', () => {
  const validPublicKey = 'STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA'

  it('should create from valid string', () => {
    const key = PublicKey.from(validPublicKey)
    expect(key).toBeInstanceOf(PublicKey)
  })

  it('should convert to string', () => {
    const key = PublicKey.from(validPublicKey)
    const keyString = key.toString()
    
    expect(keyString).toBe(validPublicKey)
  })

  it('should verify signatures', () => {
    const key = PublicKey.from(validPublicKey)
    const message = new Uint8Array(32).fill(1)
    // Mock signature for testing
    const isValid = key.verify(message, {
      data: new Uint8Array(64),
      recovery: 0,
      toBuffer: () => new Uint8Array(65),
      customToString: () => 'test'
    } as any)
    
    expect(typeof isValid).toBe('boolean')
  })
})
```

### Asset Unit Tests

```typescript
import { Asset } from 'hive-tx'
import { describe, it, expect } from 'vitest'

describe('Asset', () => {
  it('should create from string', () => {
    const asset = Asset.from('10.500 HIVE')
    
    expect(asset.amount).toBe(10.5)
    expect(asset.symbol).toBe('HIVE')
  })

  it('should create from number and symbol', () => {
    const asset = Asset.from(15.75, 'HBD')
    
    expect(asset.amount).toBe(15.75)
    expect(asset.symbol).toBe('HBD')
  })

  it('should format to string', () => {
    const asset = Asset.from(10.5, 'HIVE')
    const formatted = asset.toString()
    
    expect(formatted).toBe('10.500 HIVE')
  })

  it('should handle different precisions', () => {
    const hive = Asset.from('10.500 HIVE')
    const vests = Asset.from('1000.000000 VESTS')
    
    expect(hive.getPrecision()).toBe(3)
    expect(vests.getPrecision()).toBe(6)
  })

  it('should throw error for invalid format', () => {
    expect(() => {
      Asset.from('invalid')
    }).toThrow()
    
    expect(() => {
      Asset.from('10.500 INVALID')
    }).toThrow()
  })
})
```

## Integration Testing

Integration tests verify that different components work together correctly.

### Transaction Integration Tests

```typescript
import { Transaction, PrivateKey, PublicKey } from 'hive-tx'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Transaction Integration', () => {
  let tx: Transaction
  let privateKey: PrivateKey

  beforeEach(() => {
    tx = new Transaction()
    privateKey = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
  })

  it('should create, sign, and digest transaction', async () => {
    // Create transaction
    await tx.addOperation('transfer', {
      from: 'sender',
      to: 'receiver',
      amount: '1.000 HIVE',
      memo: 'Integration test'
    })

    // Sign transaction
    const signedTx = tx.sign(privateKey)
    
    expect(signedTx.signatures).toHaveLength(1)
    
    // Get digest
    const digest = tx.digest()
    
    expect(digest).toHaveProperty('digest')
    expect(digest).toHaveProperty('txId')
    expect(digest.txId).toMatch(/^[0-9a-f]{40}$/)
  })

  it('should handle multiple operations', async () => {
    await tx.addOperation('transfer', {
      from: 'sender',
      to: 'receiver1',
      amount: '1.000 HIVE'
    })

    await tx.addOperation('vote', {
      voter: 'sender',
      author: 'author',
      permlink: 'permlink',
      weight: 10000
    })

    expect(tx.transaction?.operations).toHaveLength(2)
    expect(tx.transaction?.operations[0][0]).toBe('transfer')
    expect(tx.transaction?.operations[1][0]).toBe('vote')
  })
})
```

### Memo Integration Tests

```typescript
import { Memo, PrivateKey, PublicKey } from 'hive-tx'
import { describe, it, expect } from 'vitest'

describe('Memo Integration', () => {
  const senderKey = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
  const recipientKey = PrivateKey.from('5JNSxHNxDVE6d7j7R9hnxiHZdxWqH92VW14HqV9p2H9Z5teT9hj')
  const recipientPublicKey = recipientKey.createPublic()

  it('should encrypt and decrypt memo', async () => {
    const originalMemo = '#Secret message for testing'
    
    // Encrypt
    const encrypted = await Memo.encode(senderKey, recipientPublicKey, originalMemo)
    
    expect(encrypted).toMatch(/^#/)
    expect(encrypted).not.toContain('Secret message')
    
    // Decrypt
    const decrypted = await Memo.decode(recipientKey, encrypted)
    
    expect(decrypted).toBe(originalMemo)
  })

  it('should handle plain text memos', async () => {
    const plainMemo = 'Plain text memo'
    
    const result = await Memo.encode(senderKey, recipientPublicKey, plainMemo)
    
    expect(result).toBe(plainMemo)
  })

  it('should throw error for invalid keys', async () => {
    const invalidKey = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
    
    await expect(Memo.encode(invalidKey, recipientPublicKey, '#test'))
      .rejects
      .toThrow()
  })
})
```

## Mocking and Stubbing

Mock external dependencies to isolate your tests and make them faster and more reliable.

### Mocking API Calls

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { call } from 'hive-tx'

// Mock the underlying fetch implementation
vi.mock('ofetch', () => ({
  ofetch: vi.fn()
}))

describe('API Call Mocking', () => {
  const mockOfetch = vi.mocked(import('ofetch')).ofetch

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should handle successful API call', async () => {
    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: [{ name: 'testuser' }]
    }

    mockOfetch.mockResolvedValue(mockResponse)

    const result = await call('condenser_api.get_accounts', [['testuser']])
    
    expect(result).toEqual(mockResponse)
    expect(mockOfetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          method: 'condenser_api.get_accounts'
        })
      })
    )
  })

  it('should handle API errors', async () => {
    mockOfetch.mockRejectedValue(new Error('Network error'))

    await expect(call('condenser_api.get_accounts', [['testuser']]))
      .rejects
      .toThrow('Network error')
  })
})
```

### Mocking Blockchain Data

```typescript
import { vi, describe, it, expect } from 'vitest'
import { Transaction } from 'hive-tx'

// Mock global properties
vi.mock('../src/helpers/globalProps', () => ({
  getGlobalProps: vi.fn().mockResolvedValue({
    head_block_number: 12345,
    head_block_id: '00003039d0f8d9a1c8e8f0a1b2c3d4e5f6a7b8c9',
    time: '2023-01-01T00:00:00'
  })
}))

describe('Transaction Mocking', () => {
  it('should create transaction with mocked blockchain data', async () => {
    const tx = new Transaction()
    
    await tx.addOperation('vote', {
      voter: 'testuser',
      author: 'author',
      permlink: 'permlink',
      weight: 10000
    })

    expect(tx.transaction).toBeDefined()
    expect(tx.transaction?.ref_block_num).toBe(12345 & 0xffff)
  })
})
```

## Test Environment Setup

Set up your testing environment for optimal hive-tx testing.

### Package.json Configuration

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ci": "vitest --run --reporter=verbose"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "happy-dom": "^12.0.0"
  }
}
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: ['src/types.ts', 'src/index.ts']
    }
  }
})
```

### Test Setup File

```typescript
// tests/setup.ts
import { vi } from 'vitest'

// Global test setup
beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks()
})

afterEach(() => {
  // Clean up after each test
  vi.resetAllMocks()
})

// Mock console.error to reduce test output noise
vi.spyOn(console, 'error').mockImplementation(() => {})
```

## Contributing Tests

If you want to contribute tests to the hive-tx library, follow these guidelines.

### Test Structure

```typescript
// tests/transaction.test.ts
import { Transaction, PrivateKey } from '../src'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Transaction', () => {
  let tx: Transaction

  beforeEach(() => {
    tx = new Transaction()
  })

  describe('constructor', () => {
    it('should create empty transaction', () => {
      expect(tx).toBeInstanceOf(Transaction)
      expect(tx.transaction).toBeUndefined()
    })

    it('should create transaction from existing data', () => {
      const existingTx = {
        expiration: '2023-12-31T23:59:59',
        extensions: [],
        operations: [],
        ref_block_num: 12345,
        ref_block_prefix: 67890,
        signatures: []
      }

      const tx = new Transaction({ transaction: existingTx })
      
      expect(tx.transaction).toEqual(existingTx)
    })
  })

  describe('addOperation', () => {
    it('should add operation to transaction', async () => {
      await tx.addOperation('vote', {
        voter: 'testuser',
        author: 'author',
        permlink: 'permlink',
        weight: 10000
      })

      expect(tx.transaction?.operations).toHaveLength(1)
      expect(tx.transaction?.operations[0][0]).toBe('vote')
    })

    it('should handle multiple operations', async () => {
      await tx.addOperation('vote', {
        voter: 'testuser',
        author: 'author',
        permlink: 'permlink',
        weight: 10000
      })

      await tx.addOperation('transfer', {
        from: 'sender',
        to: 'receiver',
        amount: '1.000 HIVE'
      })

      expect(tx.transaction?.operations).toHaveLength(2)
    })
  })
})
```

### Test Coverage Requirements

Contributed tests should:

1. **Cover edge cases**: Test error conditions and boundary values
2. **Test all public methods**: Ensure 100% coverage of public API
3. **Include integration tests**: Test component interactions
4. **Use descriptive test names**: Clearly describe what is being tested
5. **Follow consistent structure**: Use the same testing patterns throughout

### Example Contribution Test

```typescript
// tests/asset.test.ts
import { Asset } from '../src/helpers/Asset'
import { describe, it, expect } from 'vitest'

describe('Asset', () => {
  describe('fromString', () => {
    it('should parse valid asset strings', () => {
      const asset = Asset.fromString('10.500 HIVE')
      
      expect(asset.amount).toBe(10.5)
      expect(asset.symbol).toBe('HIVE')
    })

    it('should throw for invalid asset strings', () => {
      expect(() => Asset.fromString('invalid')).toThrow()
      expect(() => Asset.fromString('10.500 INVALID')).toThrow()
    })

    it('should validate expected symbol', () => {
      expect(() => Asset.fromString('10.500 HIVE', 'HBD')).toThrow()
      expect(Asset.fromString('10.500 HIVE', 'HIVE').symbol).toBe('HIVE')
    })
  })

  describe('getPrecision', () => {
    it('should return correct precision for different symbols', () => {
      expect(Asset.from('1.000 HIVE').getPrecision()).toBe(3)
      expect(Asset.from('1.000000 VESTS').getPrecision()).toBe(6)
      expect(Asset.from('1.000 HBD').getPrecision()).toBe(3)
    })
  })

  describe('toString', () => {
    it('should format asset correctly', () => {
      expect(Asset.from(10.5, 'HIVE').toString()).toBe('10.500 HIVE')
      expect(Asset.from(1000.123456, 'VESTS').toString()).toBe('1000.123456 VESTS')
    })
  })
})
```

## Continuous Integration

Set up CI pipelines to automatically run tests.

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Run coverage
      run: npm run test:coverage

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

### Test Reporting

Configure test reporting for better visibility:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    reporters: ['default', 'json', 'verbose'],
    outputFile: {
      json: 'reports/test-results.json'
    }
  }
})
```

## Best Practices

### 1. Test Isolation

Each test should be independent and not rely on the state of other tests.

```typescript
// Good
describe('Transaction', () => {
  it('should create transaction', () => {
    const tx = new Transaction()
    expect(tx).toBeInstanceOf(Transaction)
  })

  it('should sign transaction', () => {
    const tx = new Transaction() // Fresh instance
    // ... test signing
  })
})

// Avoid
let tx: Transaction // Shared state

beforeAll(() => {
  tx = new Transaction() // Shared across tests
})
```

### 2. Clear Test Names

Use descriptive test names that clearly state what is being tested.

```typescript
// Good
it('should throw error for invalid WIF format', () => {
  // ...
})

// Avoid
it('should fail', () => {
  // ...
})
```

### 3. Test Edge Cases

Include tests for error conditions and boundary values.

```typescript
describe('Asset validation', () => {
  it('should handle zero amounts', () => {
    const asset = Asset.from('0.000 HIVE')
    expect(asset.amount).toBe(0)
  })

  it('should handle negative amounts', () => {
    const asset = Asset.from('-10.500 HIVE')
    expect(asset.amount).toBe(-10.5)
  })

  it('should throw for non-numeric amounts', () => {
    expect(() => Asset.fromString('invalid HIVE')).toThrow()
  })
})
```

### 4. Mock External Dependencies

Isolate your tests from external services.

```typescript
// Mock API calls
vi.mock('../src/helpers/call', () => ({
  call: vi.fn().mockResolvedValue({ result: [] })
}))

// Mock blockchain data
vi.mock('../src/helpers/globalProps', () => ({
  getGlobalProps: vi.fn().mockResolvedValue({
    head_block_number: 1000,
    head_block_id: '000003e8...'
  })
}))
```

### 5. Use Test Data Factories

Create reusable test data generators.

```typescript
// tests/factories.ts
export const createTestTransaction = (overrides = {}) => {
  return new Transaction({
    expiration: 60000,
    ...overrides
  })
}

export const createTestKey = () => {
  return PrivateKey.randomKey()
}

export const createTestAsset = (amount = 10, symbol = 'HIVE') => {
  return Asset.from(amount, symbol)
}
```

## Performance Testing

For performance-critical applications, include performance tests.

```typescript
import { Transaction, PrivateKey } from 'hive-tx'
import { describe, it, expect } from 'vitest'

describe('Performance', () => {
  const privateKey = PrivateKey.randomKey()

  it('should create transactions quickly', async () => {
    const startTime = performance.now()
    
    for (let i = 0; i < 100; i++) {
      const tx = new Transaction()
      await tx.addOperation('vote', {
        voter: 'testuser',
        author: 'author',
        permlink: `permlink-${i}`,
        weight: 10000
      })
    }
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    expect(duration).toBeLessThan(1000) // Should complete in under 1 second
  })

  it('should sign transactions efficiently', () => {
    const tx = new Transaction()
    // Add operations...
    
    const startTime = performance.now()
    tx.sign(privateKey)
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(100) // Should sign in under 100ms
  })
})
```

## Security Testing

Include security-focused tests for cryptographic operations.

```typescript
describe('Security', () => {
  it('should not expose private keys in logs', () => {
    const key = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
    const inspectResult = key.inspect()
    
    expect(inspectResult).toMatch(/PrivateKey: 5JdeC9...Qnsw/)
    expect(inspectResult).not.toContain('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
  })

  it('should validate signature integrity', () => {
    const key = PrivateKey.randomKey()
    const message = new Uint8Array(32).fill(1)
    const signature = key.sign(message)
    
    // Should not be able to modify signature without detection
    const modifiedSignature = signature.customToString().slice(0, -1) + '0'
    expect(modifiedSignature).not.toBe(signature.customToString())
  })
})
```

By following this testing guide, you can ensure that your hive-tx applications are reliable, secure, and performant. The comprehensive test coverage will help catch bugs early and maintain code quality as your application grows.
