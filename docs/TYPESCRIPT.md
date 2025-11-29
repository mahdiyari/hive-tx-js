# TypeScript Guide

The hive-tx library is written in TypeScript and provides comprehensive type definitions for all its APIs. This guide explains how to make the most of the TypeScript features in your Hive blockchain applications.

## Table of Contents

- [Type Safety](#type-safety)
- [Operation Types](#operation-types)
- [Asset Types](#asset-types)
- [Key Types](#key-types)
- [Transaction Types](#transaction-types)
- [API Response Types](#api-response-types)
- [Utility Types](#utility-types)
- [Best Practices](#best-practices)

## Type Safety

The hive-tx library provides full type safety for all operations, ensuring that you catch errors at compile time rather than runtime.

### Basic Type Safety

```typescript
import { Transaction, PrivateKey, Asset } from 'hive-tx'

// TypeScript will catch type errors
const tx = new Transaction()

// This will cause a compile error if the operation structure is incorrect
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Payment'
})

// Asset class provides type-safe asset handling
const hiveAmount: Asset = Asset.from('10.500 HIVE')
const hbdAmount: Asset = Asset.from(5.25, 'HBD')
```

### Strict Operation Typing

Each operation type has strict typing with required and optional fields:

```typescript
import { Transaction } from 'hive-tx'

// TypeScript ensures all required fields are present
const tx = new Transaction()

// Transfer operation - all required fields must be provided
await tx.addOperation('transfer', {
  from: 'sender',           // Required
  to: 'receiver',           // Required
  amount: '1.000 HIVE',     // Required
  memo: 'Payment memo'       // Optional
})

// Vote operation - strict field requirements
await tx.addOperation('vote', {
  voter: 'voter',           // Required
  author: 'author',         // Required
  permlink: 'post-permlink', // Required
  weight: 10000            // Required (number)
})
```

## Operation Types

The library provides specific types for each Hive operation, ensuring type safety and autocomplete support.

### Operation Union Type

```typescript
import { Operation } from 'hive-tx'

// Operation is a union type of all possible operations
const operations: Operation[] = [
  [
    'transfer',
    {
      from: 'sender',
      to: 'receiver',
      amount: '1.000 HIVE',
      memo: 'Payment'
    }
  ],
  [
    'vote',
    {
      voter: 'voter',
      author: 'author',
      permlink: 'permlink',
      weight: 10000
    }
  ]
]
```

### Operation Name and Body Types

```typescript
import { OperationName, OperationBody } from 'hive-tx'

// Extract specific operation types
type TransferOpName = Extract<Operation, ['transfer', any]>[0] // 'transfer'
type TransferOpBody = Extract<Operation, ['transfer', any]>[1]

// Or use the helper types
type OpName = OperationName // Union of all operation names
type OpBody<T extends OperationName> = OperationBody<T> // Body type for specific operation

// Example usage
const transferOpName: OpName = 'transfer'
const transferOpBody: OpBody<'transfer'> = {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Payment'
}
```

### Specific Operation Types

```typescript
import { 
  TransferOperation,
  VoteOperation,
  CommentOperation,
  AccountCreateOperation
} from 'hive-tx'

// Each operation has its specific type
const transfer: TransferOperation = {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Payment'
}

const vote: VoteOperation = {
  voter: 'voter',
  author: 'author',
  permlink: 'permlink',
  weight: 10000
}

const comment: CommentOperation = {
  parent_author: 'parent-author',
  parent_permlink: 'parent-permlink',
  author: 'author',
  permlink: 'permlink',
  title: 'Post Title',
  body: 'Post content',
  json_metadata: '{}'
}
```

## Asset Types

The Asset class and related types provide type-safe handling of Hive assets.

### Asset Symbol Types

```typescript
import { Asset, AssetSymbol } from 'hive-tx'

// AssetSymbol is a union of all valid asset symbols
const symbol: AssetSymbol = 'HIVE' // 'HIVE' | 'HBD' | 'VESTS' | 'STEEM' | 'SBD' | 'TESTS' | 'TBD'

// Asset class with type safety
const hiveAsset: Asset = Asset.from('10.500 HIVE')
const hbdAsset: Asset = Asset.from(5.25, 'HBD')
const vestsAsset: Asset = Asset.from('1000.000000 VESTS')
```

### Asset Validation

```typescript
import { Asset } from 'hive-tx'

// TypeScript ensures proper asset creation
const validAsset = Asset.from('10.500 HIVE') // ✅ Valid

// TypeScript will catch invalid symbols at compile time when possible
// const invalidAsset = Asset.from('10.500 INVALID') // ❌ Compile error

// Runtime validation for dynamic values
function createAsset(amount: number, symbol: string) {
  try {
    const asset = Asset.from(amount, symbol)
    return asset
  } catch (error) {
    console.error('Invalid asset:', error.message)
    return null
  }
}
```

## Key Types

The library provides specific types for cryptographic keys.

### PrivateKey Type

```typescript
import { PrivateKey, KeyRole } from 'hive-tx'

// PrivateKey class with type safety
const key: PrivateKey = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')

// KeyRole type for login key derivation
const role: KeyRole = 'active' // 'owner' | 'active' | 'posting' | 'memo'

const loginKey: PrivateKey = PrivateKey.fromLogin('username', 'password', role)
```

### PublicKey Type

```typescript
import { PublicKey } from 'hive-tx'

// PublicKey class with type safety
const publicKey: PublicKey = PublicKey.from('STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA')
```

### Signature Type

```typescript
import { Signature } from 'hive-tx'

// Signature class with type safety
const signature: Signature = Signature.from('1f019dc13a308cef138162cc16ab7c3aa1891941fddec66d83ff29b01b649a86600802d301f13505abc8c9ccbbeb86852fc71134fe209a6e717c6fd7b4cd1505a2')
```

## Transaction Types

The Transaction class and related types provide comprehensive type safety for blockchain transactions.

### Transaction Type

```typescript
import { Transaction, TransactionType } from 'hive-tx'

// TransactionType represents the structure of a transaction
const transaction: TransactionType = {
  expiration: '2023-12-31T23:59:59',
  extensions: [],
  operations: [
    [
      'transfer',
      {
        from: 'sender',
        to: 'receiver',
        amount: '1.000 HIVE',
        memo: 'Payment'
      }
    ]
  ],
  ref_block_num: 12345,
  ref_block_prefix: 67890,
  signatures: []
}

// Transaction class with type safety
const tx: Transaction = new Transaction()
```

### Digest Data Type

```typescript
import { DigestData } from 'hive-tx'

// DigestData type for transaction digests
const digestData: DigestData = {
  digest: new Uint8Array(32), // 32-byte hash
  txId: 'abcdef1234567890abcdef1234567890abcdef12' // 40-character transaction ID
}
```

## API Response Types

The library provides specific types for API responses.

### Call Response Types

```typescript
import { CallResponse, BroadcastResponse, BroadcastError } from 'hive-tx'

// Generic call response
const response: CallResponse<any> = await call('condenser_api.get_accounts', [['username']])

// Specific broadcast response
const broadcastResponse: BroadcastResponse = {
  id: 1,
  jsonrpc: '2.0',
  result: {
    tx_id: 'abcdef1234567890abcdef1234567890abcdef12',
    status: 'unknown'
  }
}

// Broadcast error response
const broadcastError: BroadcastError = {
  id: 1,
  jsonrpc: '2.0',
  error: {
    code: -32000,
    message: 'Insufficient funds'
  }
}
```

### Broadcast Result Types

```typescript
import { BroadcastResult } from 'hive-tx'

// Broadcast result type
const result: BroadcastResult = {
  tx_id: 'abcdef1234567890abcdef1234567890abcdef12',
  status: 'unknown'
}
```

## Utility Types

The library provides various utility types for common operations.

### Authority Types

```typescript
import { Authority } from 'hive-tx'

// Authority type for account permissions
const authority: Authority = {
  weight_threshold: 1,
  account_auths: [],
  key_auths: [
    ['STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA', 1]
  ]
}
```

### Beneficiary Types

```typescript
import { Beneficiary } from 'hive-tx'

// Beneficiary type for comment options
const beneficiary: Beneficiary = {
  account: 'beneficiary-account',
  weight: 1000 // 10%
}
```

### Price Types

```typescript
import { Price, Asset } from 'hive-tx'

// Price type for exchange rates
const price: Price = {
  base: Asset.from('1.000 HBD'),
  quote: Asset.from('5.000 HIVE')
}
```

### Witness Property Types

```typescript
import { WitnessProps } from 'hive-tx'

// Witness properties type
const witnessProps: WitnessProps = {
  key: 'STM1111111111111111111111111111111114T1Anm',
  account_creation_fee: '0.000 HIVE',
  maximum_block_size: 65536,
  hbd_interest_rate: 0
}
```

## Best Practices

### Use Type Inference

```typescript
import { Transaction, PrivateKey } from 'hive-tx'

// Let TypeScript infer types when possible
const tx = new Transaction() // Type inferred as Transaction
const key = PrivateKey.from('your-key') // Type inferred as PrivateKey

// Use explicit typing for function parameters and return values
async function createTransfer(
  from: string,
  to: string,
  amount: string,
  memo?: string
): Promise<void> {
  const tx = new Transaction()
  await tx.addOperation('transfer', { from, to, amount, memo })
}
```

### Leverage Union Types

```typescript
import { OperationName, OperationBody } from 'hive-tx'

// Create generic functions using union types
function logOperation<O extends OperationName>(
  name: O,
  body: OperationBody<O>
): void {
  console.log(`Operation: ${name}`, body)
}

// TypeScript ensures type safety
logOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE'
}) // ✅ Valid

// logOperation('transfer', { voter: 'voter' }) // ❌ Compile error
```

### Use Type Guards

```typescript
import { CallResponse, BroadcastError } from 'hive-tx'

// Type guard for error responses
function isBroadcastError(response: CallResponse<any>): response is BroadcastError {
  return 'error' in response
}

// Safe error handling
async function safeBroadcast() {
  try {
    const response = await call('condenser_api.get_accounts', [['username']])
    
    if (isBroadcastError(response)) {
      console.error('API Error:', response.error.message)
      return
    }
    
    console.log('Success:', response.result)
  } catch (error) {
    console.error('Network Error:', error.message)
  }
}
```

### Generic Constraints

```typescript
import { Transaction, OperationName, OperationBody } from 'hive-tx'

// Use generic constraints for maximum type safety
class TransactionBuilder {
  private tx: Transaction
  
  constructor() {
    this.tx = new Transaction()
  }
  
  async addOperation<O extends OperationName>(
    name: O,
    body: OperationBody<O>
  ): Promise<this> {
    await this.tx.addOperation(name, body)
    return this
  }
  
  build() {
    return this.tx
  }
}

// Usage with full type safety
const builder = new TransactionBuilder()
await builder
  .addOperation('transfer', {
    from: 'sender',
    to: 'receiver',
    amount: '1.000 HIVE'
  })
  .addOperation('vote', {
    voter: 'voter',
    author: 'author',
    permlink: 'permlink',
    weight: 10000
  })

const tx = builder.build()
```

### Type-Safe Configuration

```typescript
import { Config } from 'hive-tx'

// Type-safe configuration
const config: Config = {
  address_prefix: 'STM',
  chain_id: 'beeab0de00000000000000000000000000000000000000000000000000000000',
  node: [
    'https://api.hive.blog',
    'https://api.deathwing.me'
  ],
  timeout: 5,
  retry: 5,
  healthcheckInterval: 30000
}
```

## Advanced TypeScript Features

### Conditional Types

```typescript
import { OperationName, OperationBody } from 'hive-tx'

// Conditional types for operation-specific logic
type RequiresActiveKey<O extends OperationName> = 
  O extends 'transfer' | 'transfer_to_vesting' | 'withdraw_vesting' 
    ? true 
    : false

// Use conditional types in functions
function requiresActiveKey<O extends OperationName>(operation: O): RequiresActiveKey<O> {
  const activeOps = ['transfer', 'transfer_to_vesting', 'withdraw_vesting']
  return activeOps.includes(operation) as RequiresActiveKey<O>
}
```

### Template Literal Types

```typescript
import { AssetSymbol } from 'hive-tx'

// Template literal types for formatted strings
type AssetString = `${number} ${AssetSymbol}`

function formatAsset(amount: number, symbol: AssetSymbol): AssetString {
  return `${amount.toFixed(3)} ${symbol}` as AssetString
}

const assetString: AssetString = formatAsset(10.5, 'HIVE') // "10.500 HIVE"
```

### Mapped Types

```typescript
import { OperationName } from 'hive-tx'

// Mapped types for operation permissions
type OperationPermissions = {
  [K in OperationName]: 'posting' | 'active' | 'owner'
}

const permissions: OperationPermissions = {
  vote: 'posting',
  comment: 'posting',
  transfer: 'active',
  // ... all operations mapped to their required key types
}
```

## Migration from JavaScript

### Adding Types to Existing Code

```typescript
// Before (JavaScript)
const tx = new Transaction()
tx.create(operations)

// After (TypeScript)
import { Transaction } from 'hive-tx'

const tx: Transaction = new Transaction()
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE'
})
```

### Type-Only Imports

```typescript
import type { TransactionType, Operation } from 'hive-tx'
import { Transaction } from 'hive-tx'

// Use type-only imports for types to reduce bundle size
const operations: Operation[] = []
const transaction: TransactionType = {
  // ... transaction data
}

const tx = new Transaction()
```

## IDE Integration

### Autocomplete

The TypeScript types provide excellent autocomplete support in modern IDEs:

- Operation names and structures
- Method parameters and return types
- Asset symbols and formatting
- Key management methods
- Configuration options

### Error Detection

TypeScript catches common errors at compile time:

- Missing required operation fields
- Incorrect asset formats
- Invalid key types
- Wrong method parameters
- Type mismatches in configurations

## Performance Considerations

### Type Erasure

TypeScript types are erased at runtime, so they don't impact performance:

```typescript
// TypeScript types provide compile-time safety
const tx = new Transaction()
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE'
})

// But at runtime, it's just JavaScript
// No performance overhead from types
```

### Tree Shaking

Use type-only imports to enable better tree shaking:

```typescript
import type { AssetSymbol } from 'hive-tx' // Type-only import
import { Asset } from 'hive-tx' // Runtime import

const symbol: AssetSymbol = 'HIVE'
const asset = Asset.from(10, symbol)
```

## Conclusion

The hive-tx library's comprehensive TypeScript support provides:

1. **Compile-time Safety**: Catch errors before runtime
2. **Better Developer Experience**: Autocomplete and inline documentation
3. **Refactoring Support**: Safe renaming and restructuring
4. **Documentation**: Types serve as living documentation
5. **Zero Runtime Overhead**: Types are erased at runtime

By leveraging these TypeScript features, you can build more reliable and maintainable Hive blockchain applications.
