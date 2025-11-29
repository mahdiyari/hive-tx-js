# Security Guide

This guide covers security best practices for using the hive-tx library and contributing to its development.

## Table of Contents

- [Security Overview](#security-overview)
- [Key Management](#key-management)
- [Transaction Security](#transaction-security)
- [API Security](#api-security)
- [Memo Security](#memo-security)
- [Network Security](#network-security)
- [Dependency Security](#dependency-security)
- [Reporting Security Issues](#reporting-security-issues)
- [Security Testing](#security-testing)
- [Compliance](#compliance)

## Security Overview

The hive-tx library implements industry-standard security practices for blockchain applications. Understanding these security measures helps you use the library safely and contribute to its security.

### Core Security Principles

1. **Cryptographic Security**
   - Uses battle-tested cryptographic libraries (@noble/*)
   - Implements standard ECDSA (secp256k1) for key operations
   - Follows established blockchain security patterns

2. **Key Protection**
   - Never logs private keys
   - Provides masked key representations for debugging
   - Secure key derivation from seeds and passwords

3. **Data Integrity**
   - Cryptographic hashing for transaction verification
   - Signature validation for authenticity
   - Secure serialization/deserialization

4. **Network Security**
   - HTTPS-only API connections
   - Retry mechanisms with failover
   - Input validation and sanitization

## Key Management

Proper key management is critical for blockchain security.

### Private Key Handling

```typescript
import { PrivateKey } from 'hive-tx'

// ✅ Good - Secure key handling
const key = PrivateKey.from(process.env.PRIVATE_KEY)

// Avoid logging private keys
console.log(key.toString()) // ❌ Never log private keys
console.log(key.inspect()) // ✅ Safe masked representation

// Secure key storage
class KeyManager {
  private keys: Map<string, PrivateKey> = new Map()

  addKey(id: string, key: string | PrivateKey) {
    const privateKey = typeof key === 'string' ? PrivateKey.from(key) : key
    this.keys.set(id, privateKey)
  }

  getKey(id: string): PrivateKey | undefined {
    return this.keys.get(id)
  }

  // Never expose private keys
  hasKey(id: string): boolean {
    return this.keys.has(id)
  }

  removeKey(id: string): boolean {
    return this.keys.delete(id)
  }
}
```

### Key Derivation Security

```typescript
import { PrivateKey } from 'hive-tx'

// ✅ Good - Proper key derivation
const postingKey = PrivateKey.fromLogin('username', 'strong-password', 'posting')
const activeKey = PrivateKey.fromLogin('username', 'strong-password', 'active')

// ✅ Good - Seed-based derivation
const seedKey = PrivateKey.fromSeed('cryptographically-secure-seed')

// ✅ Good - Random key generation
const randomKey = PrivateKey.randomKey()
```

### Key Exposure Prevention

```typescript
// Environment variable management
class SecureConfig {
  static getPrivateKey(): PrivateKey {
    const key = process.env.HIVE_PRIVATE_KEY
    if (!key) {
      throw new Error('Private key not configured')
    }
    return PrivateKey.from(key)
  }

  static getKeyFromSecureStorage(keyId: string): PrivateKey {
    // Implementation for secure key storage (e.g., keychain, vault)
    const encryptedKey = this.retrieveFromSecureStorage(keyId)
    const decryptedKey = this.decryptKey(encryptedKey)
    return PrivateKey.from(decryptedKey)
  }
}
```

## Transaction Security

Transactions must be handled securely to prevent unauthorized operations.

### Transaction Validation

```typescript
import { Transaction, PrivateKey } from 'hive-tx'

class SecureTransactionBuilder {
  private transaction: Transaction
  private authorizedKeys: Set<string> = new Set()

  constructor() {
    this.transaction = new Transaction()
  }

  async addAuthorizedOperation(
    operationName: string,
    operationBody: any,
    requiredKey: PrivateKey
  ): Promise<void> {
    // Validate operation parameters
    this.validateOperation(operationName, operationBody)
    
    // Verify key authorization
    if (!this.isKeyAuthorized(requiredKey)) {
      throw new Error('Unauthorized key for this operation')
    }

    await this.transaction.addOperation(operationName, operationBody)
    this.authorizedKeys.add(requiredKey.toString())
  }

  private validateOperation(operationName: string, operationBody: any): void {
    // Implement operation-specific validation
    switch (operationName) {
      case 'transfer':
        this.validateTransfer(operationBody)
        break
      case 'vote':
        this.validateVote(operationBody)
        break
      // Add other operation validations
    }
  }

  private validateTransfer(transfer: any): void {
    if (!transfer.from || !transfer.to || !transfer.amount) {
      throw new Error('Invalid transfer parameters')
    }
    
    // Validate amount format
    if (!/^\d+(\.\d+)? [A-Z]+$/.test(transfer.amount)) {
      throw new Error('Invalid amount format')
    }
    
    // Validate account names
    if (!this.isValidAccountName(transfer.from) || 
        !this.isValidAccountName(transfer.to)) {
      throw new Error('Invalid account name')
    }
  }

  private isValidAccountName(name: string): boolean {
    return /^[a-z][a-z0-9\-\.]{2,15}$/.test(name)
  }

  private isKeyAuthorized(key: PrivateKey): boolean {
    // Implement key authorization logic
    return this.authorizedKeys.has(key.toString()) || 
           this.authorizedKeys.size === 0 // First key is always authorized
  }
}
```

### Multi-Signature Security

```typescript
import { Transaction, PrivateKey } from 'hive-tx'

class MultiSigTransaction {
  private transaction: Transaction
  private requiredSignatures: number
  private authorizedKeys: Set<string> = new Set()
  private signedKeys: Set<string> = new Set()

  constructor(requiredSignatures: number) {
    this.transaction = new Transaction()
    this.requiredSignatures = requiredSignatures
  }

  addAuthorizedKey(key: PrivateKey): void {
    this.authorizedKeys.add(key.toString())
  }

  sign(key: PrivateKey): void {
    if (!this.authorizedKeys.has(key.toString())) {
      throw new Error('Unauthorized key')
    }

    if (this.signedKeys.has(key.toString())) {
      throw new Error('Key already used to sign')
    }

    this.transaction.sign(key)
    this.signedKeys.add(key.toString())

    if (this.signedKeys.size > this.requiredSignatures) {
      throw new Error('Too many signatures')
    }
  }

  isReadyToBroadcast(): boolean {
    return this.signedKeys.size >= this.requiredSignatures
  }

  async broadcast(): Promise<any> {
    if (!this.isReadyToBroadcast()) {
      throw new Error('Not enough signatures')
    }
    
    return await this.transaction.broadcast()
  }
}
```

## API Security

API calls must be secured to prevent unauthorized access and data exposure.

### Secure API Configuration

```typescript
import { config, call } from 'hive-tx'

// Secure node configuration
class SecureNodeConfig {
  private static readonly TRUSTED_NODES = [
    'https://api.hive.blog',
    'https://api.deathwing.me',
    'https://rpc.mahdiyari.info'
  ]

  static configureNodes(): void {
    // Use only trusted nodes
    config.node = [...this.TRUSTED_NODES]
    
    // Set appropriate timeouts
    config.timeout = 10 // 10 seconds
    config.retry = 3   // 3 retries
    
    // Configure health check interval
    config.healthcheckInterval = 30000 // 30 seconds
  }

  static async validateNode(nodeUrl: string): Promise<boolean> {
    try {
      // Test node connectivity and validity
      const response = await fetch(nodeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'condenser_api.get_dynamic_global_properties',
          params: [],
          id: 1
        })
      })

      return response.ok
    } catch {
      return false
    }
  }
}
```

### API Call Security

```typescript
import { call } from 'hive-tx'

class SecureAPIClient {
  private static readonly RATE_LIMIT_WINDOW = 1000 // 1 second
  private static readonly MAX_CALLS_PER_WINDOW = 10
  private static callCount: number = 0
  private static lastReset: number = Date.now()

  static async secureCall(method: string, params: any[]): Promise<any> {
    // Rate limiting
    this.enforceRateLimit()

    try {
      // Input validation
      this.validateMethod(method)
      this.validateParams(params)

      const response = await call(method, params, 10, 3)
      
      // Response validation
      this.validateResponse(response)
      
      return response
    } catch (error) {
      // Secure error handling
      throw this.sanitizeError(error)
    }
  }

  private static enforceRateLimit(): void {
    const now = Date.now()
    if (now - this.lastReset > this.RATE_LIMIT_WINDOW) {
      this.callCount = 0
      this.lastReset = now
    }

    if (this.callCount >= this.MAX_CALLS_PER_WINDOW) {
      throw new Error('Rate limit exceeded')
    }

    this.callCount++
  }

  private static validateMethod(method: string): void {
    const allowedMethods = [
      'condenser_api.get_accounts',
      'condenser_api.get_dynamic_global_properties',
      'condenser_api.get_content',
      // Add other allowed methods
    ]

    if (!allowedMethods.includes(method)) {
      throw new Error('Method not allowed')
    }
  }

  private static validateParams(params: any[]): void {
    // Implement parameter validation based on method
    if (params.some(param => typeof param === 'object' && param !== null)) {
      // Deep validation for complex parameters
      this.validateComplexParams(params)
    }
  }

  private static validateResponse(response: any): void {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid API response')
    }

    if (response.error) {
      throw new Error(`API Error: ${response.error.message}`)
    }
  }

  private static sanitizeError(error: any): Error {
    // Remove sensitive information from error messages
    const message = error.message || 'Unknown error'
    const sanitizedMessage = message
      .replace(/5[KLM][1-9A-HJ-NP-Za-km-z]{40,50}/g, '[PRIVATE_KEY]')
      .replace(/[0-9a-f]{130}/g, '[SIGNATURE]')
    
    return new Error(sanitizedMessage)
  }
}
```

## Memo Security

Encrypted memos require special security considerations.

### Secure Memo Handling

```typescript
import { Memo, PrivateKey, PublicKey } from 'hive-tx'

class SecureMemoHandler {
  static async encryptMemo(
    senderKey: PrivateKey,
    recipientKey: PublicKey,
    message: string
  ): Promise<string> {
    // Validate input
    if (!message.startsWith('#')) {
      throw new Error('Memo must start with # for encryption')
    }

    if (message.length > 2048) {
      throw new Error('Memo too long')
    }

    try {
      const encrypted = await Memo.encode(senderKey, recipientKey, message)
      return this.sanitizeMemo(encrypted)
    } catch (error) {
      throw new Error('Failed to encrypt memo')
    }
  }

  static async decryptMemo(
    recipientKey: PrivateKey,
    encryptedMemo: string
  ): Promise<string> {
    // Validate input
    if (!encryptedMemo.startsWith('#')) {
      return encryptedMemo // Return plain text as-is
    }

    try {
      const decrypted = await Memo.decode(recipientKey, encryptedMemo)
      return this.sanitizeMemo(decrypted)
    } catch (error) {
      throw new Error('Failed to decrypt memo')
    }
  }

  private static sanitizeMemo(memo: string): string {
    // Remove any potential sensitive data patterns
    return memo
      .replace(/5[KLM][1-9A-HJ-NP-Za-km-z]{40,50}/g, '[PRIVATE_KEY]')
      .replace(/[0-9a-f]{130}/g, '[SIGNATURE]')
  }
}
```

### Memo Key Management

```typescript
class MemoKeyManager {
  private static readonly KEY_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  private memoKeys: Map<string, {
    key: PublicKey,
    timestamp: number
  }> = new Map()

  async getMemoKey(accountName: string): Promise<PublicKey> {
    const cached = this.memoKeys.get(accountName)
    
    if (cached && (Date.now() - cached.timestamp) < this.KEY_CACHE_TTL) {
      return cached.key
    }

    // Fetch fresh memo key
    const accounts = await call('condenser_api.get_accounts', [[accountName]])
    if (!accounts.result || accounts.result.length === 0) {
      throw new Error('Account not found')
    }

    const memoKey = PublicKey.from(accounts.result[0].memo_key)
    this.memoKeys.set(accountName, {
      key: memoKey,
      timestamp: Date.now()
    })

    return memoKey
  }

  clearExpiredKeys(): void {
    const now = Date.now()
    for (const [account, entry] of this.memoKeys.entries()) {
      if ((now - entry.timestamp) >= this.KEY_CACHE_TTL) {
        this.memoKeys.delete(account)
      }
    }
  }
}
```

## Network Security

Network communications must be secured to prevent interception and tampering.

### Secure Connection Handling

```typescript
import { config } from 'hive-tx'
import { Agent } from 'https'

class SecureNetworkConfig {
  static configureSecureConnections(): void {
    // Ensure HTTPS is used
    config.node = config.node.map(node => {
      if (node.startsWith('http://')) {
        console.warn('Insecure HTTP connection detected, upgrading to HTTPS')
        return node.replace('http://', 'https://')
      }
      return node
    })

    // Configure secure HTTP agent (Node.js only)
    if (typeof window === 'undefined') {
      // Node.js environment
      const httpsAgent = new Agent({
        rejectUnauthorized: true,
        keepAlive: true,
        keepAliveMsecs: 1000
      })
      
      // Configure axios adapter if needed
      // config.axiosAdapter = // Custom secure adapter
    }
  }

  static validateCertificate(hostname: string, cert: any): boolean {
    // Implement certificate validation logic
    // This is typically handled by the HTTPS library
    return true
  }
}
```

### Request Security

```typescript
class SecureRequestHandler {
  private static readonly MAX_REDIRECTS = 3
  private static readonly TIMEOUT = 15000 // 15 seconds

  static async makeSecureRequest(url: string, options: any): Promise<any> {
    // Validate URL
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'https:') {
      throw new Error('Only HTTPS connections allowed')
    }

    // Implement request security measures
    const secureOptions = {
      ...options,
      timeout: this.TIMEOUT,
      maxRedirects: this.MAX_REDIRECTS,
      // Add security headers
      headers: {
        ...options.headers,
        'User-Agent': 'hive-tx-secure-client/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    // Make request with security measures
    return this.secureFetch(url, secureOptions)
  }

  private static async secureFetch(url: string, options: any): Promise<any> {
    // Implement secure fetch with additional security checks
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      
      throw error
    }
  }
}
```

## Dependency Security

Dependencies must be carefully managed to prevent security vulnerabilities.

### Dependency Management

```json
{
  "scripts": {
    "audit": "npm audit",
    "audit-fix": "npm audit fix",
    "audit-force": "npm audit fix --force"
  }
}
```

### Security-Audited Dependencies

The hive-tx library uses security-focused dependencies:

1. **@noble/ciphers** - Audited cryptographic library
2. **@noble/curves** - Battle-tested elliptic curve implementations
3. **@noble/hashes** - Secure hash function implementations
4. **bs58** - Base58 encoding with security considerations
5. **ofetch** - Secure HTTP client

### Dependency Update Policy

```typescript
// Regular security audit script
class DependencySecurity {
  static async runSecurityAudit(): Promise<void> {
    console.log('Running security audit...')
    
    // Check for known vulnerabilities
    const { execSync } = require('child_process')
    
    try {
      execSync('npm audit', { stdio: 'inherit' })
      console.log('Security audit completed successfully')
    } catch (error) {
      console.error('Security audit failed:', error.message)
      process.exit(1)
    }
  }

  static async updateDependencies(): Promise<void> {
    console.log('Updating dependencies...')
    
    try {
      execSync('npm update', { stdio: 'inherit' })
      console.log('Dependencies updated successfully')
    } catch (error) {
      console.error('Dependency update failed:', error.message)
    }
  }
}
```

## Reporting Security Issues

### Responsible Disclosure

If you discover a security vulnerability:

1. **Do NOT** create a public issue
2. **Do NOT** disclose the vulnerability publicly
3. **Contact** the maintainers directly
4. **Provide** detailed information about the vulnerability
5. **Allow** time for the issue to be fixed before disclosure

### Security Contact

- **Email**: Security issues should be reported to the project maintainers
- **Response Time**: Within 48 hours
- **Resolution Time**: Within 30 days for critical issues

### Vulnerability Details

When reporting a vulnerability, include:

```markdown
## Vulnerability Report

**Summary**: Brief description of the vulnerability

**Affected Versions**: List of affected versions

**Severity**: Critical/High/Medium/Low

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Impact**: Potential impact of the vulnerability

**Suggested Fix**: Suggested solution (optional)

**Environment**: 
- Node.js version:
- hive-tx version:
- Operating system:
```

## Security Testing

### Cryptographic Testing

```typescript
import { PrivateKey, PublicKey, Signature } from 'hive-tx'
import { sha256 } from '@noble/hashes/sha2'

class CryptographicSecurityTests {
  static testKeyGeneration(): void {
    // Test key generation randomness
    const key1 = PrivateKey.randomKey()
    const key2 = PrivateKey.randomKey()
    
    if (key1.toString() === key2.toString()) {
      throw new Error('Key generation not random')
    }

    console.log('✓ Key generation randomness test passed')
  }

  static testSignatureIntegrity(): void {
    const key = PrivateKey.randomKey()
    const message = sha256('test message')
    
    // Test signature creation
    const signature = key.sign(message)
    
    // Test signature verification
    const publicKey = key.createPublic()
    const isValid = publicKey.verify(message, signature)
    
    if (!isValid) {
      throw new Error('Signature verification failed')
    }

    // Test signature modification detection
    const sigString = signature.customToString()
    const modifiedSig = sigString.slice(0, -1) + '0'
    
    if (sigString === modifiedSig) {
      throw new Error('Signature modification not detected')
    }

    console.log('✓ Signature integrity test passed')
  }

  static testKeyDerivation(): void {
    const key1 = PrivateKey.fromLogin('user1', 'password1', 'posting')
    const key2 = PrivateKey.fromLogin('user1', 'password2', 'posting')
    const key3 = PrivateKey.fromLogin('user2', 'password1', 'posting')
    
    // Keys should be different for different inputs
    if (key1.toString() === key2.toString()) {
      throw new Error('Key derivation not unique')
    }

    if (key1.toString() === key3.toString()) {
      throw new Error('Key derivation not unique')
    }

    console.log('✓ Key derivation uniqueness test passed')
  }
}
```

### Input Validation Testing

```typescript
class InputValidationTests {
  static testPrivateKeyValidation(): void {
    // Test valid private key
    const validKey = '5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw'
    try {
      PrivateKey.from(validKey)
      console.log('✓ Valid private key accepted')
    } catch {
      throw new Error('Valid private key rejected')
    }

    // Test invalid private keys
    const invalidKeys = [
      'invalid-key',
      '5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQns', // Wrong length
      '', // Empty string
      '5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnswX' // Too long
    ]

    for (const key of invalidKeys) {
      try {
        PrivateKey.from(key)
        throw new Error(`Invalid private key accepted: ${key}`)
      } catch {
        console.log(`✓ Invalid private key rejected: ${key}`)
      }
    }
  }

  static testPublicKeyValidation(): void {
    // Test valid public key
    const validKey = 'STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA'
    try {
      PublicKey.from(validKey)
      console.log('✓ Valid public key accepted')
    } catch {
      throw new Error('Valid public key rejected')
    }

    // Test invalid public keys
    const invalidKeys = [
      'invalid-key',
      'STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbv', // Wrong length
      '', // Empty string
      'STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvAX' // Too long
    ]

    for (const key of invalidKeys) {
      try {
        PublicKey.from(key)
        throw new Error(`Invalid public key accepted: ${key}`)
      } catch {
        console.log(`✓ Invalid public key rejected: ${key}`)
      }
    }
  }
}
```

## Compliance

### Security Standards

The hive-tx library follows these security standards:

1. **OWASP Top 10** - Protection against common web application vulnerabilities
2. **NIST Cybersecurity Framework** - Risk management and security controls
3. **ISO 27001** - Information security management
4. **Blockchain Security Standards** - Industry-specific security practices

### Regular Security Reviews

```typescript
class SecurityCompliance {
  static async runComplianceCheck(): Promise<void> {
    console.log('Running security compliance check...')
    
    // Run all security tests
    CryptographicSecurityTests.testKeyGeneration()
    CryptographicSecurityTests.testSignatureIntegrity()
    CryptographicSecurityTests.testKeyDerivation()
    InputValidationTests.testPrivateKeyValidation()
    InputValidationTests.testPublicKeyValidation()
    
    // Run dependency audit
    await DependencySecurity.runSecurityAudit()
    
    console.log('✓ All security compliance checks passed')
  }
}
```

### Security Documentation

All security-related changes must be documented:

1. **Security Impact Assessment** - Document potential security impacts
2. **Threat Modeling** - Identify potential threats and mitigations
3. **Security Testing** - Include security tests for new features
4. **Compliance Updates** - Update compliance documentation

## Best Practices Summary

### For Users

1. **Never hardcode private keys** in source code
2. **Use environment variables** for sensitive configuration
3. **Validate all inputs** before creating transactions
4. **Use HTTPS connections** only
5. **Implement proper error handling** without exposing sensitive data
6. **Keep dependencies updated** regularly
7. **Use rate limiting** for API calls
8. **Monitor for suspicious activity**

### For Contributors

1. **Follow secure coding practices**
2. **Implement comprehensive input validation**
3. **Write security-focused tests**
4. **Document security implications** of changes
5. **Participate in security reviews**
6. **Report security issues responsibly**
7. **Stay updated** with security advisories
8. **Follow cryptographic best practices**

By following this security guide, you can ensure that your use of the hive-tx library is secure and that any contributions maintain the library's high security standards.
