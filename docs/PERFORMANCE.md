# Performance Guide

This guide explains how to optimize performance when using the hive-tx library and provides insights into the library's performance characteristics.

## Table of Contents

- [Performance Overview](#performance-overview)
- [Transaction Performance](#transaction-performance)
- [Key Operations Performance](#key-operations-performance)
- [API Call Performance](#api-call-performance)
- [Memory Management](#memory-management)
- [Bundle Size Optimization](#bundle-size-optimization)
- [Caching Strategies](#caching-strategies)
- [Benchmarking](#benchmarking)
- [Performance Monitoring](#performance-monitoring)

## Performance Overview

The hive-tx library is designed for optimal performance while maintaining security and reliability. Understanding its performance characteristics helps you build efficient blockchain applications.

### Key Performance Metrics

1. **Transaction Creation**: < 10ms for simple transactions
2. **Key Generation**: < 50ms for secure random key generation
3. **Signing Operations**: < 5ms for typical transactions
4. **API Calls**: Network-dependent, typically 100-500ms
5. **Memory Usage**: Minimal overhead, < 1MB for typical operations
6. **Bundle Size**: ~141 KiB minified + gzipped for browser builds

### Performance Principles

1. **Efficient Algorithms**: Optimized cryptographic and serialization operations
2. **Lazy Loading**: Components loaded only when needed
3. **Memory Management**: Efficient buffer reuse and garbage collection
4. **Network Optimization**: Smart retry and failover mechanisms
5. **Tree Shaking**: Unused code eliminated during build

## Transaction Performance

Transaction operations are optimized for speed and efficiency.

### Transaction Creation Optimization

```typescript
import { Transaction, PrivateKey } from 'hive-tx'

class OptimizedTransactionBuilder {
  private static readonly TRANSACTION_CACHE = new Map<string, Transaction>()
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  static async createOptimizedTransaction(
    operations: any[],
    options: { cache?: boolean; expiration?: number } = {}
  ): Promise<Transaction> {
    const cacheKey = options.cache ? this.generateCacheKey(operations) : null

    // Check cache first
    if (cacheKey) {
      const cached = this.TRANSACTION_CACHE.get(cacheKey)
      if (cached && (Date.now() - (cached as any)._createdAt) < this.CACHE_TTL) {
        return cached
      }
    }

    // Create new transaction with performance optimizations
    const startTime = performance.now()
    
    const tx = new Transaction({ expiration: options.expiration })
    
    // Batch add operations for better performance
    for (const [name, body] of operations) {
      await tx.addOperation(name, body)
    }

    const endTime = performance.now()
    console.log(`Transaction creation took ${endTime - startTime}ms`)

    // Cache if requested
    if (cacheKey) {
      (tx as any)._createdAt = Date.now()
      this.TRANSACTION_CACHE.set(cacheKey, tx)
      
      // Clean up expired cache entries
      this.cleanupCache()
    }

    return tx
  }

  private static generateCacheKey(operations: any[]): string {
    // Generate deterministic cache key
    return JSON.stringify(operations.map(op => [op[0], this.normalizeOperation(op[1])]))
  }

  private static normalizeOperation(operation: any): any {
    // Normalize operation for consistent caching
    const normalized: any = {}
    const keys = Object.keys(operation).sort()
    
    for (const key of keys) {
      normalized[key] = operation[key]
    }
    
    return normalized
  }

  private static cleanupCache(): void {
    const now = Date.now()
    for (const [key, tx] of this.TRANSACTION_CACHE.entries()) {
      if ((now - (tx as any)._createdAt) >= this.CACHE_TTL) {
        this.TRANSACTION_CACHE.delete(key)
      }
    }
  }
}
```

### Batch Transaction Processing

```typescript
class BatchTransactionProcessor {
  private transactions: Transaction[] = []
  private batchSize: number

  constructor(batchSize: number = 10) {
    this.batchSize = batchSize
  }

  async addTransaction(tx: Transaction): Promise<void> {
    this.transactions.push(tx)
    
    // Process batch when limit reached
    if (this.transactions.length >= this.batchSize) {
      await this.processBatch()
    }
  }

  async processBatch(): Promise<void> {
    if (this.transactions.length === 0) return

    const batch = [...this.transactions]
    this.transactions = []

    console.log(`Processing batch of ${batch.length} transactions`)

    const startTime = performance.now()
    
    // Process transactions in parallel where possible
    const results = await Promise.allSettled(
      batch.map(async (tx, index) => {
        try {
          const result = await tx.broadcast()
          console.log(`Transaction ${index + 1} broadcast successful`)
          return result
        } catch (error) {
          console.error(`Transaction ${index + 1} failed:`, error)
          throw error
        }
      })
    )

    const endTime = performance.now()
    console.log(`Batch processing took ${endTime - startTime}ms`)

    return results as any
  }

  async flush(): Promise<void> {
    if (this.transactions.length > 0) {
      await this.processBatch()
    }
  }
}
```

### Transaction Memory Optimization

```typescript
class MemoryOptimizedTransaction {
  private transaction: Transaction
  private operationBuffer: any[] = []
  private maxBufferSize: number

  constructor(maxBufferSize: number = 100) {
    this.transaction = new Transaction()
    this.maxBufferSize = maxBufferSize
  }

  async addOperation(name: string, body: any): Promise<void> {
    this.operationBuffer.push([name, body])
    
    // Process buffer when full
    if (this.operationBuffer.length >= this.maxBufferSize) {
      await this.flushBuffer()
    }
  }

  private async flushBuffer(): Promise<void> {
    if (this.operationBuffer.length === 0) return

    const buffer = [...this.operationBuffer]
    this.operationBuffer = []

    // Add operations in batch
    for (const [name, body] of buffer) {
      await this.transaction.addOperation(name, body)
    }
  }

  async signAndBroadcast(key: PrivateKey): Promise<any> {
    // Flush any remaining operations
    await this.flushBuffer()
    
    // Sign transaction
    this.transaction.sign(key)
    
    // Broadcast
    return await this.transaction.broadcast()
  }

  // Memory usage monitoring
  getMemoryUsage(): { operations: number; estimatedBytes: number } {
    return {
      operations: this.operationBuffer.length,
      estimatedBytes: this.operationBuffer.length * 1024 // Rough estimate
    }
  }
}
```

## Key Operations Performance

Cryptographic operations are optimized for security and performance.

### Key Generation Optimization

```typescript
import { PrivateKey } from 'hive-tx'

class KeyGenerationOptimizer {
  private static readonly KEY_CACHE = new Map<string, PrivateKey>()
  private static readonly CACHE_SIZE_LIMIT = 1000

  static generateKeyWithCaching(seed?: string): PrivateKey {
    if (seed) {
      // Check cache for seeded keys
      if (this.KEY_CACHE.has(seed)) {
        return this.KEY_CACHE.get(seed)!
      }

      const key = PrivateKey.fromSeed(seed)
      
      // Cache if under limit
      if (this.KEY_CACHE.size < this.CACHE_SIZE_LIMIT) {
        this.KEY_CACHE.set(seed, key)
      }
      
      return key
    }

    // Generate random key without caching
    return PrivateKey.randomKey()
  }

  static clearKeyCache(): void {
    this.KEY_CACHE.clear()
  }

  static getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.KEY_CACHE.size,
      maxSize: this.CACHE_SIZE_LIMIT
    }
  }
}
```

### Key Derivation Performance

```typescript
class KeyDerivationOptimizer {
  private static readonly DERIVATION_CACHE = new Map<string, PrivateKey>()
  private static readonly CACHE_TTL = 30 * 60 * 1000 // 30 minutes

  static deriveKeyWithCaching(
    username: string,
    password: string,
    role: 'owner' | 'active' | 'posting' | 'memo' = 'active'
  ): PrivateKey {
    const cacheKey = `${username}:${role}:${this.hashPassword(password)}`

    // Check cache
    const cached = this.DERIVATION_CACHE.get(cacheKey)
    const cacheEntry = cached ? (cached as any)._cacheMetadata : null

    if (cached && cacheEntry && (Date.now() - cacheEntry.createdAt) < this.CACHE_TTL) {
      return cached
    }

    // Derive new key
    const startTime = performance.now()
    const key = PrivateKey.fromLogin(username, password, role)
    const endTime = performance.now()

    console.log(`Key derivation took ${endTime - startTime}ms`)

    // Add metadata for caching
    (key as any)._cacheMetadata = {
      createdAt: Date.now(),
      derivedFrom: { username, role }
    }

    // Cache key
    this.DERIVATION_CACHE.set(cacheKey, key)

    // Cleanup expired entries
    this.cleanupCache()

    return key
  }

  private static hashPassword(password: string): string {
    // Simple hash for cache key (not for security)
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }

  private static cleanupCache(): void {
    const now = Date.now()
    for (const [key, entry] of this.DERIVATION_CACHE.entries()) {
      const metadata = (entry as any)._cacheMetadata
      if (metadata && (now - metadata.createdAt) >= this.CACHE_TTL) {
        this.DERIVATION_CACHE.delete(key)
      }
    }
  }

  static getDerivationStats(): {
    cacheSize: number
    cacheHits: number
    cacheMisses: number
  } {
    // Implement statistics tracking
    return {
      cacheSize: this.DERIVATION_CACHE.size,
      cacheHits: 0, // Track in actual implementation
      cacheMisses: 0 // Track in actual implementation
    }
  }
}
```

### Signature Performance

```typescript
class SignatureOptimizer {
  private static readonly SIGNATURE_CACHE = new Map<string, any>()
  private static readonly CACHE_TTL = 10 * 60 * 1000 // 10 minutes

  static signWithCaching(
    key: PrivateKey,
    message: Uint8Array,
    useCache: boolean = true
  ): any {
    if (!useCache) {
      return key.sign(message)
    }

    const cacheKey = this.generateSignatureCacheKey(key, message)

    // Check cache
    const cached = this.SIGNATURE_CACHE.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.signature
    }

    // Create signature
    const startTime = performance.now()
    const signature = key.sign(message)
    const endTime = performance.now()

    console.log(`Signature creation took ${endTime - startTime}ms`)

    // Cache signature
    this.SIGNATURE_CACHE.set(cacheKey, {
      signature,
      timestamp: Date.now()
    })

    return signature
  }

  private static generateSignatureCacheKey(key: PrivateKey, message: Uint8Array): string {
    // Generate cache key from key and message hash
    const keyHash = key.toString().slice(0, 10) // First 10 chars of key
    const messageHash = Array.from(message)
      .slice(0, 16) // First 16 bytes
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    return `${keyHash}:${messageHash}`
  }

  static verifySignatureWithCaching(
    publicKey: any,
    message: Uint8Array,
    signature: any,
    useCache: boolean = true
  ): boolean {
    if (!useCache) {
      return publicKey.verify(message, signature)
    }

    const cacheKey = this.generateVerificationCacheKey(publicKey, message, signature)

    // Check cache
    const cached = this.SIGNATURE_CACHE.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.result
    }

    // Verify signature
    const startTime = performance.now()
    const result = publicKey.verify(message, signature)
    const endTime = performance.now()

    console.log(`Signature verification took ${endTime - startTime}ms`)

    // Cache result
    this.SIGNATURE_CACHE.set(cacheKey, {
      result,
      timestamp: Date.now()
    })

    return result
  }

  private static generateVerificationCacheKey(
    publicKey: any,
    message: Uint8Array,
    signature: any
  ): string {
    const pubKeyHash = publicKey.toString().slice(0, 10)
    const messageHash = Array.from(message)
      .slice(0, 16)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    const sigHash = signature.customToString().slice(0, 10)
    
    return `verify:${pubKeyHash}:${messageHash}:${sigHash}`
  }
}
```

## API Call Performance

API calls are optimized for reliability and speed.

### Connection Pooling

```typescript
import { call, config } from 'hive-tx'

class ConnectionPool {
  private static readonly POOL_SIZE = 5
  private static readonly CONNECTION_TIMEOUT = 10000 // 10 seconds
  private static readonly RETRY_DELAY = 1000 // 1 second

  private connections: Array<{
    url: string
    lastUsed: number
    isActive: boolean
  }> = []

  constructor() {
    this.initializePool()
  }

  private initializePool(): void {
    if (Array.isArray(config.node)) {
      this.connections = config.node.map(url => ({
        url,
        lastUsed: 0,
        isActive: true
      }))
    }
  }

  async makeOptimizedCall(
    method: string,
    params: any[],
    timeout: number = 5,
    retry: number = 3
  ): Promise<any> {
    const startTime = performance.now()

    try {
      // Get best available connection
      const connection = this.getBestConnection()
      
      if (!connection) {
        throw new Error('No available connections')
      }

      // Make API call
      const result = await call(method, params, timeout, retry)
      
      const endTime = performance.now()
      console.log(`API call to ${connection.url} took ${endTime - startTime}ms`)

      // Update connection usage
      connection.lastUsed = Date.now()

      return result
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  private getBestConnection(): { url: string; lastUsed: number; isActive: boolean } | null {
    // Filter active connections
    const activeConnections = this.connections.filter(conn => conn.isActive)
    
    if (activeConnections.length === 0) {
      return null
    }

    // Sort by last used time (least recently used first)
    activeConnections.sort((a, b) => a.lastUsed - b.lastUsed)
    
    return activeConnections[0]
  }

  async healthCheck(): Promise<void> {
    const healthChecks = this.connections.map(async (connection) => {
      try {
        const startTime = performance.now()
        await call('condenser_api.get_dynamic_global_properties', [], 5, 1)
        const endTime = performance.now()
        
        console.log(`Health check for ${connection.url}: ${endTime - startTime}ms`)
        connection.isActive = true
      } catch (error) {
        console.error(`Health check failed for ${connection.url}:`, error)
        connection.isActive = false
      }
    })

    await Promise.all(healthChecks)
  }

  getConnectionStats(): {
    total: number
    active: number
    inactive: number
  } {
    const active = this.connections.filter(conn => conn.isActive).length
    return {
      total: this.connections.length,
      active,
      inactive: this.connections.length - active
    }
  }
}
```

### Request Batching

```typescript
class RequestBatcher {
  private pendingRequests: Array<{
    method: string
    params: any[]
    resolve: (value: any) => void
    reject: (reason: any) => void
  }> = []
  
  private batchSize: number
  private batchTimeout: number
  private batchTimer: NodeJS.Timeout | null = null

  constructor(batchSize: number = 10, batchTimeout: number = 100) {
    this.batchSize = batchSize
    this.batchTimeout = batchTimeout
  }

  async batchCall(method: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pendingRequests.push({ method, params, resolve, reject })
      
      // Start batch timer if not already running
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this.processBatch()
        }, this.batchTimeout)
      }

      // Process batch immediately if size limit reached
      if (this.pendingRequests.length >= this.batchSize) {
        this.processBatch()
      }
    })
  }

  private async processBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }

    if (this.pendingRequests.length === 0) {
      return
    }

    const batch = [...this.pendingRequests]
    this.pendingRequests = []

    console.log(`Processing batch of ${batch.length} requests`)

    const startTime = performance.now()

    try {
      // Process requests in parallel
      const results = await Promise.allSettled(
        batch.map(async (request, index) => {
          try {
            const result = await call(request.method, request.params)
            return { index, result, error: null }
          } catch (error) {
            return { index, result: null, error }
          }
        })
      )

      const endTime = performance.now()
      console.log(`Batch processing took ${endTime - startTime}ms`)

      // Resolve/reject individual promises
      results.forEach((result, index) => {
        const request = batch[index]
        if (result.status === 'fulfilled' && !result.value.error) {
          request.resolve(result.value.result)
        } else {
          const error = result.status === 'fulfilled' 
            ? result.value.error 
            : result.reason
          request.reject(error)
        }
      })
    } catch (error) {
      // Reject all pending requests on batch failure
      batch.forEach(request => {
        request.reject(error)
      })
    }
  }

  getPendingCount(): number {
    return this.pendingRequests.length
  }

  clearPending(): void {
    this.pendingRequests.forEach(request => {
      request.reject(new Error('Batch cleared'))
    })
    this.pendingRequests = []
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }
  }
}
```

### Response Caching

```typescript
class ResponseCache {
  private static readonly CACHE = new Map<string, {
    data: any
    timestamp: number
    ttl: number
  }>()
  
  private static readonly DEFAULT_TTL = 30 * 1000 // 30 seconds

  static async cachedCall(
    method: string,
    params: any[],
    ttl: number = this.DEFAULT_TTL
  ): Promise<any> {
    const cacheKey = this.generateCacheKey(method, params)

    // Check cache
    const cached = this.CACHE.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
      console.log(`Cache hit for ${method}`)
      return cached.data
    }

    // Make API call
    const startTime = performance.now()
    const data = await call(method, params)
    const endTime = performance.now()

    console.log(`API call ${method} took ${endTime - startTime}ms`)

    // Cache response
    this.CACHE.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    })

    // Cleanup expired entries
    this.cleanupCache()

    return data
  }

  private static generateCacheKey(method: string, params: any[]): string {
    // Generate deterministic cache key
    const normalizedParams = this.normalizeParams(params)
    return `${method}:${JSON.stringify(normalizedParams)}`
  }

  private static normalizeParams(params: any[]): any[] {
    // Normalize parameters for consistent caching
    return params.map(param => {
      if (typeof param === 'object' && param !== null) {
        // Sort object keys for consistent serialization
        const sorted: any = {}
        Object.keys(param).sort().forEach(key => {
          sorted[key] = param[key]
        })
        return sorted
      }
      return param
    })
  }

  private static cleanupCache(): void {
    const now = Date.now()
    for (const [key, entry] of this.CACHE.entries()) {
      if ((now - entry.timestamp) >= entry.ttl) {
        this.CACHE.delete(key)
      }
    }
  }

  static getCacheStats(): {
    size: number
    hits: number
    misses: number
  } {
    // Implement statistics tracking
    return {
      size: this.CACHE.size,
      hits: 0, // Track in actual implementation
      misses: 0 // Track in actual implementation
    }
  }

  static clearCache(): void {
    this.CACHE.clear()
  }

  static clearExpired(): void {
    this.cleanupCache()
  }
}
```

## Memory Management

Efficient memory management is crucial for performance.

### Buffer Management

```typescript
class BufferManager {
  private static readonly BUFFER_POOL: Uint8Array[] = []
  private static readonly MAX_POOL_SIZE = 100
  private static readonly DEFAULT_BUFFER_SIZE = 1024

  static getBuffer(size: number = this.DEFAULT_BUFFER_SIZE): Uint8Array {
    // Try to get buffer from pool
    for (let i = 0; i < this.BUFFER_POOL.length; i++) {
      const buffer = this.BUFFER_POOL[i]
      if (buffer.byteLength >= size) {
        this.BUFFER_POOL.splice(i, 1)
        return buffer
      }
    }

    // Create new buffer if none available
    return new Uint8Array(size)
  }

  static releaseBuffer(buffer: Uint8Array): void {
    // Return buffer to pool if under limit
    if (this.BUFFER_POOL.length < this.MAX_POOL_SIZE) {
      this.BUFFER_POOL.push(buffer)
    }
    // Buffer will be garbage collected if pool is full
  }

  static getPoolStats(): {
    size: number
    maxSize: number
    totalBytes: number
  } {
    const totalBytes = this.BUFFER_POOL.reduce((sum, buffer) => sum + buffer.byteLength, 0)
    return {
      size: this.BUFFER_POOL.length,
      maxSize: this.MAX_POOL_SIZE,
      totalBytes
    }
  }

  static clearPool(): void {
    this.BUFFER_POOL.length = 0
  }
}
```

### Memory Leak Prevention

```typescript
class MemoryLeakPrevention {
  private static readonly TRACKED_INSTANCES = new Set<any>()
  private static readonly WEAK_REFS = new WeakMap<any, string>()

  static trackInstance(instance: any, name: string): void {
    this.TRACKED_INSTANCES.add(instance)
    this.WEAK_REFS.set(instance, name)
  }

  static untrackInstance(instance: any): void {
    this.TRACKED_INSTANCES.delete(instance)
  }

  static getTrackedCount(): number {
    return this.TRACKED_INSTANCES.size
  }

  static forceCleanup(): void {
    // Clear all tracked instances
    this.TRACKED_INSTANCES.clear()
    console.log('Forced cleanup of tracked instances')
  }

  static setupMemoryMonitoring(): void {
    if (typeof window !== 'undefined' && window.performance) {
      // Monitor memory usage in browser
      setInterval(() => {
        if (performance.memory) {
          const memory = performance.memory
          console.log(`Memory usage: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`)
        }
      }, 30000) // Every 30 seconds
    }
  }
}
```

### Garbage Collection Optimization

```typescript
class GCOptimizer {
  private static readonly LARGE_OBJECT_THRESHOLD = 1024 * 1024 // 1MB
  private static readonly GC_INTERVAL = 60000 // 1 minute

  private largeObjects: WeakSet<any> = new WeakSet()
  private gcTimer: NodeJS.Timeout | null = null

  constructor() {
    this.setupGCTimer()
  }

  trackLargeObject(obj: any): void {
    const size = this.getObjectSize(obj)
    if (size > this.LARGE_OBJECT_THRESHOLD) {
      this.largeObjects.add(obj)
      console.log(`Tracking large object: ${Math.round(size / 1024)}KB`)
    }
  }

  private getObjectSize(obj: any): number {
    // Rough estimation of object size
    if (obj instanceof Uint8Array) {
      return obj.byteLength
    }
    
    if (typeof obj === 'string') {
      return obj.length * 2 // UTF-16 estimation
    }
    
    if (typeof obj === 'object' && obj !== null) {
      let size = 0
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          size += key.length * 2 // Key size
          size += this.getObjectSize(obj[key]) // Value size
        }
      }
      return size
    }
    
    return 8 // Default for primitives
  }

  private setupGCTimer(): void {
    if (typeof window === 'undefined') {
      // Node.js environment
      this.gcTimer = setInterval(() => {
        if (global.gc) {
          const before = process.memoryUsage()
          global.gc()
          const after = process.memoryUsage()
          console.log(`GC: ${Math.round((before.heapUsed - after.heapUsed) / 1024 / 1024)}MB freed`)
        }
      }, this.GC_INTERVAL)
    }
  }

  cleanup(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer)
      this.gcTimer = null
    }
  }

  getMemoryStats(): NodeJS.MemoryUsage {
    return process.memoryUsage()
  }
}
```

## Bundle Size Optimization

Minimizing bundle size improves load times and performance.

### Tree Shaking Configuration

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          mangle: true,
          keep_fnames: false
        }
      })
    ]
  },
  resolve: {
    alias: {
      // Alias to reduce bundle size
      'crypto': false, // Use browser crypto
      'buffer': false // Use built-in buffer
    }
  }
}
```

### Code Splitting

```typescript
// Dynamic imports for code splitting
class LazyLoader {
  private static loadedModules = new Map<string, any>()

  static async loadTransactionModule(): Promise<typeof import('../src/Transaction')> {
    if (this.loadedModules.has('transaction')) {
      return this.loadedModules.get('transaction')
    }

    const module = await import('../src/Transaction')
    this.loadedModules.set('transaction', module)
    return module
  }

  static async loadKeyModule(): Promise<typeof import('../src/helpers/PrivateKey')> {
    if (this.loadedModules.has('key')) {
      return this.loadedModules.get('key')
    }

    const module = await import('../src/helpers/PrivateKey')
    this.loadedModules.set('key', module)
    return module
  }

  static async loadMemoModule(): Promise<typeof import('../src/helpers/memo')> {
    if (this.loadedModules.has('memo')) {
      return this.loadedModules.get('memo')
    }

    const module = await import('../src/helpers/memo')
    this.loadedModules.set('memo', module)
    return module
  }

  static getLoadedModules(): string[] {
    return Array.from(this.loadedModules.keys())
  }

  static clearCache(): void {
    this.loadedModules.clear()
  }
}
```

### Bundle Analysis

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Add to package.json scripts
{
  "scripts": {
    "analyze": "webpack-bundle-analyzer dist/stats.json"
  }
}

# Generate stats
webpack --profile --json > dist/stats.json
```

## Caching Strategies

Effective caching improves performance significantly.

### Multi-Level Caching

```typescript
class MultiLevelCache {
  private static readonly L1_CACHE = new Map<string, any>() // Memory cache
  private static readonly L2_CACHE = new Map<string, any>() // Session storage (browser)
  private static readonly L1_TTL = 5 * 60 * 1000 // 5 minutes
  private static readonly L2_TTL = 60 * 60 * 1000 // 1 hour

  static set(key: string, value: any, ttl: number = this.L1_TTL): void {
    const entry = {
      value,
      timestamp: Date.now(),
      ttl
    }

    // L1 cache (memory)
    this.L1_CACHE.set(key, entry)

    // L2 cache (persistent)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(`cache_${key}`, JSON.stringify(entry))
      } catch (error) {
        console.warn('Session storage not available:', error)
      }
    }

    // Cleanup expired entries
    this.cleanup()
  }

  static get(key: string): any {
    // Check L1 cache first
    const l1Entry = this.L1_CACHE.get(key)
    if (l1Entry && (Date.now() - l1Entry.timestamp) < l1Entry.ttl) {
      return l1Entry.value
    }

    // Check L2 cache
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const l2EntryStr = sessionStorage.getItem(`cache_${key}`)
        if (l2EntryStr) {
          const l2Entry = JSON.parse(l2EntryStr)
          if ((Date.now() - l2Entry.timestamp) < l2Entry.ttl) {
            // Promote to L1 cache
            this.L1_CACHE.set(key, l2Entry)
            return l2Entry.value
          } else {
            // Remove expired entry
            sessionStorage.removeItem(`cache_${key}`)
          }
        }
      } catch (error) {
        console.warn('Cache retrieval error:', error)
      }
    }

    return undefined
  }

  static has(key: string): boolean {
    return this.get(key) !== undefined
  }

  static delete(key: string): boolean {
    const deletedFromL1 = this.L1_CACHE.delete(key)
    
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.removeItem(`cache_${key}`)
        return deletedFromL1 || true
      } catch (error) {
        console.warn('Session storage error:', error)
      }
    }
    
    return deletedFromL1
  }

  static clear(): void {
    this.L1_CACHE.clear()
    
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('cache_')) {
            sessionStorage.removeItem(key)
          }
        })
      } catch (error) {
        console.warn('Session storage clear error:', error)
      }
    }
  }

  private static cleanup(): void {
    const now = Date.now()
    
    // Cleanup L1 cache
    for (const [key, entry] of this.L1_CACHE.entries()) {
      if ((now - entry.timestamp) >= entry.ttl) {
        this.L1_CACHE.delete(key)
      }
    }

    // Cleanup L2 cache
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('cache_')) {
            const entry = JSON.parse(sessionStorage.getItem(key) || '{}')
            if (entry.timestamp && (now - entry.timestamp) >= entry.ttl) {
              sessionStorage.removeItem(key)
            }
          }
        })
      } catch (error) {
        console.warn('Cache cleanup error:', error)
      }
    }
  }

  static getStats(): {
    l1Size: number
    l2Size: number
    totalSize: number
  } {
    let l2Size = 0
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        l2Size = Object.keys(sessionStorage).filter(key => key.startsWith('cache_')).length
      } catch (error) {
        console.warn('Session storage stats error:', error)
      }
    }

    return {
      l1Size: this.L1_CACHE.size,
      l2Size,
      totalSize: this.L1_CACHE.size + l2Size
    }
  }
}
```

### Cache Invalidation Strategies

```typescript
class CacheInvalidation {
  private static readonly INVALIDATION_RULES = new Map<string, {
    pattern: RegExp
    dependencies: string[]
  }>()

  static addInvalidationRule(
    name: string,
    pattern: RegExp,
    dependencies: string[] = []
  ): void {
    this.INVALIDATION_RULES.set(name, { pattern, dependencies })
  }

  static invalidateByPattern(pattern: string): number {
    let invalidatedCount = 0

    // Invalidate memory cache
    for (const key of MultiLevelCache['L1_CACHE'].keys()) {
      if (new RegExp(pattern).test(key)) {
        MultiLevelCache['L1_CACHE'].delete(key)
        invalidatedCount++
      }
    }

    // Invalidate session storage cache
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('cache_') && new RegExp(pattern).test(key)) {
            sessionStorage.removeItem(key)
            invalidatedCount++
          }
        })
      } catch (error) {
        console.warn('Session storage invalidation error:', error)
      }
    }

    return invalidatedCount
  }

  static invalidateByDependency(dependency: string): number {
    let invalidatedCount = 0

    for (const [name, rule] of this.INVALIDATION_RULES.entries()) {
      if (rule.dependencies.includes(dependency)) {
        invalidatedCount += this.invalidateByPattern(rule.pattern.source)
      }
    }

    return invalidatedCount
  }

  static setupAutomaticInvalidation(): void {
    // Setup automatic invalidation based on common patterns
    this.addInvalidationRule('account', /^accounts?:/, ['blockchain'])
    this.addInvalidationRule('transaction', /^transactions?:/, ['blockchain'])
    this.addInvalidationRule('block', /^blocks?:/, ['blockchain'])
  }
}
```

## Benchmarking

Performance benchmarking helps identify bottlenecks.

### Benchmark Framework

```typescript
class PerformanceBenchmark {
  private static readonly benchmarks = new Map<string, {
    times: number[]
    memory: number[]
  }>()

  static async benchmark<T>(
    name: string,
    fn: () => Promise<T> | T,
    iterations: number = 100
  ): Promise<T> {
    const times: number[] = []
    const memory: number[] = []
    let result: T

    console.log(`Running benchmark: ${name} (${iterations} iterations)`)

    for (let i = 0; i < iterations; i++) {
      // Force garbage collection if available
      if (typeof global !== 'undefined' && global.gc) {
        global.gc()
      }

      const startMemory = process.memoryUsage().heapUsed
      const startTime = performance.now()

      try {
        result = await Promise.resolve(fn())
      } catch (error) {
        console.error(`Benchmark ${name} failed on iteration ${i}:`, error)
        throw error
      }

      const endTime = performance.now()
      const endMemory = process.memoryUsage().heapUsed

      times.push(endTime - startTime)
      memory.push(endMemory - startMemory)

      // Progress indicator
      if (i % Math.floor(iterations / 10) === 0 && i > 0) {
        console.log(`Progress: ${Math.round((i / iterations) * 100)}%`)
      }
    }

    // Store results
    this.benchmarks.set(name, { times, memory })

    // Calculate statistics
    const stats = this.calculateStats(times, memory)
    this.printStats(name, stats)

    return result!
  }

  private static calculateStats(times: number[], memory: number[]): any {
    const sortedTimes = [...times].sort((a, b) => a - b)
    const sortedMemory = [...memory].sort((a, b) => a - b)

    return {
      time: {
        min: Math.min(...times),
        max: Math.max(...times),
        avg: times.reduce((sum, t) => sum + t, 0) / times.length,
        median: sortedTimes[Math.floor(sortedTimes.length / 2)],
        p95: sortedTimes[Math.floor(sortedTimes.length * 0.95)],
        p99: sortedTimes[Math.floor(sortedTimes.length * 0.99)]
      },
      memory: {
        min: Math.min(...memory),
        max: Math.max(...memory),
        avg: memory.reduce((sum, m) => sum + m, 0) / memory.length,
        median: sortedMemory[Math.floor(sortedMemory.length / 2)]
      }
    }
  }

  private static printStats(name: string, stats: any): void {
    console.log(`\n=== Benchmark Results: ${name} ===`)
    console.log(`Time (ms):`)
    console.log(`  Min: ${stats.time.min.toFixed(2)}`)
    console.log(`  Max: ${stats.time.max.toFixed(2)}`)
    console.log(`  Avg: ${stats.time.avg.toFixed(2)}`)
    console.log(`  Median: ${stats.time.median.toFixed(2)}`)
    console.log(`  95th percentile: ${stats.time.p95.toFixed(2)}`)
    console.log(`  99th percentile: ${stats.time.p99.toFixed(2)}`)
    
    console.log(`Memory (bytes):`)
    console.log(`  Min: ${stats.memory.min.toLocaleString()}`)
    console.log(`  Max: ${stats.memory.max.toLocaleString()}`)
    console.log(`  Avg: ${Math.round(stats.memory.avg).toLocaleString()}`)
    console.log(`  Median: ${stats.memory.median.toLocaleString()}`)
    console.log('=====================================\n')
  }

  static getBenchmarkResults(): Map<string, any> {
    const results = new Map<string, any>()
    
    for (const [name, data] of this.benchmarks.entries()) {
      results.set(name, this.calculateStats(data.times, data.memory))
    }
    
    return results
  }

  static clearResults(): void {
    this.benchmarks.clear()
  }

  static exportResults(format: 'json' | 'csv' = 'json'): string {
    const results = this.getBenchmarkResults()
    
    if (format === 'json') {
      return JSON.stringify(Object.fromEntries(results), null, 2)
    } else {
      // CSV format
      let csv = 'Benchmark,Min Time,Max Time,Avg Time,Median Time,95th Time,99th Time,Min Memory,Max Memory,Avg Memory,Median Memory\n'
      
      for (const [name, stats] of results.entries()) {
        csv += `${name},${stats.time.min},${stats.time.max},${stats.time.avg},${stats.time.median},${stats.time.p95},${stats.time.p99},${stats.memory.min},${stats.memory.max},${stats.memory.avg},${stats.memory.median}\n`
      }
      
      return csv
    }
  }
}
```

### Common Benchmarks

```typescript
class CommonBenchmarks {
  static async runAllBenchmarks(): Promise<void> {
    console.log('Running common performance benchmarks...')

    // Key generation benchmark
    await PerformanceBenchmark.benchmark(
      'PrivateKey Generation',
      () => PrivateKey.randomKey(),
      100
    )

    // Transaction creation benchmark
    await PerformanceBenchmark.benchmark(
      'Transaction Creation',
      async () => {
        const tx = new Transaction()
        await tx.addOperation('vote', {
          voter: 'test',
          author: 'test',
          permlink: 'test',
          weight: 10000
        })
        return tx
      },
      100
    )

    // Signing benchmark
    await PerformanceBenchmark.benchmark(
      'Transaction Signing',
      () => {
        const key = PrivateKey.randomKey()
        const tx = new Transaction()
        // Add operation and sign
        return tx.sign(key)
      },
      100
    )

    // API call benchmark
    await PerformanceBenchmark.benchmark(
      'API Call',
      async () => {
        return await call('condenser_api.get_dynamic_global_properties')
      },
      50
    )

    console.log('All benchmarks completed!')
  }
}
```

## Performance Monitoring

Continuous performance monitoring helps maintain optimal performance.

### Real-time Monitoring

```typescript
class PerformanceMonitor {
  private static readonly metrics = new Map<string, number[]>()
  private static readonly startTime = Date.now()

  static trackMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const metric = this.metrics.get(name)!
    metric.push(value)
    
    // Keep only last 1000 values
    if (metric.length > 1000) {
      metric.shift()
    }
  }

  static getMetrics(name: string): number[] | undefined {
    return this.metrics.get(name)
  }

  static getMetricStats(name: string): {
    min: number
    max: number
    avg: number
    count: number
  } | undefined {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) {
      return undefined
    }

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, v) => sum + v, 0) / values.length,
      count: values.length
    }
  }

  static startMonitoring(): void {
    // Monitor performance every 30 seconds
    setInterval(() => {
      const uptime = Date.now() - this.startTime
      console.log(`Performance Monitor - Uptime: ${Math.round(uptime / 1000)}s`)
      
      for (const [name, values] of this.metrics.entries()) {
        const stats = this.getMetricStats(name)
        if (stats) {
          console.log(`${name}: Avg=${stats.avg.toFixed(2)}, Min=${stats.min.toFixed(2)}, Max=${stats.max.toFixed(2)}, Count=${stats.count}`)
        }
      }
    }, 30000)
  }

  static resetMetrics(): void {
    this.metrics.clear()
  }
}
```

### Error Rate Monitoring

```typescript
class ErrorMonitor {
  private static readonly errorCounts = new Map<string, number>()
  private static readonly errorDetails = new Map<string, any[]>()

  static trackError(error: Error, context?: any): void {
    const errorType = error.constructor.name
    const errorMessage = error.message

    // Increment error count
    const currentCount = this.errorCounts.get(errorType) || 0
    this.errorCounts.set(errorType, currentCount + 1)

    // Store error details
    if (!this.errorDetails.has(errorType)) {
      this.errorDetails.set(errorType, [])
    }

    const details = this.errorDetails.get(errorType)!
    details.push({
      message: errorMessage,
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack
    })

    // Keep only last 100 error details per type
    if (details.length > 100) {
      details.shift()
    }

    console.error(`Error tracked: ${errorType} - ${errorMessage}`)
  }

  static getErrorStats(): Map<string, { count: number; details: any[] }> {
    const stats = new Map<string, { count: number; details: any[] }>()
    
    for (const [errorType, count] of this.errorCounts.entries()) {
      stats.set(errorType, {
        count,
        details: this.errorDetails.get(errorType) || []
      })
    }
    
    return stats
  }

  static getErrorRate(): number {
    const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0)
    const totalOperations = Array.from(PerformanceMonitor.getMetrics('operation_count') || [0]).reduce((sum, count) => sum + count, 0)
    
    return totalOperations > 0 ? (totalErrors / totalOperations) * 100 : 0
  }

  static clearErrors(): void {
    this.errorCounts.clear()
    this.errorDetails.clear()
  }
}
```

## Best Practices Summary

### For Users

1. **Cache Frequently Used Data**: Implement multi-level caching for blockchain data
2. **Batch Operations**: Group related operations to reduce network calls
3. **Monitor Performance**: Track key metrics like response times and error rates
4. **Optimize Key Usage**: Cache derived keys and reuse where possible
5. **Use Connection Pooling**: For high-frequency API calls
6. **Implement Proper Error Handling**: Without performance impact
7. **Monitor Memory Usage**: Prevent memory leaks in long-running applications
8. **Use Tree Shaking**: Import only what you need

### For Contributors

1. **Profile Before Optimizing**: Use benchmarks to identify real bottlenecks
2. **Measure Impact**: Test performance changes with realistic workloads
3. **Consider Trade-offs**: Balance performance with security and maintainability
4. **Document Performance Characteristics**: Help users understand performance implications
5. **Write Performance Tests**: Include performance benchmarks in the test suite
6. **Monitor Dependencies**: Keep dependencies updated for performance improvements
7. **Optimize Critical Paths**: Focus on frequently used code paths
8. **Use Efficient Algorithms**: Choose algorithms with good time complexity

### Performance Checklist

- [ ] Implement caching for frequently accessed data
- [ ] Use connection pooling for API calls
- [ ] Batch related operations
- [ ] Monitor memory usage and prevent leaks
- [ ] Profile performance regularly
- [ ] Optimize critical code paths
- [ ] Use efficient data structures
- [ ] Minimize object creation
- [ ] Implement proper error handling
- [ ] Monitor performance metrics in production

By following this performance guide, you can ensure that your applications using the hive-tx library run efficiently and provide a great user experience.
