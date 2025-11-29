# Hive Transaction Library Documentation

Welcome to the comprehensive documentation for the Hive Transaction (hive-tx) library. This guide will help you understand how to use this lightweight and complete JavaScript/TypeScript library for Hive blockchain operations.

## 📚 Documentation Overview

### Getting Started
- [Quick Start Guide](QUICKSTART.md) - Get up and running in minutes
- [README](../README.md) - Main project overview and installation
- [FAQ](FAQ.md) - Common questions and answers

### Core Documentation
- [API Reference](API.md) - Complete API documentation with all methods and types
- [Examples](examples/) - Practical usage examples for all major features

### Advanced Guides
- [TypeScript Guide](TYPESCRIPT.md) - Advanced TypeScript usage and type safety
- [Performance Guide](PERFORMANCE.md) - Performance optimization and best practices
- [Security Guide](SECURITY.md) - Security best practices and guidelines
- [Testing Guide](TESTING.md) - Testing your applications and contributing tests

### Development
- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project
- [Changelog](CHANGELOG.md) - Version history and release notes

## 🚀 Quick Navigation

### Installation
```bash
npm install hive-tx --save
```

### Basic Usage
```javascript
import { Transaction, PrivateKey } from 'hive-tx'

// Create and broadcast a transaction
const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'your-username',
  author: 'post-author',
  permlink: 'post-permlink',
  weight: 10000 // 100%
})

const key = PrivateKey.from('your-private-key')
tx.sign(key)
const result = await tx.broadcast()
```

## 📖 Documentation Structure

### 1. Core Concepts
- Transaction lifecycle and management
- Key management and cryptography
- API calls and network configuration
- Error handling and debugging

### 2. Advanced Features
- Multi-signature transactions
- Memo encryption and decryption
- Custom operation types
- Advanced configuration options

### 3. Integration Guides
- Node.js integration
- Browser integration
- Framework-specific guides
- Performance optimization

### 4. Best Practices
- Security recommendations
- Performance optimization
- Error handling patterns
- Testing strategies

## 🛠️ Key Components

### Transaction Class
The main class for handling blockchain transactions:
- Creating transactions with `addOperation()`
- Signing with private keys
- Broadcasting to the network
- Getting transaction digests

### PrivateKey Class
Handles private key operations:
- Creating from WIF strings
- Generating random keys
- Deriving from username/password
- Signing messages and transactions

### PublicKey Class
Handles public key operations:
- Creating from string representations
- Verifying signatures
- Converting to string format

### API Utilities
Helper functions for common operations:
- `call()` - Make API calls to Hive nodes
- `config` - Configure library behavior
- Utility functions for common tasks

## 🎯 Common Use Cases

### Social Operations
- Voting on posts and comments
- Creating posts and comments
- Following and unfollowing accounts
- Social engagement tracking

### Financial Operations
- Transferring HIVE and HBD
- Powering up and down (VESTS)
- Claiming rewards
- Account creation and management

### Advanced Operations
- Witness operations
- Proposal voting and creation
- Custom JSON operations
- Multi-signature transactions

## 🤝 Community and Support

### Getting Help
- [GitHub Issues](https://github.com/mahdiyari/hive-tx-js/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/mahdiyari/hive-tx-js/discussions) - General questions and discussions
- Hive developer communities and forums

### Contributing
We welcome contributions of all kinds:
- Code contributions and bug fixes
- Documentation improvements
- Feature requests and suggestions
- Testing and feedback

See our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🔄 Version Information

Current version: 7.0.0-beta.6

See the [Changelog](CHANGELOG.md) for detailed version history and breaking changes.

---

**Ready to get started?** Check out the [Quick Start Guide](QUICKSTART.md) for a hands-on introduction to hive-tx!
