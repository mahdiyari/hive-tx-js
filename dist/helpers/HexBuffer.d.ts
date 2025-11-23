/** Buffer wrapper that serializes to a hex-encoded string. */
export declare class HexBuffer {
    buffer: Uint8Array;
    /** Convenience to create a new HexBuffer, does not copy data if value passed is already a buffer. */
    static from(value: any): HexBuffer;
    constructor(buffer: any);
    toString(encoding?: string): string;
    toJSON(): string;
}
