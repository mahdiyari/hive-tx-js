type MethodToParams = {
  'account_by_key_api.get_key_references': {
    keys: string[]
  }
  'account_history_api.enum_virtual_ops': {
    block_range_begin: number
    block_range_end: number
    include_reversible?: boolean
    group_by_block?: boolean
    operation_begin?: string | number
    limit?: number
    filter?: string | number
  }
  'account_history_api.get_account_history': {
    account: string
    start: number
    limit: number
    include_reversible?: boolean
    operation_filter_low?: number
    operation_filter_high?: number
  }
  'account_history_api.get_ops_in_block': {
    block_num: number
    only_virtual: boolean
    include_reversible?: boolean
  }
  'account_history_api.get_transaction': {
    id: string
    include_reversible?: boolean
  }
  'block_api.get_block': {
    block_num: number
  }
  'block_api.get_block_header': {
    block_num: number
  }
  'block_api.get_block_range': {
    starting_block_num: number
    count: number
  }
  'bridge.account_notifications': {
    account: string
    limit: number
  }
  'bridge.does_user_follow_any_lists': {
    observer: string
  }
  'bridge.get_account_posts': {
    sort: string
    account: string
    start_author?: string
    start_permlink?: string
    limit?: number
    observer?: string
  }
  'bridge.get_community': {
    name: string
    observer: string
  }
  'bridge.get_community_context': {
    name: string
    account: string
  }
  'bridge.get_discussion': {
    author: string
    permlink: string
    observer: string
  }
  'bridge.get_follow_list': {
    observer: string
    follow_type: string
  }
  'bridge.get_payout_stats': {
    limit?: number
  }
  'bridge.get_post': {
    author: string
    permlink: string
    observer?: string
  }
  'bridge.get_post_header': {
    author: string
    permlink: string
  }
  'bridge.get_profile': {
    account: string
    observer?: string
  }
  'bridge.get_profiles': {
    accounts?: string[]
    observer?: string
  }
  'bridge.get_ranked_posts': {
    sort: string
    tag: string
    observer: string
  }
  'bridge.get_relationship_between_accounts': {
    account1: string
    account2?: string
    observer?: string
  }
  'bridge.get_trending_topics': {
    limit?: number
    observer?: string
  }
  'bridge.list_all_subscriptions': {
    account: string
  }
  'bridge.list_communities': {
    last?: string
    limit?: number
    query?: string
    sort?: string
    observer?: string
  }
  'bridge.list_community_roles': {
    last?: string
    limit?: number
    community: string
  }
  'bridge.list_muted_reasons_enum': []
  'bridge.list_pop_communities': {
    limit: number
  }
  'bridge.list_subscribers': {
    last?: string
    limit?: number
    community: string
  }
  'bridge.normalize_post': {
    author: string
    permlink: string
  }
  'bridge.post_notifications': {
    author: string
    permlink: string
    min_score?: number
    last_id?: number
    limit?: number
  }
  'bridge.unread_notifications': {
    account: string
    min_score?: number
  }
  'condenser_api.broadcast_transaction': ({
    ref_block_num: number
    ref_block_prefix: number
    expiration: string
    extensions: { type: string; value: string }[]
    signatures: string[]
  } & { operations: { type: string; value: {} }[] })[]
  'condenser_api.broadcast_transaction_synchronous': ({
    ref_block_num: number
    ref_block_prefix: number
    expiration: string
    extensions: { type: string; value: string }[]
    signatures: string[]
  } & { operations: { type: string; value: {} }[] })[]
  'condenser_api.find_proposals': number[][]
  'condenser_api.find_rc_accounts': string[][]
  'condenser_api.find_recurrent_transfers': string[]
  'condenser_api.get_account_count': []
  'condenser_api.get_account_history': (string | number)[]
  'condenser_api.get_account_reputations': {
    account_lower_bound?: string
    limit?: number
  }
  'condenser_api.get_accounts': string[][]
  'condenser_api.get_active_votes': {
    account: string
    permlink: string
    observer?: string
  }
  'condenser_api.get_active_witnesses': []
  'condenser_api.get_block': number[]
  'condenser_api.get_block_header': number[]
  'condenser_api.get_blog': {
    account: string
    start_entry_id?: number
    limit?: number
    observer?: string
  }
  'condenser_api.get_blog_entries': {
    account: string
    start_entry_id?: number
    limit?: number
    observer?: string
  }
  'condenser_api.get_chain_properties': []
  'condenser_api.get_collateralized_conversion_requests': string[]
  'condenser_api.get_comment_discussions_by_payout': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_config': []
  'condenser_api.get_content': {
    account: string
    permlink: string
    observer?: string
  }
  'condenser_api.get_content_replies': {
    account: string
    permlink: string
    observer?: string
  }
  'condenser_api.get_conversion_requests': string[]
  'condenser_api.get_current_median_history_price': []
  'condenser_api.get_discussions_by_author_before_date': {
    account: string
    start_permlink?: string
    before_date?: string
    limit?: number
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_discussions_by_blog': {
    tag: string
    start_author?: string
    start_permlink?: string
    limit?: number
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_discussions_by_comments': {
    start_author: string
    start_permlink?: string
    limit?: number
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_discussions_by_created': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_discussions_by_feed': {
    tag: string
    start_author?: string
    start_permlink?: string
    limit?: number
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_discussions_by_hot': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_discussions_by_trending': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_dynamic_global_properties': []
  'condenser_api.get_escrow': [string | number, string | number]
  'condenser_api.get_expiring_vesting_delegations': [string | string, string | string]
  'condenser_api.get_feed_history': []
  'condenser_api.get_follow_count': {
    account: string
  }
  'condenser_api.get_followers': {
    account: string
    start?: unknown
    follow_type?: string
    limit?: number
  }
  'condenser_api.get_following': {
    account: string
    start?: unknown
    follow_type?: string
    limit?: number
  }
  'condenser_api.get_hardfork_version': []
  'condenser_api.get_key_references': string[][]
  'condenser_api.get_market_history': [number | string, number | string, number | string]
  'condenser_api.get_market_history_buckets': []
  'condenser_api.get_next_scheduled_hardfork': []
  'condenser_api.get_open_orders': string[]
  'condenser_api.get_ops_in_block': (number | boolean)[]
  'condenser_api.get_order_book': number[]
  'condenser_api.get_owner_history': string[]
  'condenser_api.get_post_discussions_by_payout': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_potential_signatures': ({
    ref_block_num: number
    ref_block_prefix: number
    expiration: string
    extensions: { type: string; value: string }[]
    signatures: string[]
  } & { operations: { type: string; value: {} }[] })[]
  'condenser_api.get_reblogged_by': {
    author: string
    permlink: string
  }
  'condenser_api.get_recent_trades': number[]
  'condenser_api.get_recovery_request': string[]
  'condenser_api.get_replies_by_last_update': {
    start_author: string
    start_permlink?: string
    limit?: number
    truncate_body?: number
    observer?: string
  }
  'condenser_api.get_required_signatures': [
    (
      | ({
          ref_block_num: number
          ref_block_prefix: number
          expiration: string
          extensions: { type: string; value: string }[]
          signatures: string[]
        } & { operations: { type: string; value: {} }[] })
      | string[]
    ),
    (
      | ({
          ref_block_num: number
          ref_block_prefix: number
          expiration: string
          extensions: { type: string; value: string }[]
          signatures: string[]
        } & { operations: { type: string; value: {} }[] })
      | string[]
    )
  ]
  'condenser_api.get_reward_fund': string[]
  'condenser_api.get_savings_withdraw_from': string[]
  'condenser_api.get_savings_withdraw_to': string[]
  'condenser_api.get_ticker': []
  'condenser_api.get_trade_history': (string | number)[]
  'condenser_api.get_transaction': string[]
  'condenser_api.get_transaction_hex': ({
    ref_block_num: number
    ref_block_prefix: number
    expiration: string
    extensions: { type: string; value: string }[]
    signatures: string[]
  } & { operations: { type: string; value: {} }[] })[]
  'condenser_api.get_trending_tags': {
    start_tag?: string
    limit?: number
  }
  'condenser_api.get_version': []
  'condenser_api.get_vesting_delegations': (string | number | null)[]
  'condenser_api.get_volume': []
  'condenser_api.get_withdraw_routes': [string, string]
  'condenser_api.get_witness_by_account': string[]
  'condenser_api.get_witness_count': []
  'condenser_api.get_witness_schedule': []
  'condenser_api.get_witnesses': number[][]
  'condenser_api.get_witnesses_by_vote': (string | number | null)[]
  'condenser_api.is_known_transaction': string[]
  'condenser_api.list_proposal_votes': (string | number | null | unknown[])[]
  'condenser_api.list_proposals': (string | number | null | unknown[])[]
  'condenser_api.list_rc_accounts': (string | number)[]
  'condenser_api.list_rc_direct_delegations': (unknown[] | number)[]
  'condenser_api.lookup_account_names': (string[] | boolean)[]
  'condenser_api.lookup_accounts': (string | number)[]
  'condenser_api.lookup_witness_accounts': (string | number)[]
  'condenser_api.verify_authority': ({
    ref_block_num: number
    ref_block_prefix: number
    expiration: string
    extensions: { type: string; value: string }[]
    signatures: string[]
  } & { operations: { type: string; value: {} }[] })[]
  'database_api.find_account_recovery_requests': {
    accounts: string[]
  }
  'database_api.find_accounts': {
    accounts: string[]
    delayed_votes_active?: boolean
  }
  'database_api.find_change_recovery_account_requests': {
    accounts: string[]
  }
  'database_api.find_collateralized_conversion_requests': {
    account: string
  }
  'database_api.find_comments': {
    comments?: [string, string][]
  }
  'database_api.find_decline_voting_rights_requests': {
    accounts: string[]
  }
  'database_api.find_escrows': {
    from: string
  }
  'database_api.find_hbd_conversion_requests': {
    account: string
  }
  'database_api.find_limit_orders': {
    account: string
  }
  'database_api.find_owner_histories': {
    owner: string
  }
  'database_api.find_proposals': {
    proposal_ids: (string | number)[]
  }
  'database_api.find_recurrent_transfers': {
    from: string
  }
  'database_api.find_savings_withdrawals': {
    account: string
  }
  'database_api.find_vesting_delegation_expirations': {
    account: string
  }
  'database_api.find_vesting_delegations': {
    account: string
  }
  'database_api.find_votes': {
    author: string
    permlink: string
  }
  'database_api.find_withdraw_vesting_routes': {
    account: string
    order: string
  }
  'database_api.find_witnesses': {
    owners: string[]
  }
  'database_api.get_active_witnesses': []
  'database_api.get_comment_pending_payouts': {
    comments: string[][]
  }
  'database_api.get_config': []
  'database_api.get_current_price_feed': []
  'database_api.get_dynamic_global_properties': []
  'database_api.get_feed_history': []
  'database_api.get_hardfork_properties': []
  'database_api.get_order_book': {
    base: { amount: string | number; nai: string; precision: number }
    quote: { amount: string | number; nai: string; precision: number }
    limit: number
  }
  'database_api.get_potential_signatures': {
    trx: {
      ref_block_num: number
      ref_block_prefix: number
      expiration: string
      extensions: { type: string; value: string }[]
      signatures: string[]
    } & { operations: { type: string; value: {} }[] }
  }
  'database_api.get_required_signatures': {
    trx: {
      ref_block_num: number
      ref_block_prefix: number
      expiration: string
      extensions: { type: string; value: string }[]
      signatures: string[]
    } & { operations: { type: string; value: {} }[] }
  }
  'database_api.get_reward_funds': []
  'database_api.get_transaction_hex': {
    trx: {
      ref_block_num: number
      ref_block_prefix: number
      expiration: string
      extensions: { type: string; value: string }[]
      signatures: string[]
    } & { operations: { type: string; value: {} }[] }
  }
  'database_api.get_version': []
  'database_api.get_witness_schedule': []
  'database_api.is_known_transaction': {
    id: string
  }
  'database_api.list_account_recovery_requests': []
  'database_api.list_accounts': {
    start: {}
    limit: number
    order: string
    delayed_votes_active?: boolean
  }
  'database_api.list_change_recovery_account_requests': []
  'database_api.list_collateralized_conversion_requests': []
  'database_api.list_decline_voting_rights_requests': []
  'database_api.list_escrows': []
  'database_api.list_hbd_conversion_requests': []
  'database_api.list_limit_orders': []
  'database_api.list_owner_histories': []
  'database_api.list_proposal_votes': []
  'database_api.list_proposals': []
  'database_api.list_savings_withdrawals': []
  'database_api.list_vesting_delegation_expirations': []
  'database_api.list_vesting_delegations': []
  'database_api.list_votes': []
  'database_api.list_withdraw_vesting_routes': []
  'database_api.list_witness_votes': []
  'database_api.list_witnesses': []
  'database_api.verify_account_authority': {
    account: string
    signers: string[]
  }
  'database_api.verify_authority': {
    trx: {
      ref_block_num: number
      ref_block_prefix: number
      expiration: string
      extensions: { type: string; value: string }[]
      signatures: string[]
    } & { operations: { type: string; value: {} }[] }
    pack: string
  }
  'database_api.verify_signatures': {
    hash: string
    signatures: string[]
    required_owner: string[]
    required_active: string[]
    required_posting: string[]
    required_other: string[]
  }
  'debug_node_api.debug_generate_blocks': {
    debug_key: string
    count: number
    skip: number
    miss_blocks: number
  }
  'debug_node_api.debug_generate_blocks_until': {
    debug_key: string
    head_block_time: string
    generate_sparsely: boolean
  }
  'debug_node_api.debug_get_future_witness_schedule': []
  'debug_node_api.debug_get_hardfork_property_object': []
  'debug_node_api.debug_get_head_block': []
  'debug_node_api.debug_get_json_schema': []
  'debug_node_api.debug_get_witness_schedule': []
  'debug_node_api.debug_has_hardfork': {
    hardfork_id: number
  }
  'debug_node_api.debug_set_hardfork': {
    hardfork_id: number
    hook_to_tx?: string
  }
  'debug_node_api.debug_set_vest_price': {
    vest_price: {
      base: { amount: string | number; nai: string; precision: number }
      quote: unknown
    }
    hook_to_tx?: string
  }
  'debug_node_api.debug_throw_exception': {
    throw_exception: boolean
  }
  'follow_api.get_account_reputations': {
    account_lower_bound?: string
    limit?: number
  }
  'follow_api.get_blog': {
    account: string
    start_entry_id?: number
    limit?: number
    observer?: string
  }
  'follow_api.get_blog_entries': {
    account: string
    start_entry_id?: number
    limit?: number
    observer?: string
  }
  'follow_api.get_followers': {
    account: string
    start?: unknown
    type?: string
    limit?: number
  }
  'follow_api.get_following': {
    account: string
    start?: unknown
    type?: string
    limit?: number
  }
  'follow_api.get_follow_count': {
    account: string
  }
  'follow_api.get_reblogged_by': {
    author: string
    permlink: string
  }
  'jsonrpc.get_methods': []
  'jsonrpc.get_signature': {
    method: string
  }
  'hive.db_head_state': []
  'hive.get_info': []
  'market_history_api.get_market_history': {
    bucket_seconds: number
    start: string
    end: string
  }
  'market_history_api.get_market_history_buckets': []
  'market_history_api.get_order_book': {
    limit?: number
  }
  'market_history_api.get_recent_trades': {
    limit?: number
  }
  'market_history_api.get_ticker': []
  'market_history_api.get_trade_history': {
    start: string
    end: string
    limit?: number
  }
  'market_history_api.get_volume': []
  'network_broadcast_api.broadcast_transaction': {
    trx: {
      ref_block_num: number
      ref_block_prefix: number
      expiration: string
      extensions: { type: string; value: string }[]
      signatures: string[]
    } & { operations: { type: string; value: {} }[] }
    max_block_age: number
  }
  'rc_api.find_rc_accounts': {
    accounts: string[]
  }
  'rc_api.get_rc_operation_stats': {
    operation: string
  }
  'rc_api.get_rc_stats': []
  'rc_api.get_resource_params': []
  'rc_api.get_resource_pool': []
  'rc_api.list_rc_accounts': {
    start?: unknown
    limit: number
  }
  'rc_api.list_rc_direct_delegations': {
    start: string[]
    limit: number
  }
  'reputation_api.get_account_reputations': {
    account_lower_bound: string
    limit: number
  }
  'search-api.find_text': {
    pattern: string
    sort: string
    author?: string
    start_author?: string
    start_permlink?: string
    limit?: number
    observer?: string
    truncate_body?: number
  }
  'tags_api.get_comment_discussions_by_payout': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'tags_api.get_content_replies': {
    account: string
    permlink: string
    observer?: string
  }
  'tags_api.get_discussion': {
    account: string
    permlink: string
    observer?: string
  }
  'tags_api.get_discussions_by_author_before_date': {
    account: string
    start_permlink?: string
    before_date?: string
    limit?: number
    truncate_body?: number
    observer?: string
  }
  'tags_api.get_discussions_by_blog': {
    tag: string
    start_author?: string
    start_permlink?: string
    limit?: number
    truncate_body?: number
    observer?: string
  }
  'tags_api.get_discussions_by_comments': {
    start_author: string
    start_permlink?: string
    limit?: number
    truncate_body?: number
    observer?: string
  }
  'tags_api.get_discussions_by_created': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'tags_api.get_discussions_by_hot': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'tags_api.get_discussions_by_trending': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'tags_api.get_post_discussions_by_payout': {
    start_author?: string
    start_permlink?: string
    limit?: number
    tag?: string
    truncate_body?: number
    observer?: string
  }
  'transaction_status_api.find_transaction': {
    transaction_id: string
    expiration: string
  }
}
