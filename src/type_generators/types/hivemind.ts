export interface paths {
    "/accounts/{account-name}/operations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get operations for an account by recency.
         * @description List the non-virtual operations in reversed order (first page is the oldest) for given account.
         *     The page size determines the number of operations per page.
         *
         *     SQL example
         *     * `SELECT * FROM hivemind_endpoints.get_ops_by_account('blocktrades');`
         *
         *     REST call example
         *     * `GET 'https://{hivemind-host}/hivemind-api/accounts/blocktrades/operations?page-size=3'`
         */
        get: operations["hivemind_endpoints.get_ops_by_account"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        "hivemind_endpoints.block_range_type": {
            from?: number;
            to?: number;
        };
        "hivemind_endpoints.operation_body": {
            type?: string;
            value?: Record<string, never>;
        };
        "hivemind_endpoints.array_of_operations": components["schemas"]["hivemind_endpoints.operation_body"][];
        "hivemind_endpoints.operation": {
            /** @description operation body */
            op?: components["schemas"]["hivemind_endpoints.operation_body"];
            /** @description block containing the operation */
            block?: number;
            /** @description hash of the transaction */
            trx_id?: string;
            /** @description operation identifier that indicates its sequence number in transaction */
            op_pos?: number;
            /** @description operation type identifier */
            op_type_id?: number;
            /**
             * Format: date-time
             * @description creation date
             */
            timestamp?: string;
            /** @description true if is a virtual operation */
            virtual_op?: boolean;
            /** @description unique operation identifier with an encoded block number and operation type id */
            operation_id?: string;
            /** @description transaction identifier that indicates its sequence number in block */
            trx_in_block?: number;
        };
        "hivemind_endpoints.operation_history": {
            /** @description Total number of operations */
            total_operations?: number;
            /** @description Total number of pages */
            total_pages?: number;
            /** @description Range of blocks that contains the returned pages */
            block_range?: components["schemas"]["hivemind_endpoints.block_range_type"];
            /** @description List of operation results */
            operations_result?: components["schemas"]["hivemind_endpoints.operation"][];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "hivemind_endpoints.get_ops_by_account": {
        parameters: {
            query?: {
                /** @description Account name of the observer */
                "observer-name"?: string;
                /**
                 * @description List of operation types to get. If NULL, gets all non-virtual operation types.
                 *     example: `18,12`
                 */
                "operation-types"?: string;
                /**
                 * @description Return page on `page` number, default null due to reversed order of pages,
                 *     the first page is the oldest,
                 *     example: first call returns the newest page and total_pages is 100 - the newest page is number 100, next 99 etc.
                 */
                page?: number;
                /** @description Return max `page-size` operations per page, defaults to `100`. */
                "page-size"?: number;
                /**
                 * @description If the operation length exceeds the data size limit,
                 *     the operation body is replaced with a placeholder (defaults to `200000`).
                 */
                "data-size-limit"?: number;
                /**
                 * @description Lower limit of the block range, can be represented either by a block-number (integer) or a timestamp (in the format YYYY-MM-DD HH:MI:SS).
                 *
                 *     The provided `timestamp` will be converted to a `block-num` by finding the first block
                 *     where the block's `created_at` is more than or equal to the given `timestamp` (i.e. `block's created_at >= timestamp`).
                 *
                 *     The function will interpret and convert the input based on its format, example input:
                 *
                 *     * `2016-09-15 19:47:21`
                 *
                 *     * `5000000`
                 */
                "from-block"?: string;
                /**
                 * @description Similar to the from-block parameter, can either be a block-number (integer) or a timestamp (formatted as YYYY-MM-DD HH:MI:SS).
                 *
                 *     The provided `timestamp` will be converted to a `block-num` by finding the first block
                 *     where the block's `created_at` is less than or equal to the given `timestamp` (i.e. `block's created_at <= timestamp`).
                 *
                 *     The function will convert the value depending on its format, example input:
                 *
                 *     * `2016-09-15 19:47:21`
                 *
                 *     * `5000000`
                 */
                "to-block"?: string;
            };
            header?: never;
            path: {
                /** @description Account to get operations for. */
                "account-name": string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Result contains total number of operations,
             *     total pages, and the list of operations.
             *
             *     * Returns `hivemind_endpoints.operation_history`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "total_operations": 219867,
                     *       "total_pages": 73289,
                     *       "block_range": {
                     *         "from": 1,
                     *         "to": 5000000
                     *       },
                     *       "operations_result": [
                     *         {
                     *           "op": {
                     *             "type": "transfer_operation",
                     *             "value": {
                     *               "to": "blocktrades",
                     *               "from": "mrwang",
                     *               "memo": "a79c09cd-0084-4cd4-ae63-bf6d2514fef9",
                     *               "amount": {
                     *                 "nai": "@@000000013",
                     *                 "amount": "1633",
                     *                 "precision": 3
                     *               }
                     *             }
                     *           },
                     *           "block": 4999997,
                     *           "trx_id": "e75f833ceb62570c25504b55d0f23d86d9d76423",
                     *           "op_pos": 0,
                     *           "op_type_id": 2,
                     *           "timestamp": "2016-09-15T19:47:12",
                     *           "virtual_op": false,
                     *           "operation_id": "21474823595099394",
                     *           "trx_in_block": 3
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": components["schemas"]["hivemind_endpoints.operation_history"];
                };
            };
            /** @description No such account in the database */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
