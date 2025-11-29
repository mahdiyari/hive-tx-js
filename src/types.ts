// TypeScript type definitions for hive-tx-js library

// Asset types
export type AssetSymbol = 'HIVE' | 'HBD' | 'VESTS' | 'STEEM' | 'SBD' | 'TESTS' | 'TBD'

// Authority types
export interface Authority {
  weight_threshold: number
  account_auths: Array<[string, number]>
  key_auths: Array<[string | PublicKey, number]>
}

export interface Beneficiary {
  account: string
  weight: number
}

// Price type
export interface Price {
  base: Asset | string
  quote: Asset | string
}

// Chain Properties
export interface ChainProperties {
  account_creation_fee: Asset | string
  maximum_block_size: number
  hbd_interest_rate: number
}

// Witness Props
export interface WitnessProps {
  account_creation_fee?: Asset | string
  account_subsidy_budget?: number
  account_subsidy_decay?: number
  key?: string | PublicKey
  maximum_block_size?: number
  new_signing_key?: string | PublicKey | null
  hbd_exchange_rate?: Price
  hbd_interest_rate?: number
  url?: string
}

/**
 * Vote on content operation.
 * @example
 * ```typescript
 * const vote: VoteOperation = {
 *   voter: 'alice',
 *   author: 'bob',
 *   permlink: 'my-post',
 *   weight: 10000 // 100%
 * }
 * ```
 */
export interface VoteOperation {
  /** Account casting the vote */
  voter: string
  /** Author of the content */
  author: string
  /** Permalink of the content */
  permlink: string
  /** Vote weight (-10000 to 10000, 10000 = 100%) */
  weight: number
}

/**
 * Create or update content operation.
 * @example
 * ```typescript
 * const comment: CommentOperation = {
 *   parent_author: '',
 *   parent_permlink: 'hive-123456',
 *   author: 'alice',
 *   permlink: 'my-post-title',
 *   title: 'My Post Title',
 *   body: 'Content goes here...',
 *   json_metadata: JSON.stringify({ tags: ['hive', 'tutorial'] })
 * }
 * ```
 */
export interface CommentOperation {
  /** Parent author (empty for top-level posts) */
  parent_author: string
  /** Parent permlink (category for top-level posts) */
  parent_permlink: string
  /** Author account */
  author: string
  /** Post permlink (URL-friendly identifier) */
  permlink: string
  /** Post title */
  title: string
  /** Post content */
  body: string
  /** JSON metadata (tags, app info, etc.) */
  json_metadata: string
}

/**
 * Transfer tokens between accounts.
 * @example
 * ```typescript
 * const transfer: TransferOperation = {
 *   from: 'alice',
 *   to: 'bob',
 *   amount: '1.000 HIVE',
 *   memo: 'Payment for services'
 * }
 * ```
 */
export interface TransferOperation {
  /** Sending account */
  from: string
  /** Receiving account */
  to: string
  /** Amount to transfer */
  amount: Asset | string
  /** Optional memo message */
  memo: string
}

export interface TransferToVestingOperation {
  from: string
  to: string
  amount: Asset | string
}

export interface WithdrawVestingOperation {
  account: string
  vesting_shares: Asset | string
}

export interface AccountCreateOperation {
  fee: Asset | string
  creator: string
  new_account_name: string
  owner: Authority
  active: Authority
  posting: Authority
  memo_key: string | PublicKey
  json_metadata: string
}

export interface AccountCreateWithDelegationOperation {
  fee: Asset | string
  delegation: Asset | string
  creator: string
  new_account_name: string
  owner: Authority
  active: Authority
  posting: Authority
  memo_key: string | PublicKey
  json_metadata: string
  extensions: []
}

export interface AccountUpdateOperation {
  account: string
  owner?: Authority
  active?: Authority
  posting?: Authority
  memo_key: string | PublicKey
  json_metadata: string
}

export interface AccountUpdate2Operation {
  account: string
  owner?: Authority
  active?: Authority
  posting?: Authority
  memo_key?: string | PublicKey
  json_metadata: string
  posting_json_metadata: string
  extensions: []
}

export interface AccountWitnessVoteOperation {
  account: string
  witness: string
  approve: boolean
}

export interface AccountWitnessProxyOperation {
  account: string
  proxy: string
}

export interface ConvertOperation {
  owner: string
  requestid: number
  amount: Asset | string
}

export interface CollateralizedConvertOperation {
  owner: string
  requestid: number
  amount: Asset | string
}

export interface CustomOperation {
  required_auths: string[]
  id: number
  data: Uint8Array | string
}

export interface CustomJsonOperation {
  required_auths: string[]
  required_posting_auths: string[]
  id: string
  json: string
}

export interface ClaimAccountOperation {
  creator: string
  fee: Asset | string
  extensions: []
}

export interface CreateClaimedAccountOperation {
  creator: string
  new_account_name: string
  owner: Authority
  active: Authority
  posting: Authority
  memo_key: string | PublicKey
  json_metadata: string
  extensions: []
}

export interface ClaimRewardBalanceOperation {
  account: string
  reward_hive: Asset | string
  reward_hbd: Asset | string
  reward_vests: Asset | string
}

export interface DelegateVestingSharesOperation {
  delegator: string
  delegatee: string
  vesting_shares: Asset | string
}

export interface DeleteCommentOperation {
  author: string
  permlink: string
}

export interface CommentOptionsOperation {
  author: string
  permlink: string
  max_accepted_payout: Asset | string
  percent_hbd: number
  allow_votes: boolean
  allow_curation_rewards: boolean
  extensions: Array<Array<Beneficiary>>
}

export interface SetWithdrawVestingRouteOperation {
  from_account: string
  to_account: string
  percent: number
  auto_vest: boolean
}

export interface WitnessUpdateOperation {
  owner: string
  url: string
  block_signing_key: string | PublicKey
  props: ChainProperties
  fee: Asset | string
}

export interface WitnessSetPropertiesOperation {
  owner: string
  props: Array<[string, string]>
  extensions: []
}

export interface AccountWitnessVoteOperation {
  account: string
  witness: string
  approve: boolean
}

export interface DeclineVotingRightsOperation {
  account: string
  decline: boolean
}

export interface ResetAccountOperation {
  reset_account: string
  account_to_reset: string
  new_owner_authority: Authority
}

export interface SetResetAccountOperation {
  account: string
  current_reset_account: string
  reset_account: string
}

export interface TransferToSavingsOperation {
  from: string
  to: string
  amount: Asset | string
  memo: string
}

export interface TransferFromSavingsOperation {
  from: string
  request_id: number
  to: string
  amount: Asset | string
  memo: string
}

export interface CancelTransferFromSavingsOperation {
  from: string
  request_id: number
}

export interface LimitOrderCreateOperation {
  owner: string
  orderid: number
  amount_to_sell: Asset | string
  min_to_receive: Asset | string
  fill_or_kill: boolean
  expiration: string | Date
}

export interface LimitOrderCreate2Operation {
  owner: string
  orderid: number
  amount_to_sell: Asset | string
  fill_or_kill: boolean
  exchange_rate: Price
  expiration: string | Date
}

export interface LimitOrderCancelOperation {
  owner: string
  orderid: number
}

export interface FeedPublishOperation {
  publisher: string
  exchange_rate: Price
}

export interface EscrowTransferOperation {
  from: string
  to: string
  hbd_amount: Asset | string
  hive_amount: Asset | string
  escrow_id: number
  agent: string
  fee: Asset | string
  json_meta: string
  ratification_deadline: string | Date
  escrow_expiration: string | Date
}

export interface EscrowDisputeOperation {
  from: string
  to: string
  agent: string
  who: string
  escrow_id: number
}

export interface EscrowReleaseOperation {
  from: string
  to: string
  agent: string
  who: string
  receiver: string
  escrow_id: number
  hbd_amount: Asset | string
  hive_amount: Asset | string
}

export interface EscrowApproveOperation {
  from: string
  to: string
  agent: string
  who: string
  escrow_id: number
  approve: boolean
}

export interface RecoverAccountOperation {
  account_to_recover: string
  new_owner_authority: Authority
  recent_owner_authority: Authority
  extensions: []
}

export interface RequestAccountRecoveryOperation {
  recovery_account: string
  account_to_recover: string
  new_owner_authority: Authority
  extensions: []
}

export interface ChangeRecoveryAccountOperation {
  account_to_recover: string
  new_recovery_account: string
  extensions: []
}

export interface TransferOperation {
  from: string
  to: string
  amount: Asset | string
  memo: string
}

export interface RecurrentTransferOperation {
  from: string
  to: string
  amount: Asset | string
  memo: string
  recurrence: number
  executions: number
  extensions: Array<{ type: number; value: { pair_id: number } }>
}

export interface CreateProposalOperation {
  creator: string
  receiver: string
  start_date: string | Date
  end_date: string | Date
  daily_pay: Asset | string
  subject: string
  permlink: string
  extensions: []
}

export interface UpdateProposalOperation {
  proposal_id: number
  creator: string
  daily_pay: Asset | string
  subject: string
  permlink: string
  extensions: Array<Array<{ end_date: string | Date }>>
}

export interface UpdateProposalVotesOperation {
  voter: string
  proposal_ids: number[]
  approve: boolean
  extensions: []
}

export interface RemoveProposalOperation {
  proposal_owner: string
  proposal_ids: number[]
  extensions: []
}

// Operation Union Type
export type Operation =
  | ['vote', VoteOperation]
  | ['comment', CommentOperation]
  | ['transfer', TransferOperation]
  | ['transfer_to_vesting', TransferToVestingOperation]
  | ['withdraw_vesting', WithdrawVestingOperation]
  | ['account_create', AccountCreateOperation]
  | ['account_create_with_delegation', AccountCreateWithDelegationOperation]
  | ['account_update', AccountUpdateOperation]
  | ['account_update2', AccountUpdate2Operation]
  | ['account_witness_vote', AccountWitnessVoteOperation]
  | ['account_witness_proxy', AccountWitnessProxyOperation]
  | ['convert', ConvertOperation]
  | ['collateralized_convert', CollateralizedConvertOperation]
  | ['custom', CustomOperation]
  | ['custom_json', CustomJsonOperation]
  | ['claim_account', ClaimAccountOperation]
  | ['create_claimed_account', CreateClaimedAccountOperation]
  | ['claim_reward_balance', ClaimRewardBalanceOperation]
  | ['delegate_vesting_shares', DelegateVestingSharesOperation]
  | ['delete_comment', DeleteCommentOperation]
  | ['comment_options', CommentOptionsOperation]
  | ['set_withdraw_vesting_route', SetWithdrawVestingRouteOperation]
  | ['witness_update', WitnessUpdateOperation]
  | ['witness_set_properties', WitnessSetPropertiesOperation]
  | ['decline_voting_rights', DeclineVotingRightsOperation]
  | ['reset_account', ResetAccountOperation]
  | ['set_reset_account', SetResetAccountOperation]
  | ['transfer_to_savings', TransferToSavingsOperation]
  | ['transfer_from_savings', TransferFromSavingsOperation]
  | ['cancel_transfer_from_savings', CancelTransferFromSavingsOperation]
  | ['limit_order_create', LimitOrderCreateOperation]
  | ['limit_order_create2', LimitOrderCreate2Operation]
  | ['limit_order_cancel', LimitOrderCancelOperation]
  | ['feed_publish', FeedPublishOperation]
  | ['escrow_transfer', EscrowTransferOperation]
  | ['escrow_dispute', EscrowDisputeOperation]
  | ['escrow_release', EscrowReleaseOperation]
  | ['escrow_approve', EscrowApproveOperation]
  | ['recover_account', RecoverAccountOperation]
  | ['request_account_recovery', RequestAccountRecoveryOperation]
  | ['change_recovery_account', ChangeRecoveryAccountOperation]
  | ['recurrent_transfer', RecurrentTransferOperation]
  | ['create_proposal', CreateProposalOperation]
  | ['update_proposal', UpdateProposalOperation]
  | ['update_proposal_votes', UpdateProposalVotesOperation]
  | ['remove_proposal', RemoveProposalOperation]

// Extract operation names and body types for conditional typing
export type OperationName = Operation[0]
export type OperationBody<O extends OperationName> = Extract<Operation, [O, any]>[1]

// Transaction Types
export interface TransactionType {
  expiration: string
  extensions: Extension[]
  operations: [OperationName, OperationBody<OperationName>][]
  ref_block_num: number
  ref_block_prefix: number
  signatures: string[]
}

export type Extension = [] | [string, any] | any[]

// API Response Types
export interface BroadcastResponse {
  id: number
  jsonrpc: string
  result: BroadcastResult
}

export interface BroadcastError {
  id: number
  jsonrpc: string
  error: {
    code: number
    message: string
    data?: any
  }
}

export type CallResponse<T = any> =
  | {
      id: number
      jsonrpc: string
      result: T
    }
  | BroadcastError

export interface BroadcastResult {
  tx_id: string
  status: string
}

// Digest type
/**
 * Transaction digest for signing and identification.
 * Contains the cryptographic hash and transaction ID.
 *
 * @example
 * ```typescript
 * const digest = tx.digest()
 * console.log(digest.txId) // 'abc123...'
 * console.log(digest.digest) // Uint8Array(32) // SHA256 hash
 * ```
 */
export interface DigestData {
  /** SHA256 digest of transaction data */
  digest: Uint8Array
  /** Transaction ID (first 40 hex chars of digest) */
  txId: string
}

// Configuration Types
/**
 * Library configuration options.
 * Customize network endpoints, timeouts, and other behaviors.
 *
 * @example
 * ```typescript
 * import { config } from 'hive-tx'
 *
 * config.node = ['https://api.hive.blog']
 * config.timeout = 10
 * config.retry = 3
 * ```
 */
export interface Config {
  /** Address prefix for keys (STM for mainnet) */
  address_prefix: string
  /** Blockchain chain ID for transaction signing */
  chain_id: string
  /** RPC node endpoints for API calls */
  node: string[]
  /** Request timeout in seconds */
  timeout: number
  /** Number of retry attempts for failed requests */
  retry: number
  /** Health check interval in milliseconds */
  healthcheckInterval: number
}

// Utility Types
export interface WitnessSetPropertiesParams extends WitnessProps {}

// Import Asset and PublicKey from their modules to avoid circular deps
import { Asset } from './helpers/Asset'
import { PublicKey } from './helpers/PublicKey'
