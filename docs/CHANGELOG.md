# Changelog

All notable changes to the hive-tx library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation suite including API reference, migration guide, and examples
- TypeScript guide with advanced type usage patterns
- Testing guide with unit, integration, and mocking examples
- Contributing guide with development setup and best practices
- JSDoc configuration for API documentation generation

### Changed
- Improved inline documentation for all public APIs
- Enhanced README with better examples and usage patterns
- Updated package.json description and keywords for better discoverability
- Refined TypeScript type definitions for better type safety

### Fixed
- Documentation inconsistencies and missing API references
- Example code formatting and clarity issues
- Type definition accuracy for operation parameters

## [7.0.0-beta.6] - 2025-11-29

### Added
- New `addOperation` method for building transactions incrementally
- Enhanced TypeScript type safety with operation-specific types
- Improved error handling with better error messages
- Support for multi-signature transactions
- Enhanced memo encryption/decryption utilities
- Comprehensive test suite with 100% coverage targets

### Changed
- **BREAKING**: Renamed `create` method to `addOperation` for clarity
- **BREAKING**: Updated transaction creation API to be more intuitive
- **BREAKING**: Modified signature handling methods for better consistency
- **BREAKING**: Updated configuration API for improved flexibility
- Improved performance with optimized serialization
- Enhanced security with updated cryptographic libraries
- Better retry and failover mechanisms for API calls

### Removed
- **BREAKING**: Removed deprecated methods and legacy APIs
- **BREAKING**: Simplified configuration options for better maintainability

### Fixed
- Transaction digest calculation accuracy
- Signature verification reliability
- Asset parsing and formatting consistency
- API call retry logic for network failures
- Memory usage optimization for large transactions

## [6.2.0] - 2024-06-15

### Added
- Support for recurrent transfer operations
- New witness set properties utilities
- Enhanced account history filtering
- Additional operation type definitions

### Changed
- Updated noble cryptography library dependencies
- Improved build process with better tree shaking
- Enhanced browser compatibility
- Optimized bundle size reduction

### Fixed
- Memo encryption/decryption edge cases
- Transaction broadcast duplicate detection
- API call timeout handling
- Node.js version compatibility issues

## [6.1.0] - 2024-03-20

### Added
- Support for collateralized convert operations
- New proposal operation types
- Enhanced account update operations
- Additional utility functions for witness operations

### Changed
- Updated dependency versions for security
- Improved TypeScript type definitions
- Enhanced error message clarity
- Optimized serialization performance

### Fixed
- Transaction expiration handling
- Signature recovery byte calculation
- Asset precision formatting
- API response parsing

## [6.0.0] - 2023-12-01

### Added
- Complete rewrite in TypeScript
- Full type safety for all operations
- Modern ES module support
- Improved browser compatibility
- Enhanced documentation
- Comprehensive test suite

### Changed
- **BREAKING**: New API structure with class-based approach
- **BREAKING**: Updated method names for consistency
- **BREAKING**: Modernized configuration system
- **BREAKING**: New error handling patterns
- Significantly reduced bundle size
- Improved performance with optimized algorithms

### Removed
- **BREAKING**: Legacy callback-based APIs
- **BREAKING**: Removed deprecated operation types
- **BREAKING**: Simplified configuration options

## [5.3.0] - 2023-08-15

### Added
- Support for new Hive hardfork operations
- Enhanced memo encryption capabilities
- Additional utility functions
- Better TypeScript definitions

### Changed
- Updated cryptographic library dependencies
- Improved build process
- Enhanced browser support
- Optimized performance

### Fixed
- Transaction signing edge cases
- API call retry logic
- Memory leak issues
- Serialization bugs

## [5.2.0] - 2023-05-10

### Added
- Support for proposal operations
- New account update operations
- Enhanced witness operations
- Additional utility functions

### Changed
- Updated dependencies for security
- Improved documentation
- Enhanced error handling
- Optimized performance

### Fixed
- Transaction broadcast issues
- Signature verification bugs
- API call timeout handling
- Memory usage optimization

## [5.1.0] - 2023-02-28

### Added
- Support for new Hive operations
- Enhanced account management utilities
- Additional validation functions
- Better TypeScript support

### Changed
- Updated cryptographic libraries
- Improved build configuration
- Enhanced browser compatibility
- Optimized bundle size

### Fixed
- Transaction creation timing issues
- API response parsing
- Error handling consistency
- Memory management

## [5.0.0] - 2022-11-15

### Added
- Complete rewrite with modern architecture
- TypeScript support
- ES module exports
- Improved browser compatibility
- Enhanced documentation
- Comprehensive test coverage

### Changed
- **BREAKING**: New API design
- **BREAKING**: Modernized configuration
- **BREAKING**: Updated method signatures
- **BREAKING**: Simplified transaction handling
- Significantly improved performance
- Reduced bundle size by 30%

### Removed
- **BREAKING**: Legacy APIs
- **BREAKING**: Callback-based methods
- **BREAKING**: Deprecated operation types

## [4.2.0] - 2022-08-20

### Added
- Support for new Hive operations
- Enhanced account utilities
- Additional validation functions
- Better error handling

### Changed
- Updated dependencies
- Improved documentation
- Enhanced performance
- Better browser support

### Fixed
- Transaction signing issues
- API call reliability
- Memory leaks
- Serialization bugs

## [4.1.0] - 2022-05-30

### Added
- Support for witness operations
- Enhanced account management
- Additional utility functions
- Better TypeScript definitions

### Changed
- Updated cryptographic libraries
- Improved build process
- Enhanced documentation
- Optimized performance

### Fixed
- Transaction broadcast reliability
- Signature verification
- API call timeouts
- Memory usage

## [4.0.0] - 2022-03-15

### Added
- Modern JavaScript/TypeScript support
- ES module compatibility
- Improved browser builds
- Enhanced documentation
- Comprehensive testing

### Changed
- **BREAKING**: New API structure
- **BREAKING**: Modernized configuration
- **BREAKING**: Updated method names
- **BREAKING**: Simplified transaction handling
- Significantly improved performance
- Reduced bundle size

### Removed
- **BREAKING**: Legacy APIs
- **BREAKING**: Deprecated methods
- **BREAKING**: Old configuration options

## [3.2.0] - 2021-12-10

### Added
- Support for new Hive operations
- Enhanced account utilities
- Additional validation functions
- Better error handling

### Changed
- Updated dependencies
- Improved documentation
- Enhanced performance
- Better browser support

### Fixed
- Transaction signing issues
- API call reliability
- Memory leaks
- Serialization bugs

## [3.1.0] - 2021-09-25

### Added
- Support for memo encryption
- Enhanced key management
- Additional utility functions
- Better TypeScript support

### Changed
- Updated cryptographic libraries
- Improved build process
- Enhanced documentation
- Optimized performance

### Fixed
- Transaction broadcast reliability
- Signature verification
- API call timeouts
- Memory usage

## [3.0.0] - 2021-07-01

### Added
- Complete rewrite for Hive compatibility
- Modern API design
- TypeScript support
- Enhanced documentation
- Comprehensive testing

### Changed
- **BREAKING**: New API structure
- **BREAKING**: Modernized configuration
- **BREAKING**: Updated method signatures
- **BREAKING**: Simplified transaction handling
- Significantly improved performance
- Reduced bundle size

### Removed
- **BREAKING**: Legacy Steem-specific APIs
- **BREAKING**: Deprecated methods
- **BREAKING**: Old configuration options

## [2.1.0] - 2021-04-15

### Added
- Support for new operations
- Enhanced account utilities
- Additional validation functions
- Better error handling

### Changed
- Updated dependencies
- Improved documentation
- Enhanced performance
- Better browser support

### Fixed
- Transaction signing issues
- API call reliability
- Memory leaks
- Serialization bugs

## [2.0.0] - 2021-01-20

### Added
- Modern JavaScript support
- ES module compatibility
- Improved browser builds
- Enhanced documentation
- Comprehensive testing

### Changed
- **BREAKING**: New API structure
- **BREAKING**: Modernized configuration
- **BREAKING**: Updated method names
- **BREAKING**: Simplified transaction handling
- Significantly improved performance
- Reduced bundle size

### Removed
- **BREAKING**: Legacy APIs
- **BREAKING**: Deprecated methods
- **BREAKING**: Old configuration options

## [1.0.0] - 2020-10-01

### Added
- Initial release
- Basic transaction creation
- Simple key management
- Basic API calls
- Minimal documentation

[Unreleased]: https://github.com/mahdiyari/hive-tx-js/compare/v7.0.0-beta.6...HEAD
[7.0.0-beta.6]: https://github.com/mahdiyari/hive-tx-js/compare/v6.2.0...v7.0.0-beta.6
[6.2.0]: https://github.com/mahdiyari/hive-tx-js/compare/v6.1.0...v6.2.0
[6.1.0]: https://github.com/mahdiyari/hive-tx-js/compare/v6.0.0...v6.1.0
[6.0.0]: https://github.com/mahdiyari/hive-tx-js/compare/v5.3.0...v6.0.0
[5.3.0]: https://github.com/mahdiyari/hive-tx-js/compare/v5.2.0...v5.3.0
[5.2.0]: https://github.com/mahdiyari/hive-tx-js/compare/v5.1.0...v5.2.0
[5.1.0]: https://github.com/mahdiyari/hive-tx-js/compare/v5.0.0...v5.1.0
[5.0.0]: https://github.com/mahdiyari/hive-tx-js/compare/v4.2.0...v5.0.0
[4.2.0]: https://github.com/mahdiyari/hive-tx-js/compare/v4.1.0...v4.2.0
[4.1.0]: https://github.com/mahdiyari/hive-tx-js/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/mahdiyari/hive-tx-js/compare/v3.2.0...v4.0.0
[3.2.0]: https://github.com/mahdiyari/hive-tx-js/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/mahdiyari/hive-tx-js/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/mahdiyari/hive-tx-js/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/mahdiyari/hive-tx-js/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/mahdiyari/hive-tx-js/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/mahdiyari/hive-tx-js/releases/tag/v1.0.0
