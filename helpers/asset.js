/** Class representing a hive asset,
 * e.g. `1.000 HIVE` or `12.112233 VESTS`. */
class Asset {
  /** Create a new Asset instance from a string, e.g. `42.000 HIVE`. */
  static fromString (string, expectedSymbol = null) {
    const [amountString, symbol] = string.split(' ')
    if (
      ['STEEM', 'VESTS', 'SBD', 'TESTS', 'TBD', 'HIVE', 'HBD'].indexOf(
        symbol
      ) === -1
    ) {
      throw new Error(`Invalid asset symbol: ${symbol}`)
    }
    if (expectedSymbol && symbol !== expectedSymbol) {
      throw new Error(
        `Invalid asset, expected symbol: ${expectedSymbol} got: ${symbol}`
      )
    }
    const amount = Number.parseFloat(amountString)
    if (!Number.isFinite(amount)) {
      throw new Error(`Invalid asset amount: ${amountString}`)
    }
    return new Asset(amount, symbol)
  }

  /**
   * Convenience to create new Asset.
   * @param symbol Symbol to use when created from number. Will also be used to validate
   *               the asset, throws if the passed value has a different symbol than this.
   */
  static from (value, symbol = null) {
    if (value instanceof Asset) {
      if (symbol && value.symbol !== symbol) {
        throw new Error(
          `Invalid asset, expected symbol: ${symbol} got: ${value.symbol}`
        )
      }
      return value
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      return new Asset(value, symbol || 'STEEM')
    } else if (typeof value === 'string') {
      return Asset.fromString(value, symbol)
    } else {
      throw new Error(`Invalid asset '${String(value)}'`)
    }
  }

  // We convert HIVE & HBD strings to STEEM & SBD because the serialization should be based on STEEM & SBD
  constructor (amount, symbol) {
    this.amount = amount
    this.symbol =
      symbol === 'HIVE' ? 'STEEM' : symbol === 'HBD' ? 'SBD' : symbol
  }

  /** Return asset precision. */
  getPrecision () {
    switch (this.symbol) {
      case 'TESTS':
      case 'TBD':
      case 'STEEM':
      case 'SBD':
      case 'HBD':
      case 'HIVE':
        return 3
      case 'VESTS':
        return 6
    }
  }

  /** Return a string representation of this asset, e.g. `42.000 HIVE`. */
  toString () {
    return `${this.amount.toFixed(this.getPrecision())} ${this.symbol}`
  }

  toJSON () {
    return this.toString()
  }
}

module.exports = Asset
