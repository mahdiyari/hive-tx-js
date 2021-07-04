const PublicKey = require('./PublicKey')
const Asset = require('./asset')
const HexBuffer = require('./HexBuffer')
const config = require('../config')

const VoidSerializer = () => {
  throw new Error('Void can not be serialized')
}

const StringSerializer = (buffer, data) => {
  buffer.writeVString(data)
}

const Int8Serializer = (buffer, data) => {
  buffer.writeInt8(data)
}

const Int16Serializer = (buffer, data) => {
  buffer.writeInt16(data)
}

const Int32Serializer = (buffer, data) => {
  buffer.writeInt32(data)
}

const Int64Serializer = (buffer, data) => {
  buffer.writeInt64(data)
}

const UInt8Serializer = (buffer, data) => {
  buffer.writeUint8(data)
}

const UInt16Serializer = (buffer, data) => {
  buffer.writeUint16(data)
}

const UInt32Serializer = (buffer, data) => {
  buffer.writeUint32(data)
}

const UInt64Serializer = (buffer, data) => {
  buffer.writeUint64(data)
}

const BooleanSerializer = (buffer, data) => {
  buffer.writeByte(data ? 1 : 0)
}

const StaticVariantSerializer = (itemSerializers) => {
  return (buffer, data) => {
    const [id, item] = data
    buffer.writeVarint32(id)
    itemSerializers[id](buffer, item)
  }
}

/**
 * Serialize asset.
 * @note This looses precision for amounts larger than 2^53-1/10^precision.
 *       Should not be a problem in real-word usage.
 */
const AssetSerializer = (buffer, data) => {
  const asset = Asset.from(data)
  const precision = asset.getPrecision()
  buffer.writeInt64(Math.round(asset.amount * Math.pow(10, precision)))
  buffer.writeUint8(precision)
  for (let i = 0; i < 7; i++) {
    buffer.writeUint8(asset.symbol.charCodeAt(i) || 0)
  }
}

const DateSerializer = (buffer, data) => {
  buffer.writeUint32(Math.floor(new Date(data + 'Z').getTime() / 1000))
}

const PublicKeySerializer = (buffer, data) => {
  if (
    data === null ||
    (typeof data === 'string' &&
      data.slice(-39) === '1111111111111111111111111111111114T1Anm')
  ) {
    buffer.append(Buffer.alloc(33, 0))
  } else {
    buffer.append(PublicKey.from(data).key)
  }
}

const BinarySerializer = (size = null) => {
  return (buffer, data) => {
    data = HexBuffer.from(data)
    const len = data.buffer.length
    if (size) {
      if (len !== size) {
        throw new Error(
          `Unable to serialize binary. Expected ${size} bytes, got ${len}`
        )
      }
    } else {
      buffer.writeVarint32(len)
    }
    buffer.append(data.buffer)
  }
}

const VariableBinarySerializer = BinarySerializer()

const FlatMapSerializer = (keySerializer, valueSerializer) => {
  return (buffer, data) => {
    buffer.writeVarint32(data.length)
    for (const [key, value] of data) {
      keySerializer(buffer, key)
      valueSerializer(buffer, value)
    }
  }
}

const ArraySerializer = (itemSerializer) => {
  return (buffer, data) => {
    buffer.writeVarint32(data.length)
    for (const item of data) {
      itemSerializer(buffer, item)
    }
  }
}

const ObjectSerializer = (keySerializers) => {
  return (buffer, data) => {
    for (const [key, serializer] of keySerializers) {
      try {
        serializer(buffer, data[key])
      } catch (error) {
        error.message = `${key}: ${error.message}`
        throw error
      }
    }
  }
}

const OptionalSerializer = (valueSerializer) => {
  return (buffer, data) => {
    if (data !== undefined) {
      buffer.writeByte(1)
      valueSerializer(buffer, data)
    } else {
      buffer.writeByte(0)
    }
  }
}

const AuthoritySerializer = ObjectSerializer([
  ['weight_threshold', UInt32Serializer],
  ['account_auths', FlatMapSerializer(StringSerializer, UInt16Serializer)],
  ['key_auths', FlatMapSerializer(PublicKeySerializer, UInt16Serializer)]
])

const BeneficiarySerializer = ObjectSerializer([
  ['account', StringSerializer],
  ['weight', UInt16Serializer]
])

const PriceSerializer = ObjectSerializer([
  ['base', AssetSerializer],
  ['quote', AssetSerializer]
])

const SignedBlockHeaderSerializer = ObjectSerializer([
  ['previous', BinarySerializer(20)],
  ['timestamp', DateSerializer],
  ['witness', StringSerializer],
  ['transaction_merkle_root', BinarySerializer(20)],
  ['extensions', ArraySerializer(VoidSerializer)],
  ['witness_signature', BinarySerializer(65)]
])

const ChainPropertiesSerializer = ObjectSerializer([
  ['account_creation_fee', AssetSerializer],
  ['maximum_block_size', UInt32Serializer],
  ['hbd_interest_rate', UInt16Serializer]
])

const OperationDataSerializer = (operationId, definitions) => {
  const objectSerializer = ObjectSerializer(definitions)
  return (buffer, data) => {
    buffer.writeVarint32(operationId)
    objectSerializer(buffer, data)
  }
}

const OperationSerializers = {}

OperationSerializers.account_create = OperationDataSerializer(9, [
  ['fee', AssetSerializer],
  ['creator', StringSerializer],
  ['new_account_name', StringSerializer],
  ['owner', AuthoritySerializer],
  ['active', AuthoritySerializer],
  ['posting', AuthoritySerializer],
  ['memo_key', PublicKeySerializer],
  ['json_metadata', StringSerializer]
])

OperationSerializers.account_create_with_delegation = OperationDataSerializer(
  41,
  [
    ['fee', AssetSerializer],
    ['delegation', AssetSerializer],
    ['creator', StringSerializer],
    ['new_account_name', StringSerializer],
    ['owner', AuthoritySerializer],
    ['active', AuthoritySerializer],
    ['posting', AuthoritySerializer],
    ['memo_key', PublicKeySerializer],
    ['json_metadata', StringSerializer],
    ['extensions', ArraySerializer(VoidSerializer)]
  ]
)

OperationSerializers.account_update = OperationDataSerializer(10, [
  ['account', StringSerializer],
  ['owner', OptionalSerializer(AuthoritySerializer)],
  ['active', OptionalSerializer(AuthoritySerializer)],
  ['posting', OptionalSerializer(AuthoritySerializer)],
  ['memo_key', PublicKeySerializer],
  ['json_metadata', StringSerializer]
])

OperationSerializers.account_witness_proxy = OperationDataSerializer(13, [
  ['account', StringSerializer],
  ['proxy', StringSerializer]
])

OperationSerializers.account_witness_vote = OperationDataSerializer(12, [
  ['account', StringSerializer],
  ['witness', StringSerializer],
  ['approve', BooleanSerializer]
])

OperationSerializers.cancel_transfer_from_savings = OperationDataSerializer(
  34,
  [
    ['from', StringSerializer],
    ['request_id', UInt32Serializer]
  ]
)

OperationSerializers.change_recovery_account = OperationDataSerializer(26, [
  ['account_to_recover', StringSerializer],
  ['new_recovery_account', StringSerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.claim_account = OperationDataSerializer(22, [
  ['creator', StringSerializer],
  ['fee', AssetSerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.claim_reward_balance = OperationDataSerializer(39, [
  ['account', StringSerializer],
  ['reward_hive', AssetSerializer],
  ['reward_hbd', AssetSerializer],
  ['reward_vests', AssetSerializer]
])

OperationSerializers.comment = OperationDataSerializer(1, [
  ['parent_author', StringSerializer],
  ['parent_permlink', StringSerializer],
  ['author', StringSerializer],
  ['permlink', StringSerializer],
  ['title', StringSerializer],
  ['body', StringSerializer],
  ['json_metadata', StringSerializer]
])

OperationSerializers.comment_options = OperationDataSerializer(19, [
  ['author', StringSerializer],
  ['permlink', StringSerializer],
  ['max_accepted_payout', AssetSerializer],
  ['percent_hbd', UInt16Serializer],
  ['allow_votes', BooleanSerializer],
  ['allow_curation_rewards', BooleanSerializer],
  [
    'extensions',
    ArraySerializer(
      StaticVariantSerializer([
        ObjectSerializer([
          ['beneficiaries', ArraySerializer(BeneficiarySerializer)]
        ])
      ])
    )
  ]
])

OperationSerializers.convert = OperationDataSerializer(8, [
  ['owner', StringSerializer],
  ['requestid', UInt32Serializer],
  ['amount', AssetSerializer]
])

OperationSerializers.create_claimed_account = OperationDataSerializer(23, [
  ['creator', StringSerializer],
  ['new_account_name', StringSerializer],
  ['owner', AuthoritySerializer],
  ['active', AuthoritySerializer],
  ['posting', AuthoritySerializer],
  ['memo_key', PublicKeySerializer],
  ['json_metadata', StringSerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.custom = OperationDataSerializer(15, [
  ['required_auths', ArraySerializer(StringSerializer)],
  ['id', UInt16Serializer],
  ['data', VariableBinarySerializer]
])

OperationSerializers.custom_binary = OperationDataSerializer(35, [
  ['required_owner_auths', ArraySerializer(StringSerializer)],
  ['required_active_auths', ArraySerializer(StringSerializer)],
  ['required_posting_auths', ArraySerializer(StringSerializer)],
  ['required_auths', ArraySerializer(AuthoritySerializer)],
  ['id', StringSerializer],
  ['data', VariableBinarySerializer]
])

OperationSerializers.custom_json = OperationDataSerializer(18, [
  ['required_auths', ArraySerializer(StringSerializer)],
  ['required_posting_auths', ArraySerializer(StringSerializer)],
  ['id', StringSerializer],
  ['json', StringSerializer]
])

OperationSerializers.decline_voting_rights = OperationDataSerializer(36, [
  ['account', StringSerializer],
  ['decline', BooleanSerializer]
])

OperationSerializers.delegate_vesting_shares = OperationDataSerializer(40, [
  ['delegator', StringSerializer],
  ['delegatee', StringSerializer],
  ['vesting_shares', AssetSerializer]
])

OperationSerializers.delete_comment = OperationDataSerializer(17, [
  ['author', StringSerializer],
  ['permlink', StringSerializer]
])

OperationSerializers.escrow_approve = OperationDataSerializer(31, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['agent', StringSerializer],
  ['who', StringSerializer],
  ['escrow_id', UInt32Serializer],
  ['approve', BooleanSerializer]
])

OperationSerializers.escrow_dispute = OperationDataSerializer(28, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['agent', StringSerializer],
  ['who', StringSerializer],
  ['escrow_id', UInt32Serializer]
])

OperationSerializers.escrow_release = OperationDataSerializer(29, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['agent', StringSerializer],
  ['who', StringSerializer],
  ['receiver', StringSerializer],
  ['escrow_id', UInt32Serializer],
  ['hbd_amount', AssetSerializer],
  ['hive_amount', AssetSerializer]
])

OperationSerializers.escrow_transfer = OperationDataSerializer(27, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['agent', StringSerializer],
  ['escrow_id', UInt32Serializer],
  ['hbd_amount', AssetSerializer],
  ['hive_amount', AssetSerializer],
  ['fee', AssetSerializer],
  ['ratification_deadline', DateSerializer],
  ['escrow_expiration', DateSerializer],
  ['json_meta', StringSerializer]
])

OperationSerializers.feed_publish = OperationDataSerializer(7, [
  ['publisher', StringSerializer],
  ['exchange_rate', PriceSerializer]
])

OperationSerializers.limit_order_cancel = OperationDataSerializer(6, [
  ['owner', StringSerializer],
  ['orderid', UInt32Serializer]
])

OperationSerializers.limit_order_create = OperationDataSerializer(5, [
  ['owner', StringSerializer],
  ['orderid', UInt32Serializer],
  ['amount_to_sell', AssetSerializer],
  ['min_to_receive', AssetSerializer],
  ['fill_or_kill', BooleanSerializer],
  ['expiration', DateSerializer]
])

OperationSerializers.limit_order_create2 = OperationDataSerializer(21, [
  ['owner', StringSerializer],
  ['orderid', UInt32Serializer],
  ['amount_to_sell', AssetSerializer],
  ['fill_or_kill', BooleanSerializer],
  ['exchange_rate', PriceSerializer],
  ['expiration', DateSerializer]
])

OperationSerializers.recover_account = OperationDataSerializer(25, [
  ['account_to_recover', StringSerializer],
  ['new_owner_authority', AuthoritySerializer],
  ['recent_owner_authority', AuthoritySerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.report_over_production = OperationDataSerializer(16, [
  ['reporter', StringSerializer],
  ['first_block', SignedBlockHeaderSerializer],
  ['second_block', SignedBlockHeaderSerializer]
])

OperationSerializers.request_account_recovery = OperationDataSerializer(24, [
  ['recovery_account', StringSerializer],
  ['account_to_recover', StringSerializer],
  ['new_owner_authority', AuthoritySerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.reset_account = OperationDataSerializer(37, [
  ['reset_account', StringSerializer],
  ['account_to_reset', StringSerializer],
  ['new_owner_authority', AuthoritySerializer]
])

OperationSerializers.set_reset_account = OperationDataSerializer(38, [
  ['account', StringSerializer],
  ['current_reset_account', StringSerializer],
  ['reset_account', StringSerializer]
])

OperationSerializers.set_withdraw_vesting_route = OperationDataSerializer(20, [
  ['from_account', StringSerializer],
  ['to_account', StringSerializer],
  ['percent', UInt16Serializer],
  ['auto_vest', BooleanSerializer]
])

OperationSerializers.transfer = OperationDataSerializer(2, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['amount', AssetSerializer],
  ['memo', StringSerializer]
])

OperationSerializers.transfer_from_savings = OperationDataSerializer(33, [
  ['from', StringSerializer],
  ['request_id', UInt32Serializer],
  ['to', StringSerializer],
  ['amount', AssetSerializer],
  ['memo', StringSerializer]
])

OperationSerializers.transfer_to_savings = OperationDataSerializer(32, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['amount', AssetSerializer],
  ['memo', StringSerializer]
])

OperationSerializers.transfer_to_vesting = OperationDataSerializer(3, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['amount', AssetSerializer]
])

OperationSerializers.vote = OperationDataSerializer(0, [
  ['voter', StringSerializer],
  ['author', StringSerializer],
  ['permlink', StringSerializer],
  ['weight', Int16Serializer]
])

OperationSerializers.withdraw_vesting = OperationDataSerializer(4, [
  ['account', StringSerializer],
  ['vesting_shares', AssetSerializer]
])

OperationSerializers.witness_update = OperationDataSerializer(11, [
  ['owner', StringSerializer],
  ['url', StringSerializer],
  ['block_signing_key', PublicKeySerializer],
  ['props', ChainPropertiesSerializer],
  ['fee', AssetSerializer]
])

OperationSerializers.witness_set_properties = OperationDataSerializer(42, [
  ['owner', StringSerializer],
  ['props', FlatMapSerializer(StringSerializer, VariableBinarySerializer)],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.account_update2 = OperationDataSerializer(43, [
  ['account', StringSerializer],
  ['owner', OptionalSerializer(AuthoritySerializer)],
  ['active', OptionalSerializer(AuthoritySerializer)],
  ['posting', OptionalSerializer(AuthoritySerializer)],
  ['memo_key', OptionalSerializer(PublicKeySerializer)],
  ['json_metadata', StringSerializer],
  ['posting_json_metadata', StringSerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.create_proposal = OperationDataSerializer(44, [
  ['creator', StringSerializer],
  ['receiver', StringSerializer],
  ['start_date', DateSerializer],
  ['end_date', DateSerializer],
  ['daily_pay', AssetSerializer],
  ['subject', StringSerializer],
  ['permlink', StringSerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.update_proposal_votes = OperationDataSerializer(45, [
  ['voter', StringSerializer],
  ['proposal_ids', ArraySerializer(Int64Serializer)],
  ['approve', BooleanSerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.remove_proposal = OperationDataSerializer(46, [
  ['proposal_owner', StringSerializer],
  ['proposal_ids', ArraySerializer(Int64Serializer)],
  ['extensions', ArraySerializer(VoidSerializer)]
])

const ProposalUpdateSerializer = ObjectSerializer([
  ['end_date', DateSerializer]
])

OperationSerializers.update_proposal = OperationDataSerializer(47, [
  ['proposal_id', UInt64Serializer],
  ['creator', StringSerializer],
  ['daily_pay', AssetSerializer],
  ['subject', StringSerializer],
  ['permlink', StringSerializer],
  [
    'extensions',
    ArraySerializer(
      StaticVariantSerializer([VoidSerializer, ProposalUpdateSerializer])
    )
  ]
])

OperationSerializers.collateralized_convert = OperationDataSerializer(48, [
  ['owner', StringSerializer],
  ['requestid', UInt32Serializer],
  ['amount', AssetSerializer]
])

OperationSerializers.recurrent_transfer = OperationDataSerializer(49, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['amount', AssetSerializer],
  ['memo', StringSerializer],
  ['recurrence', UInt16Serializer],
  ['executions', UInt16Serializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

const OperationSerializer = (buffer, operation) => {
  const serializer = OperationSerializers[operation[0]]
  if (!serializer) {
    throw new Error(`No serializer for operation: ${operation[0]}`)
  }
  try {
    serializer(buffer, operation[1])
  } catch (error) {
    error.message = `${operation[0]}: ${error.message}`
    throw error
  }
}

const TransactionSerializer = ObjectSerializer([
  ['ref_block_num', UInt16Serializer],
  ['ref_block_prefix', UInt32Serializer],
  ['expiration', DateSerializer],
  ['operations', ArraySerializer(OperationSerializer)],
  ['extensions', ArraySerializer(StringSerializer)]
])

const Types = {
  Array: ArraySerializer,
  Asset: AssetSerializer,
  Authority: AuthoritySerializer,
  Binary: BinarySerializer,
  Boolean: BooleanSerializer,
  Date: DateSerializer,
  FlatMap: FlatMapSerializer,
  Int16: Int16Serializer,
  Int32: Int32Serializer,
  Int64: Int64Serializer,
  Int8: Int8Serializer,
  Object: ObjectSerializer,
  Operation: OperationSerializer,
  Optional: OptionalSerializer,
  Price: PriceSerializer,
  PublicKey: PublicKeySerializer,
  StaticVariant: StaticVariantSerializer,
  String: StringSerializer,
  Transaction: TransactionSerializer,
  UInt16: UInt16Serializer,
  UInt32: UInt32Serializer,
  UInt64: UInt64Serializer,
  UInt8: UInt8Serializer,
  Void: VoidSerializer
}

module.exports = Types
