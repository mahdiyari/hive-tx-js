/** Create transaction by operations */
export declare const createTransaction: (operations: any, exp: any) => Promise<{
    expiration: string;
    extensions: never[];
    operations: any;
    ref_block_num: number;
    ref_block_prefix: number;
}>;
