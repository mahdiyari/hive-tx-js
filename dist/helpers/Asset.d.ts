/** Class representing a hive asset,
 * e.g. `1.000 HIVE` or `12.112233 VESTS`. */
export declare class Asset {
    amount: number;
    symbol: string;
    constructor(amount: number, symbol: string);
    /** Create a new Asset instance from a string, e.g. `42.000 HIVE`. */
    static fromString(string: string, expectedSymbol?: string | null): Asset;
    /**
     * Convenience to create new Asset.
     * @param symbol Symbol to use when created from number. Will also be used to validate
     *               the asset, throws if the passed value has a different symbol than this.
     */
    static from(value: number | string | Asset, symbol?: string | null): Asset;
    /** Return asset precision. */
    getPrecision(): 3 | 6 | undefined;
    /** Return a string representation of this asset, e.g. `42.000 HIVE`. */
    toString(): string;
    toJSON(): string;
}
