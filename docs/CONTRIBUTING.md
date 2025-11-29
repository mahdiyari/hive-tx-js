# Contributing to Hive Transaction Library

Thank you for your interest in contributing to the hive-tx library! This guide will help you understand how to contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Community](#community)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming and inclusive environment for all contributors. By participating, you agree to:

- Be respectful and considerate
- Use inclusive language
- Accept constructive feedback gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
```bash
git clone https://github.com/your-username/hive-tx-js.git
cd hive-tx-js
```

3. Add the upstream repository:
```bash
git remote add upstream https://github.com/mahdiyari/hive-tx-js.git
```

### Install Dependencies

```bash
npm install
```

## Development Setup

### Build Process

The library supports multiple build targets:

```bash
# Build all targets
npm run build

# Build Node.js targets only
npm run build:node

# Build ESM target
npm run build:esm

# Build CommonJS target
npm run build:cjs

# Build browser target
npm run build:browser

# Clean build directory
npm run build:clean
```

### Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Run tests:
```bash
npm test
```

4. Format code:
```bash
npm run format
```

5. Build the project:
```bash
npm run build
```

## Project Structure

```
hive-tx-js/
├── src/                    # Source code
│   ├── helpers/           # Helper functions and classes
│   │   ├── aes.ts         # AES encryption utilities
│   │   ├── Asset.ts       # Asset handling
│   │   ├── ByteBuffer.ts   # Binary buffer utilities
│   │   ├── call.ts        # API call utilities
│   │   ├── deserializer.ts # Data deserialization
│   │   ├── globalProps.ts # Global blockchain properties
│   │   ├── HexBuffer.ts   # Hex buffer utilities
│   │   ├── memo.ts        # Memo encryption/decryption
│   │   ├── PrivateKey.ts   # Private key handling
│   │   ├── PublicKey.ts   # Public key handling
│   │   ├── serializer.ts   # Data serialization
│   │   ├── Signature.ts   # Signature handling
│   │   └── utils.ts       # Utility functions
│   ├── config.ts          # Configuration
│   ├── index.ts           # Main entry point
│   ├── Transaction.ts     # Transaction class
│   └── types.ts           # TypeScript types
├── dist/                  # Built output
├── docs/                  # Documentation
├── examples/              # Example usage
├── tests/                 # Test files
├── package.json           # Package configuration
└── tsconfig.json          # TypeScript configuration
```

### Key Components

#### Transaction Class (`src/Transaction.ts`)

The main class for handling blockchain transactions. Key methods include:
- `addOperation()` - Add operations to transaction
- `sign()` - Sign transaction with private keys
- `broadcast()` - Broadcast transaction to network
- `digest()` - Get transaction digest and ID

#### PrivateKey Class (`src/helpers/PrivateKey.ts`)

Handles private key operations:
- `from()` - Create from WIF or bytes
- `fromString()` - Create from WIF string
- `fromSeed()` - Derive from seed
- `fromLogin()` - Derive from username/password
- `sign()` - Sign messages
- `createPublic()` - Derive public key

#### PublicKey Class (`src/helpers/PublicKey.ts`)

Handles public key operations:
- `fromString()` - Create from string
- `verify()` - Verify signatures
- `toString()` - Convert to string

#### Signature Class (`src/helpers/Signature.ts`)

Handles digital signatures:
- `from()` - Create from hex string
- `customToString()` - Convert to hex string
- `getPublicKey()` - Recover public key

#### Asset Class (`src/helpers/Asset.ts`)

Handles asset formatting:
- `fromString()` - Parse from string
- `from()` - Create from various inputs
- `toString()` - Format as string

## Coding Standards

### TypeScript Guidelines

1. **Use TypeScript Strictly**
```typescript
// Good - Explicit types
interface TransactionOptions {
  transaction?: TransactionType
  expiration?: number
}

class Transaction {
  constructor(options?: TransactionOptions) {
    // ...
  }
}

// Avoid - Implicit any
function badFunction(data) {
  // ...
}
```

2. **Use Union Types for Operations**
```typescript
// Good - Type-safe operations
type Operation = 
  | ['transfer', TransferOperation]
  | ['vote', VoteOperation]
  | ['comment', CommentOperation]

// Use generic constraints
async addOperation<O extends OperationName>(
  name: O,
  body: OperationBody<O>
): Promise<void> {
  // ...
}
```

3. **Export Types Properly**
```typescript
// Good - Separate types from implementation
// types.ts
export interface TransferOperation {
  from: string
  to: string
  amount: string
  memo?: string
}

// helpers/transfer.ts
import { TransferOperation } from '../types'

export const createTransfer = (data: TransferOperation) => {
  // ...
}
```

### Code Style

1. **Follow Prettier Configuration**
```bash
npm run format
```

2. **Use Descriptive Names**
```typescript
// Good
class PrivateKey {
  createPublic(): PublicKey { /* ... */ }
}

// Avoid
class PK {
  pub(): PublicKey { /* ... */ }
}
```

3. **Write Clear Comments**
```typescript
/**
 * Creates a PrivateKey instance from a WIF string or raw Uint8Array.
 * Automatically detects the input type and uses the appropriate method.
 *
 * @param value - WIF formatted string or raw 32-byte key as Uint8Array
 * @returns New PrivateKey instance
 * @throws Error if the key format is invalid
 */
static from(value: string | Uint8Array): PrivateKey {
  // ...
}
```

### Error Handling

1. **Use Specific Error Messages**
```typescript
// Good
if (!isValidWif(wif)) {
  throw new Error(`Invalid WIF format: ${wif}`)
}

// Avoid
if (!isValidWif(wif)) {
  throw new Error('Invalid key')
}
```

2. **Handle Async Errors**
```typescript
// Good
async function apiCall(): Promise<any> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network connectivity issue')
    }
    throw error
  }
}
```

### Performance Considerations

1. **Minimize Object Creation**
```typescript
// Good - Reuse buffers when possible
const buffer = new ByteBuffer()
// Reuse buffer for multiple operations

// Avoid - Creating new objects unnecessarily
const buffer1 = new ByteBuffer()
const buffer2 = new ByteBuffer()
// ...
```

2. **Use Efficient Algorithms**
```typescript
// Good - O(1) lookup
const operationIds = {
  transfer: 2,
  vote: 0,
  comment: 1
}

// Avoid - O(n) search
const operations = [
  { name: 'vote', id: 0 },
  { name: 'comment', id: 1 },
  { name: 'transfer', id: 2 }
]
const transferId = operations.find(op => op.name === 'transfer')?.id
```

## Testing

### Test Structure

Follow the existing test patterns:

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
  })
})
```

### Test Coverage

Aim for comprehensive test coverage:

1. **Unit Tests** - Test individual functions and methods
2. **Integration Tests** - Test component interactions
3. **Edge Cases** - Test error conditions and boundary values
4. **Performance Tests** - Test efficiency for critical operations

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx vitest tests/transaction.test.ts
```

### Writing Good Tests

1. **Use Descriptive Test Names**
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

2. **Test One Thing Per Test**
```typescript
// Good
it('should create transaction from existing data', () => {
  // Test one specific behavior
})

it('should handle expiration configuration', () => {
  // Test another specific behavior
})

// Avoid
it('should handle everything', () => {
  // Test multiple unrelated things
})
```

3. **Use Test Data Factories**
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
```

## Documentation

### JSDoc Comments

All public APIs should have comprehensive JSDoc comments:

```typescript
/**
 * Creates a PrivateKey instance from a WIF string or raw Uint8Array.
 * Automatically detects the input type and uses the appropriate method.
 *
 * @param value - WIF formatted string or raw 32-byte key as Uint8Array
 * @returns New PrivateKey instance
 * @throws Error if the key format is invalid
 *
 * @example
 * ```typescript
 * // From WIF string
 * const key = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
 *
 * // From raw bytes
 * const key = PrivateKey.from(new Uint8Array(32))
 * ```
 */
static from(value: string | Uint8Array): PrivateKey {
  // ...
}
```

### README Updates

Keep the README up to date with:
- New features
- API changes
- Usage examples
- Configuration options

### API Documentation

Update the `docs/API.md` file when adding or modifying APIs.

### Examples

Add or update examples in `docs/examples/` to demonstrate new features.

## Pull Request Process

### Before Submitting

1. **Sync with Upstream**
```bash
git fetch upstream
git checkout main
git merge upstream/main
git checkout your-branch
git rebase main
```

2. **Run All Checks**
```bash
npm run format
npm test
npm run build
```

3. **Update Documentation**
- Update JSDoc comments
- Update README if needed
- Add examples for new features

### Pull Request Guidelines

1. **Use Clear Titles**
```
Good: "Add support for recurrent transfer operations"
Avoid: "Fix stuff"
```

2. **Provide Detailed Description**
- What changed and why
- How to test the changes
- Any breaking changes
- Related issues or discussions

3. **Include Tests**
- Unit tests for new functionality
- Integration tests for complex features
- Update existing tests if APIs changed

4. **Keep PRs Focused**
- One feature or bug fix per PR
- Avoid mixing unrelated changes
- Break large changes into smaller PRs

### PR Review Process

1. **Automated Checks**
- CI tests must pass
- Code coverage requirements
- Linting checks

2. **Manual Review**
- Code quality and style
- API design and consistency
- Documentation completeness
- Test coverage

3. **Merge Requirements**
- At least one approved review
- All CI checks passing
- No merge conflicts

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Clear Description**
- What you expected to happen
- What actually happened
- Steps to reproduce

2. **Environment Information**
- Node.js version
- hive-tx version
- Operating system
- Browser (if applicable)

3. **Code Example**
```javascript
// Minimal code to reproduce the issue
const tx = new Transaction()
// ...
```

4. **Error Messages**
```
// Full error output
Error: Invalid transaction format
    at Transaction.sign (.../Transaction.ts:123:15)
```

### Feature Requests

For new features, include:

1. **Use Case Description**
- Why this feature is needed
- Who would benefit
- Current workarounds

2. **API Design**
- Proposed API changes
- Usage examples
- Backward compatibility

3. **Implementation Considerations**
- Technical challenges
- Performance impact
- Security implications

## Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and discussions
- **Pull Requests** - Code reviews and contributions

### Getting Help

1. **Check Documentation First**
- README.md
- docs/API.md
- docs/examples/

2. **Search Existing Issues**
- GitHub issues search
- Stack Overflow
- Community forums

3. **Ask Clear Questions**
- Include version information
- Provide minimal reproduction
- Show what you've tried

### Code Reviews

When reviewing others' code:

1. **Be Constructive**
- Focus on code quality, not personal criticism
- Suggest improvements rather than just pointing out issues
- Explain reasoning behind suggestions

2. **Check for**
- Code correctness and efficiency
- API consistency and design
- Documentation completeness
- Test coverage
- Security considerations

3. **Approve Thoughtfully**
- Ensure all feedback is addressed
- Verify CI checks pass
- Consider long-term maintainability

## Release Process

### Versioning

Follow semantic versioning:
- **Major** - Breaking changes
- **Minor** - New features, backward compatible
- **Patch** - Bug fixes, backward compatible

### Release Checklist

1. **Pre-release**
- Update version in package.json
- Update CHANGELOG.md
- Run all tests
- Build all targets

2. **Release**
- Create Git tag
- Publish to npm
- Update documentation
- Announce release

3. **Post-release**
- Monitor for issues
- Update examples if needed
- Plan next release

## Security

### Reporting Security Issues

For security vulnerabilities:
1. Contact maintainers directly
2. Do not disclose publicly until fixed
3. Provide detailed reproduction steps
4. Include potential impact assessment

### Security Best Practices

1. **Dependency Management**
- Regular security audits
- Keep dependencies updated
- Use npm audit to check vulnerabilities

2. **Code Security**
- Validate all inputs
- Handle errors gracefully
- Avoid exposing sensitive data
- Use secure random number generation

3. **Cryptographic Security**
- Use well-established libraries
- Follow cryptographic best practices
- Regular security reviews
- Stay updated with security advisories

## License

By contributing to hive-tx, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- Git commit history
- GitHub contributors list
- Release notes
- Documentation credits

Thank you for helping make hive-tx better for everyone!
