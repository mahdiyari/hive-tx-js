import { PublicKey } from './PublicKey';
export interface WitnessProps {
    account_creation_fee?: string;
    account_subsidy_budget?: number;
    account_subsidy_decay?: number;
    key: PublicKey | string;
    maximum_block_size?: number;
    new_signing_key?: PublicKey | string | null;
    hbd_exchange_rate?: {
        base: string;
        quote: string;
    };
    hbd_interest_rate?: number;
    url?: string;
}
/** Return null for a valid username */
export declare const validateUsername: (username: string) => null | string;
export declare const operations: {
    vote: number;
    comment: number;
    transfer: number;
    transfer_to_vesting: number;
    withdraw_vesting: number;
    limit_order_create: number;
    limit_order_cancel: number;
    feed_publish: number;
    convert: number;
    account_create: number;
    account_update: number;
    witness_update: number;
    account_witness_vote: number;
    account_witness_proxy: number;
    pow: number;
    custom: number;
    report_over_production: number;
    delete_comment: number;
    custom_json: number;
    comment_options: number;
    set_withdraw_vesting_route: number;
    limit_order_create2: number;
    claim_account: number;
    create_claimed_account: number;
    request_account_recovery: number;
    recover_account: number;
    change_recovery_account: number;
    escrow_transfer: number;
    escrow_dispute: number;
    escrow_release: number;
    pow2: number;
    escrow_approve: number;
    transfer_to_savings: number;
    transfer_from_savings: number;
    cancel_transfer_from_savings: number;
    custom_binary: number;
    decline_voting_rights: number;
    reset_account: number;
    set_reset_account: number;
    claim_reward_balance: number;
    delegate_vesting_shares: number;
    account_create_with_delegation: number;
    witness_set_properties: number;
    account_update2: number;
    create_proposal: number;
    update_proposal_votes: number;
    remove_proposal: number;
    update_proposal: number;
    collateralized_convert: number;
    recurrent_transfer: number;
    fill_convert_request: number;
    author_reward: number;
    curation_reward: number;
    comment_reward: number;
    liquidity_reward: number;
    interest: number;
    fill_vesting_withdraw: number;
    fill_order: number;
    shutdown_witness: number;
    fill_transfer_from_savings: number;
    hardfork: number;
    comment_payout_update: number;
    return_vesting_delegation: number;
    comment_benefactor_reward: number;
    producer_reward: number;
    clear_null_account_balance: number;
    proposal_pay: number;
    sps_fund: number;
    hardfork_hive: number;
    hardfork_hive_restore: number;
    delayed_voting: number;
    consolidate_treasury_balance: number;
    effective_comment_vote: number;
    ineffective_delete_comment: number;
    sps_convert: number;
    expired_account_notification: number;
    changed_recovery_account: number;
    transfer_to_vesting_completed: number;
    pow_reward: number;
    vesting_shares_split: number;
    account_created: number;
    fill_collateralized_convert_request: number;
    system_warning: number;
    fill_recurrent_transfer: number;
    failed_recurrent_transfer: number;
    limit_order_cancelled: number;
    producer_missed: number;
    proposal_fee: number;
    collateralized_convert_immediate_conversion: number;
    escrow_approved: number;
    escrow_rejected: number;
    proxy_cleared: number;
    declined_voting_rights: number;
};
/**
 * Make bitmask filter to be used with get_account_history call
 */
export declare const makeBitMaskFilter: (allowedOperations: number[]) => any[];
/**
 * Needed for witness_set_properties operation
 * Example in utils.d.ts
 */
export declare const buildWitnessSetProperties: (owner: string, props: WitnessProps) => ["witness_set_properties", {
    extensions: [];
    owner: string;
    props: any;
}];
