export interface paths {
    "/accounts/{account-name}/balances": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Account balances
         * @description Lists account hbd, hive and vest balances
         *
         *     SQL example
         *     * `SELECT * FROM btracker_endpoints.get_account_balances('blocktrades');`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/balance-api/accounts/blocktrades/balances'`
         */
        get: operations["btracker_endpoints.get_account_balances"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{account-name}/balance-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Historical balance change
         * @description History of change of `coin-type` balance in given block range
         *
         *     SQL example
         *     * `SELECT * FROM btracker_endpoints.get_balance_history('blocktrades', 37, 1 ,2);`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/balance-api/accounts/blocktrades/balance-history?coin-type=VESTS&page-size=2'`
         */
        get: operations["btracker_endpoints.get_balance_history"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{account-name}/aggregated-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Aggregated account balance history
         * @description History of change of `coin-type` balance in given block range with granularity of day/month/year
         *
         *     SQL example
         *     * `SELECT * FROM btracker_endpoints.get_balance_aggregation('blocktrades', 'VESTS');`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/balance-api/accounts/blocktrades/aggregated-history?coin-type=VESTS'`
         */
        get: operations["btracker_endpoints.get_balance_aggregation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{account-name}/delegations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Account delegations
         * @description List of incoming and outgoing delegations
         *
         *     SQL example
         *     * `SELECT * FROM btracker_endpoints.get_balance_delegations('blocktrades');`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/balance-api/accounts/blocktrades/delegations'`
         */
        get: operations["btracker_endpoints.get_balance_delegations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{account-name}/recurrent-transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Account recurrent transfers
         * @description List of incoming and outgoing recurrent transfers
         *
         *     SQL example
         *     * `SELECT * FROM btracker_endpoints.get_recurrent_transfers('blocktrades');`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/balance-api/accounts/blocktrades/recurrent-transfers'`
         */
        get: operations["btracker_endpoints.get_recurrent_transfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/top-holders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Top asset holders with total number of account and pages.
         * @description Lists top holders for a given coin with Top asset holders with total number of account and pages to support pagination.
         *
         *     SQL example:
         *     * `SELECT * FROM btracker_endpoints.get_top_holders("HIVE","balance",1,100);`
         *
         *     REST call example:
         *     * `GET "https://rpc.mahdiyari.info/balance-api/top-holders?coin-type=HIVE&balance-type=balance&page=1&page-size=100"
         */
        get: operations["btracker_endpoints.get_top_holders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transfer-statistics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Aggregated transfer statistics
         * @description History of amount of transfers per hour, day, month or year.
         *
         *     SQL example
         *     * `SELECT * FROM btracker_endpoints.get_transfer_statistics('HBD');`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/balance-api/transfer-statistics'`
         */
        get: operations["btracker_endpoints.get_transfer_statistics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Balance tracker's version
         * @description Get Balance tracker's last commit hash (versions set by by hash value).
         *
         *     SQL example
         *     * `SELECT * FROM btracker_endpoints.get_btracker_version();`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/balance-api/version'`
         */
        get: operations["btracker_endpoints.get_btracker_version"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/last-synced-block": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get last block number synced by balance tracker
         * @description Get the block number of the last block synced by balance tracker.
         *
         *     SQL example
         *     * `SELECT * FROM btracker_endpoints.get_btracker_last_synced_block();`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/balance-api/last-synced-block'`
         */
        get: operations["btracker_endpoints.get_btracker_last_synced_block"];
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
        /** @enum {string} */
        "btracker_backend.granularity": "daily" | "monthly" | "yearly";
        /** @enum {string} */
        "btracker_backend.granularity_hourly": "hourly" | "daily" | "monthly" | "yearly";
        /** @enum {string} */
        "btracker_backend.nai_type": "HBD" | "HIVE" | "VESTS";
        /** @enum {string} */
        "btracker_backend.liquid_nai_type": "HBD" | "HIVE";
        /** @enum {string} */
        "btracker_backend.balance_type": "balance" | "savings_balance";
        /** @enum {string} */
        "btracker_backend.sort_direction": "asc" | "desc";
        "btracker_backend.balance": {
            /** @description number of HIVE backed dollars the account has */
            hbd_balance?: number;
            /** @description account's HIVE balance */
            hive_balance?: number;
            /** @description account's VEST balance */
            vesting_shares?: string;
            /** @description the VEST balance, presented in HIVE, is calculated based on the current HIVE price */
            vesting_balance_hive?: number;
            /** @description account's VEST balance - delegated VESTs + reveived VESTs, presented in HIVE,calculated based on the current HIVE price */
            post_voting_power_vests?: string;
            /** @description VESTS delegated to another user, account's power is lowered by delegated VESTS */
            delegated_vests?: string;
            /** @description VESTS received from another user, account's power is increased by received VESTS */
            received_vests?: string;
            /** @description rewards obtained by posting and commenting expressed in VEST */
            curation_rewards?: string;
            /** @description curator's reward expressed in VEST */
            posting_rewards?: string;
            /** @description not yet claimed HIVE backed dollars stored in hbd reward balance */
            hbd_rewards?: number;
            /** @description not yet claimed HIVE stored in hive reward balance */
            hive_rewards?: number;
            /** @description not yet claimed VESTS stored in vest reward balance */
            vests_rewards?: string;
            /** @description the reward vesting balance, denominated in HIVE, is determined by the prevailing HIVE price at the time of reward reception */
            hive_vesting_rewards?: number;
            /** @description saving balance of HIVE backed dollars */
            hbd_savings?: number;
            /** @description HIVE saving balance */
            hive_savings?: number;
            /** @description number representing how many payouts are pending from user's saving balance */
            savings_withdraw_requests?: number;
            /** @description received until the withdrawal is complete, with each installment amounting to 1/13 of the withdrawn total */
            vesting_withdraw_rate?: string;
            /** @description the remaining total VESTS needed to complete withdrawals */
            to_withdraw?: string;
            /** @description the total VESTS already withdrawn from active withdrawals */
            withdrawn?: string;
            /** @description list of account receiving the part of a withdrawal */
            withdraw_routes?: number;
            /** @description blocked VESTS by a withdrawal */
            delayed_vests?: string;
            /** @description total HBD currently pending conversion */
            conversion_pending_amount_hbd?: number;
            /** @description number of HBD conversion requests */
            conversion_pending_count_hbd?: number;
            /** @description total HIVE currently pending conversion */
            conversion_pending_amount_hive?: number;
            /** @description number of HIVE conversion requests */
            conversion_pending_count_hive?: number;
            /** @description count of open HBD orders */
            open_orders_hbd_count?: number;
            /** @description count of open HIVE orders */
            open_orders_hive_count?: number;
            /** @description total amount of HIVE in open orders */
            open_orders_hive_amount?: number;
            /** @description total amount of HBD in open orders */
            open_orders_hbd_amount?: number;
            /** @description total HBD currently pending transfer */
            savings_pending_amount_hbd?: number;
            /** @description total HIVE currently pending transfer */
            savings_pending_amount_hive?: number;
            /** @description total HBD currently locked in escrows (sender-view) */
            escrow_pending_amount_hbd?: number;
            /** @description total HIVE currently locked in escrows (sender-view) */
            escrow_pending_amount_hive?: number;
            /** @description number of distinct open escrows (sender-view) */
            escrow_pending_count?: number;
        };
        "btracker_backend.balances": {
            /** @description aggregated account's balance */
            balance?: string;
            /** @description aggregated account's savings balance */
            savings_balance?: string;
        };
        "btracker_backend.aggregated_history": {
            /**
             * Format: date-time
             * @description date of the balance aggregation
             */
            date?: string;
            /** @description aggregated account's balance */
            balance?: components["schemas"]["btracker_backend.balances"];
            /** @description aggregated account's balance from the previous day/month/year */
            prev_balance?: components["schemas"]["btracker_backend.balances"];
            /** @description minimum account's balance in the aggregation period */
            min_balance?: components["schemas"]["btracker_backend.balances"];
            /** @description maximum account's balance in the aggregation period */
            max_balance?: components["schemas"]["btracker_backend.balances"];
        };
        "btracker_backend.balance_history": {
            /** @description block number */
            block_num?: number;
            /** @description unique operation identifier with an encoded block number and operation type id */
            operation_id?: string;
            /** @description operation type identifier */
            op_type_id?: number;
            /** @description The closing balance */
            balance?: string;
            /** @description Balance in previous day/month/year */
            prev_balance?: string;
            /** @description Diffrence between balance and prev_balance */
            balance_change?: string;
            /**
             * Format: date-time
             * @description Creation date
             */
            timestamp?: string;
        };
        "btracker_backend.operation_history": {
            /** @description Total number of operations */
            total_operations?: number;
            /** @description Total number of pages */
            total_pages?: number;
            /** @description List of operation results */
            operations_result?: components["schemas"]["btracker_backend.balance_history"][];
        };
        "btracker_backend.incoming_delegations": {
            /** @description account name of the delegator */
            delegator?: string;
            /** @description amount of vests delegated */
            amount?: string;
            /** @description unique operation identifier with an encoded block number and operation type id */
            operation_id?: string;
            /** @description block number */
            block_num?: number;
        };
        "btracker_backend.outgoing_delegations": {
            /** @description account name of the delegatee */
            delegatee?: string;
            /** @description amount of vests delegated */
            amount?: string;
            /** @description unique operation identifier with an encoded block number and operation type id */
            operation_id?: string;
            /** @description block number */
            block_num?: number;
        };
        "btracker_backend.delegations": {
            /** @description List of outgoing delegations from the account */
            outgoing_delegations?: components["schemas"]["btracker_backend.outgoing_delegations"][];
            /** @description List of incoming delegations to the account */
            incoming_delegations?: components["schemas"]["btracker_backend.incoming_delegations"][];
        };
        "btracker_backend.amount": {
            nai?: string;
            amount?: string;
            precision?: number;
        };
        "btracker_backend.incoming_recurrent_transfers": {
            /** @description Account name of the sender */
            from?: string;
            /** @description ID of the pair of accounts */
            pair_id?: number;
            /** @description Amount of the transfer with NAI and precision */
            amount?: components["schemas"]["btracker_backend.amount"];
            /** @description amount of consecutive failures */
            consecutive_failures?: number;
            /** @description Remaining executions */
            remaining_executions?: number;
            /** @description Recurrence in hours */
            recurrence?: number;
            /** @description Memo message */
            memo?: string;
            /**
             * Format: date-time
             * @description Date of the next trigger of the transfer
             */
            trigger_date?: string;
            /** @description Unique operation identifier with an encoded block number and operation type id */
            operation_id?: string;
            /** @description Block number */
            block_num?: number;
        };
        "btracker_backend.outgoing_recurrent_transfers": {
            /** @description Account name of the receiver */
            to?: string;
            /** @description ID of the pair of accounts */
            pair_id?: number;
            /** @description Amount of the transfer with NAI and precision */
            amount?: components["schemas"]["btracker_backend.amount"];
            /** @description amount of consecutive failures */
            consecutive_failures?: number;
            /** @description Remaining executions */
            remaining_executions?: number;
            /** @description Recurrence in hours */
            recurrence?: number;
            /** @description Memo message */
            memo?: string;
            /**
             * Format: date-time
             * @description Date of the next trigger of the transfer
             */
            trigger_date?: string;
            /** @description Unique operation identifier with an encoded block number and operation type id */
            operation_id?: string;
            /** @description Block number */
            block_num?: number;
        };
        "btracker_backend.recurrent_transfers": {
            /** @description List of outgoing recurrent transfers from the account */
            outgoing_recurrent_transfers?: components["schemas"]["btracker_backend.outgoing_recurrent_transfers"][];
            /** @description List of incoming recurrent transfers to the account */
            incoming_recurrent_transfers?: components["schemas"]["btracker_backend.incoming_recurrent_transfers"][];
        };
        "btracker_backend.transfer_stats": {
            /**
             * Format: date-time
             * @description the time transfers were included in the blockchain
             */
            date?: string;
            /** @description sum of a amount of transfered tokens in the period */
            total_transfer_amount?: string;
            /** @description average amount of transfered tokens in the period */
            average_transfer_amount?: string;
            /** @description maximum amount of transfered tokens in the period */
            maximum_transfer_amount?: string;
            /** @description minimum amount of transfered tokens in the period */
            minimum_transfer_amount?: string;
            /** @description number of transfers in the period */
            transfer_count?: number;
            /** @description last block number in time range */
            last_block_num?: number;
        };
        "btracker_backend.array_of_transfer_stats": components["schemas"]["btracker_backend.transfer_stats"][];
        "btracker_backend.ranked_holder": {
            /** @description Position in the ranking */
            rank?: number;
            /** @description Account name */
            account?: string;
            /** @description Asset balance for that account */
            value?: string;
        };
        "btracker_backend.top_holders": {
            /** @description Total number of accounts that match */
            total_accounts?: number;
            /** @description Total number of pages (given requested page-size) */
            total_pages?: number;
            /** @description Ranked holders for the requested page */
            holders_result?: components["schemas"]["btracker_backend.ranked_holder"][];
        };
        "btracker_backend.array_of_aggregated_history": components["schemas"]["btracker_backend.aggregated_history"][];
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "btracker_endpoints.get_account_balances": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Name of the account */
                "account-name": string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Account balances
             *     (VEST balances are represented as string due to json limitations)
             *
             *     * Returns `btracker_backend.balance`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "hbd_balance": 77246982,
                     *       "hive_balance": 29594875,
                     *       "vesting_shares": "8172549681941451",
                     *       "vesting_balance_hive": 2720696229,
                     *       "post_voting_power_vests": "8172549681941451",
                     *       "delegated_vests": "0",
                     *       "received_vests": "0",
                     *       "curation_rewards": "196115157",
                     *       "posting_rewards": "65916519",
                     *       "hbd_rewards": 0,
                     *       "hive_rewards": 0,
                     *       "vests_rewards": "0",
                     *       "hive_vesting_rewards": 0,
                     *       "hbd_savings": 0,
                     *       "hive_savings": 0,
                     *       "savings_withdraw_requests": 0,
                     *       "vesting_withdraw_rate": "80404818220529",
                     *       "to_withdraw": "8362101094935031",
                     *       "withdrawn": "804048182205290",
                     *       "withdraw_routes": 4,
                     *       "delayed_vests": "0",
                     *       "conversion_pending_amount_hbd": 0,
                     *       "conversion_pending_count_hbd": 0,
                     *       "conversion_pending_amount_hive": 0,
                     *       "conversion_pending_count_hive": 0,
                     *       "open_orders_hbd_count": 0,
                     *       "open_orders_hive_count": 0,
                     *       "open_orders_hive_amount": 0,
                     *       "open_orders_hbd_amount": 0,
                     *       "savings_pending_amount_hbd": 0,
                     *       "savings_pending_amount_hive": 0,
                     *       "escrow_pending_amount_hbd": 0,
                     *       "escrow_pending_amount_hive": 0,
                     *       "escrow_pending_count": 0
                     *     }
                     */
                    "application/json": components["schemas"]["btracker_backend.balance"];
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
    "btracker_endpoints.get_balance_history": {
        parameters: {
            query: {
                /**
                 * @description Coin types:
                 *
                 *     * HBD
                 *
                 *     * HIVE
                 *
                 *     * VESTS
                 */
                "coin-type": components["schemas"]["btracker_backend.nai_type"];
                /**
                 * @description Balance types:
                 *
                 *     * balance
                 *
                 *     * savings_balance
                 */
                "balance-type"?: components["schemas"]["btracker_backend.balance_type"];
                /**
                 * @description Return page on `page` number, default null due to reversed order of pages,
                 *     the first page is the oldest,
                 *     example: first call returns the newest page and total_pages is 100 - the newest page is number 100, next 99 etc.
                 */
                page?: number;
                /** @description Return max `page-size` operations per page, defaults to `100` */
                "page-size"?: number;
                /**
                 * @description Sort order:
                 *
                 *      * `asc` - Ascending, from oldest to newest
                 *
                 *      * `desc` - Descending, from newest to oldest
                 */
                direction?: components["schemas"]["btracker_backend.sort_direction"];
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
                /** @description Name of the account */
                "account-name": string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Balance change
             *
             *     * Returns `btracker_backend.operation_history`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "total_operations": 188291,
                     *       "total_pages": 94146,
                     *       "operations_result": [
                     *         {
                     *           "block_num": 4999992,
                     *           "operation_id": "21474802120262208",
                     *           "op_type_id": 64,
                     *           "balance": "8172549681941451",
                     *           "prev_balance": "8172546678091286",
                     *           "balance_change": "3003850165",
                     *           "timestamp": "2016-09-15T19:46:57"
                     *         },
                     *         {
                     *           "block_num": 4999959,
                     *           "operation_id": "21474660386343488",
                     *           "op_type_id": 64,
                     *           "balance": "8172546678091286",
                     *           "prev_balance": "8172543674223181",
                     *           "balance_change": "3003868105",
                     *           "timestamp": "2016-09-15T19:45:12"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": components["schemas"]["btracker_backend.operation_history"];
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
    "btracker_endpoints.get_balance_aggregation": {
        parameters: {
            query: {
                /**
                 * @description Coin types:
                 *
                 *     * HBD
                 *
                 *     * HIVE
                 *
                 *     * VESTS
                 */
                "coin-type": components["schemas"]["btracker_backend.nai_type"];
                /**
                 * @description granularity types:
                 *
                 *     * daily
                 *
                 *     * monthly
                 *
                 *     * yearly
                 */
                granularity?: components["schemas"]["btracker_backend.granularity"];
                /**
                 * @description Sort order:
                 *
                 *      * `asc` - Ascending, from oldest to newest
                 *
                 *      * `desc` - Descending, from newest to oldest
                 */
                direction?: components["schemas"]["btracker_backend.sort_direction"];
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
                /** @description Name of the account */
                "account-name": string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Balance change
             *
             *     * Returns array of `btracker_backend.aggregated_history`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example [
                     *       {
                     *         "date": "2017-01-01T00:00:00",
                     *         "balance": {
                     *           "balance": "8172549681941451",
                     *           "savings_balance": "0"
                     *         },
                     *         "prev_balance": {
                     *           "balance": "0",
                     *           "savings_balance": "0"
                     *         },
                     *         "min_balance": {
                     *           "balance": "1000000000000",
                     *           "savings_balance": "0"
                     *         },
                     *         "max_balance": {
                     *           "balance": "8436182707535769",
                     *           "savings_balance": "0"
                     *         }
                     *       }
                     *     ]
                     */
                    "application/json": components["schemas"]["btracker_backend.array_of_aggregated_history"];
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
    "btracker_endpoints.get_balance_delegations": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Name of the account */
                "account-name": string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Incoming and outgoing delegations
             *
             *     * Returns `btracker_backend.delegations`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "outgoing_delegations": [],
                     *       "incoming_delegations": []
                     *     }
                     */
                    "application/json": components["schemas"]["btracker_backend.delegations"];
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
    "btracker_endpoints.get_recurrent_transfers": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Name of the account */
                "account-name": string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Incoming and outgoing recurrent transfers
             *
             *     * Returns `btracker_backend.recurrent_transfers`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "outgoing_recurrent_transfers": [],
                     *       "incoming_recurrent_transfers": []
                     *     }
                     */
                    "application/json": components["schemas"]["btracker_backend.recurrent_transfers"];
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
    "btracker_endpoints.get_top_holders": {
        parameters: {
            query: {
                /**
                 * @description * HBD
                 *     * HIVE
                 *     * VESTS
                 */
                "coin-type": components["schemas"]["btracker_backend.nai_type"];
                /**
                 * @description `balance` or `savings_balance`
                 *     (`savings_balance` not allowed with `VESTS`).
                 */
                "balance-type"?: components["schemas"]["btracker_backend.balance_type"];
                /** @description 1-based page number. */
                page?: number;
                /** @description Max results per page (capped by backend validator). */
                "page-size"?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ranked holders with totals number of pages and acounts. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["btracker_backend.top_holders"];
                };
            };
            /** @description Unsupported parameter combination */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "btracker_endpoints.get_transfer_statistics": {
        parameters: {
            query: {
                /**
                 * @description Coin types:
                 *
                 *     * HBD
                 *
                 *     * HIVE
                 */
                "coin-type": components["schemas"]["btracker_backend.liquid_nai_type"];
                /**
                 * @description granularity types:
                 *
                 *     * hourly
                 *
                 *     * daily
                 *
                 *     * monthly
                 *
                 *     * yearly
                 */
                granularity?: components["schemas"]["btracker_backend.granularity_hourly"];
                /**
                 * @description Sort order:
                 *
                 *      * `asc` - Ascending, from oldest to newest
                 *
                 *      * `desc` - Descending, from newest to oldest
                 */
                direction?: components["schemas"]["btracker_backend.sort_direction"];
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
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Balance change
             *
             *     * Returns array of `btracker_backend.transfer_stats`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example [
                     *       {
                     *         "date": "2017-01-01T00:00:00",
                     *         "total_transfer_amount": "69611921266",
                     *         "average_transfer_amount": "1302405",
                     *         "maximum_transfer_amount": "18000000",
                     *         "minimum_transfer_amount": "1",
                     *         "transfer_count": 54665,
                     *         "last_block_num": 5000000
                     *       }
                     *     ]
                     */
                    "application/json": components["schemas"]["btracker_backend.array_of_transfer_stats"];
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
    "btracker_endpoints.get_btracker_version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Balance tracker version
             *
             *     * Returns `TEXT`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /** @example c2fed8958584511ef1a66dab3dbac8c40f3518f0 */
                    "application/json": string;
                };
            };
            /** @description App not installed */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "btracker_endpoints.get_btracker_last_synced_block": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Last synced block by balance tracker
             *
             *     * Returns `INT`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /** @example 5000000 */
                    "application/json": number;
                };
            };
            /** @description No blocks synced */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
