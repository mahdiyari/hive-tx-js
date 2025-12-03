export interface paths {
    "/version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get NFT Tracker's version
         * @description Get NFT Tracker's last commit hash (versions set by hash value).
         *
         *     SQL example
         *     * `SELECT * FROM nfttracker_endpoints.get_version();`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/version'`
         */
        get: operations["nfttracker_endpoints.get_version"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nfts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * NFT types
         * @description Returns registered NFT types.
         *
         *     SQL example
         *     * `SELECT * FROM nfttracker_endpoints.get_nft_types();`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/nfts'`
         */
        get: operations["nfttracker_endpoints.get_nft_types"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nfts/{creator}/{symbol}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * NFT instances
         * @description Returns issued instances of given NFT symbol.
         *
         *     SQL example
         *     * `SELECT * FROM nfttracker_endpoints.get_nft_instances('alice', 'TEST');`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/nfts/alice/TEST'`
         */
        get: operations["nfttracker_endpoints.get_nft_instances"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/nfts/{creator}/{symbol}/{tags}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * NFT instances
         * @description Returns issued instances of given NFT symbol.
         *
         *     SQL example
         *     * `SELECT * FROM nfttracker_endpoints.get_nft_instances('alice', 'TEST');`
         *
         *     REST call example
         *     * `GET 'https://rpc.mahdiyari.info/nft-tracker-api/nfts/alice/TEST'`
         */
        get: operations["nfttracker_endpoints.get_nft_instances_with_tags"];
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
        "nfttracker_endpoints.nft_type": {
            /** @description id of NFT type */
            id?: number;
            /** @description account name that registered NFT type */
            creator?: string;
            /** @description current owner of NFT type */
            owner?: string;
            /** @description symbol name of registered NFT type */
            symbol?: string;
            /** @description name of registered NFT type */
            name?: string;
            /** @description max number of possible issued instances of this NFT type */
            max_count?: number;
            /**
             * Format: date-time
             * @description the timestamp when the NFT type was registered
             */
            created_at?: string;
            /**
             * Format: date-time
             * @description the timestamp when the NFT type was last modified
             */
            updated_at?: string;
            /** @description list of accounts that can issue instance of this NFT type */
            authorized_issuers?: string[];
        };
        "nfttracker_endpoints.nft_instance": {
            /** @description id of NFT instance */
            id?: number;
            /** @description account currently owning this instance */
            holder?: string;
            /** @description extra data as JSON */
            data?: string;
            /** @description extra tags associated with this instance */
            tags?: string[];
            /** @description whether this instance is soulbound (cannot be transferred to other account) */
            soulbound?: boolean;
            /**
             * Format: date-time
             * @description the timestamp when this instance was created
             */
            created_at?: string;
            /**
             * Format: date-time
             * @description the timestamp this instance was last modified
             */
            updated_at?: string;
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
    "nfttracker_endpoints.get_version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description NFT Tracker version
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
    "nfttracker_endpoints.get_nft_types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Registered NFT types
             *
             *     * Returns `nfttracker_endpoints.nft_type`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example [
                     *       {
                     *         "id": 1,
                     *         "creator": "alice",
                     *         "owner": "bob",
                     *         "symbol": "TEST",
                     *         "name": "Test symbol",
                     *         "max_count": 10,
                     *         "created_at": "2025-08-22T12:00:00",
                     *         "updated_at": "2025-08-22T12:00:00"
                     *       }
                     *     ]
                     */
                    "application/json": components["schemas"]["nfttracker_endpoints.nft_type"][];
                };
            };
        };
    };
    "nfttracker_endpoints.get_nft_instances": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description name of the account that created the NFT type */
                creator: string;
                /** @description NFT symbol */
                symbol: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Issued NFT instances of given symbol
             *
             *     * Returns `nfttracker_endpoints.nft_instance`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example [
                     *       {
                     *         "id": 1,
                     *         "holder": "alice",
                     *         "data": "{\"key\": \"value\"}",
                     *         "tags": [
                     *           "item",
                     *           "collectible"
                     *         ],
                     *         "soulbound": false,
                     *         "created_at": "2025-08-22T12:00:00",
                     *         "updated_at": "2025-08-22T12:00:00"
                     *       }
                     *     ]
                     */
                    "application/json": components["schemas"]["nfttracker_endpoints.nft_instance"][];
                };
            };
            /** @description creator/symbol combination does not exist */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "nfttracker_endpoints.get_nft_instances_with_tags": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description name of the account that created the NFT type */
                creator: string;
                /** @description NFT symbol */
                symbol: string;
                /**
                 * @description Only return instances with tags matching pattern.
                 *     Pattern is a pipe-separated list of comma-separated tags.
                 *     Example: `a,b|x,y|z` will match instances with tags 'a' and 'b', 'x' and 'y', or 'z'.
                 */
                tags: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description Issued NFT instances of given symbol
             *
             *     * Returns `nfttracker_endpoints.nft_instance`
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example [
                     *       {
                     *         "id": 1,
                     *         "holder": "alice",
                     *         "data": "{\"key\": \"value\"}",
                     *         "tags": [
                     *           "item",
                     *           "collectible"
                     *         ],
                     *         "soulbound": false,
                     *         "created_at": "2025-08-22T12:00:00",
                     *         "updated_at": "2025-08-22T12:00:00"
                     *       }
                     *     ]
                     */
                    "application/json": components["schemas"]["nfttracker_endpoints.nft_instance"][];
                };
            };
            /** @description creator/symbol combination does not exist */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
