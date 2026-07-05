// ─── Contract Addresses ───────────────────────────────────────────────────────
export const FBMXDAO_ADDRESS_OLD = '0xf70bbb99E75999A3eE3f137F2701AFf82225519C'
export const FBMXDAO_ADDRESS = '0x47dB8adb635BA0145ff553201397071d6e998dC3'
export const FBMXSTAKING_ADDRESS = '0x50595069595D523211653e8DbECe85a09897bC6B'
export const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'
export const FBMX_ADDRESS = '0x5951F937ff590239D38c10e871F9982359E56C36'
export const PANCAKE_V3_POOL = '0x200410102224189d502e33a1691f13f1b872755a'
export const PANCAKE_V3_ROUTER = '0x1b81D678ffb9C0263b24A97847620C99d213eB14'

// ─── ERC20 ABI ────────────────────────────────────────────────────────────────
export const ERC20_ABI = [
  {
    name: 'approve', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ type: 'bool' }]
  },
  {
    name: 'allowance', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'balanceOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }]
  },
  {
    name: 'decimals', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint8' }]
  },
  {
    name: 'symbol', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'string' }]
  },
]

// ─── FBMXDAO ABI ──────────────────────────────────────────────────────────────
export const FBMXDAO_ABI = [
  // register(address _referrer, uint8 _group)
  // _group: 0=left open node, 1=right open node, 2+=less (auto) node
  {
    name: 'register', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_referrer', type: 'address' }, { name: '_group', type: 'uint8' }],
    outputs: []
  },

  // depositUSDT(uint8 targetLevel) — 0 = normal sequential; >0 = jump to targetLevel (first activation only)
  {
    name: 'depositUSDT', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'targetLevel', type: 'uint8' }], outputs: []
  },

  // depositFBMX(uint256 _amount) — deposits FBMX into tokenBalance
  {
    name: 'depositFBMX', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_amount', type: 'uint256' }], outputs: []
  },

  // activateRank() — upgrade membership; deducts from wallet.balance
  {
    name: 'activateRank', type: 'function', stateMutability: 'nonpayable',
    inputs: [], outputs: []
  },

  // collectPassiveRewards() — 24h cooldown; burns minTransaction FBMX
  {
    name: 'collectPassiveRewards', type: 'function', stateMutability: 'nonpayable',
    inputs: [], outputs: []
  },

  // collectBinaryRewards() — 24h cooldown; burns minTransaction FBMX
  {
    name: 'collectBinaryRewards', type: 'function', stateMutability: 'nonpayable',
    inputs: [], outputs: []
  },

  // withdrawBalance(uint256 _amount) — _amount must be a valid tier
  // Tiers: 15e18 (lvl>=1), 50e18 (lvl>=4), 100e18 (lvl>=7), 500e18 (lvl>=10), 1000e18 (lvl>=13)
  {
    name: 'withdrawBalance', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_amount', type: 'uint256' }], outputs: []
  },

  // ── View ──
  {
    name: 'getChildren', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address' }, { name: '_startIndex', type: 'uint256' }, { name: '_count', type: 'uint256' }],
    outputs: [{ name: 'childrenBatch', type: 'address[]' }]
  },

  {
    name: 'getPassiveReward', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address' }], outputs: [{ type: 'uint256' }]
  },

  {
    name: 'getPercentage', type: 'function', stateMutability: 'pure',
    inputs: [{ name: '_passiveEquity', type: 'uint256' }, { name: '_referralIncome', type: 'uint256' }],
    outputs: [{ type: 'uint256' }]
  },

  {
    name: 'getEquity', type: 'function', stateMutability: 'pure',
    inputs: [{ name: '_totalEquity', type: 'uint256' }, { name: '_totalIncome', type: 'uint256' }],
    outputs: [{ type: 'uint256' }]
  },

  {
    name: 'getUpgradeAmount', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address' }], outputs: [{ type: 'uint256' }]
  },

  {
    name: 'getPlacement', type: 'function', stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address' }, { name: '_options', type: 'uint8' }],
    outputs: [{ name: '_address', type: 'address' }, { name: '_position', type: 'bool' }]
  },

  {
    name: 'getWithdrawAmount', type: 'function', stateMutability: 'pure',
    inputs: [{ name: '_userLevel', type: 'uint8' }, { name: '_amount', type: 'uint256' }],
    outputs: [{ type: 'uint256' }]
  },

  {
    name: 'getContractStats', type: 'function', stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '_totalUsers', type: 'uint256' },
      { name: '_totalUSDT', type: 'uint256' },
      { name: '_totalFBMX', type: 'uint256' },
      { name: '_totalDeposits', type: 'uint256' },
      { name: '_totalRewards', type: 'uint256' },
      { name: '_totalWithdrawals', type: 'uint256' },
      { name: '_totalMarketingFunding', type: 'uint256' },
      { name: '_totalProjectFunding', type: 'uint256' },
      { name: '_totalLiquidityFunding', type: 'uint256' },
    ]
  },

  // ── Mapping getters ──
  {
    name: 'affiliates', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [
      { name: 'parent', type: 'address' },
      { name: 'agent', type: 'address' },
      { name: 'totalDirect', type: 'uint256' },
      { name: 'level', type: 'uint8' },
    ]
  },

  {
    name: 'binaries', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [
      { name: 'parent', type: 'address' },
      { name: 'leftAddress', type: 'address' },
      { name: 'rightAddress', type: 'address' },
      { name: 'leftVolume', type: 'uint256' },
      { name: 'rightVolume', type: 'uint256' },
      { name: 'coolDown', type: 'uint256' },
    ]
  },

  {
    name: 'wallets', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [
      { name: 'balance', type: 'uint256' },
      { name: 'capping', type: 'uint256' },
      { name: 'totalIncome', type: 'uint256' },
      { name: 'coolDown', type: 'uint256' },
    ]
  },

  {
    name: 'passives', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [
      { name: 'totalPassive', type: 'uint256' },
      { name: 'totalEquity', type: 'uint256' },
      { name: 'coolDown', type: 'uint256' },
    ]
  },

  {
    name: 'lastCallTime', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ type: 'uint256' }]
  },

  {
    name: 'tokenBalance', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ type: 'uint256' }]
  },

  {
    name: 'isUser', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ type: 'bool' }]
  },

  // V2 — first-activation flag
  {
    name: 'hasActivated', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }], outputs: [{ type: 'bool' }]
  },

  // V2 — configurable anti-spam cooldown (seconds); falls back to COOLDOWN_TX_DEFAULT if call fails
  {
    name: 'transactionCooldown', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }]
  },
]

// ─── PancakeSwap V3 ───────────────────────────────────────────────────────────
export const PANCAKE_V3_POOL_ABI = [
  {
    name: 'slot0', type: 'function', stateMutability: 'view', inputs: [],
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160' }, { name: 'tick', type: 'int24' },
      { name: 'observationIndex', type: 'uint16' }, { name: 'observationCardinality', type: 'uint16' },
      { name: 'observationCardinalityNext', type: 'uint16' }, { name: 'feeProtocol', type: 'uint8' },
      { name: 'unlocked', type: 'bool' },
    ]
  },
  { name: 'fee', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint24' }] },
  { name: 'liquidity', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint128' }] },
]

export const PANCAKE_V3_ROUTER_ABI = [
  {
    name: 'exactInputSingle', type: 'function', stateMutability: 'payable',
    inputs: [{
      name: 'params', type: 'tuple', components: [
        { name: 'tokenIn', type: 'address' },
        { name: 'tokenOut', type: 'address' },
        { name: 'fee', type: 'uint24' },
        { name: 'recipient', type: 'address' },
        { name: 'deadline', type: 'uint256' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'amountOutMinimum', type: 'uint256' },
        { name: 'sqrtPriceLimitX96', type: 'uint160' },
      ]
    }],
    outputs: [{ name: 'amountOut', type: 'uint256' }]
  },
]

// ─── Domain constants ─────────────────────────────────────────────────────────

// Withdraw tiers — amount (in wei) and minimum level required
export const WITHDRAW_TIERS = [
  { label: '$15', amount: 15n * 10n ** 18n, minLevel: 1 },
  { label: '$50', amount: 50n * 10n ** 18n, minLevel: 4 },
  { label: '$100', amount: 100n * 10n ** 18n, minLevel: 7 },
  { label: '$500', amount: 500n * 10n ** 18n, minLevel: 10 },
  { label: '$1000', amount: 1000n * 10n ** 18n, minLevel: 13 },
]

// Upgrade cost = 5 USDT × 2^level
export const ENTRY_FEE = 5n * 10n ** 18n

// FBMX fee burned on each collect/withdraw
export const MIN_FBMX_REQUIRED = 5n * 10n ** 16n   // 0.05 FBMX

export const MAX_RANK = 15
// Contract `maxRank = 14`: calculateCumulativeCost() reverts for targetLevel > 14,
// so a one-tx jump deposit can only target levels 1–14. Level 15 (Emperor) is
// reachable only via sequential re-ups. The Activate level picker caps at this value.
export const MAX_JUMP_LEVEL = 14
export const COOLDOWN_24H = 86400
export const COOLDOWN_TX_DEFAULT = 6   // fallback if transactionCooldown() read fails (pre-deployment)

// ─── Admin / Migration ABI ────────────────────────────────────────────────────
export const ADMIN_ABI = [
  // updateAffiliateData(address _user, address _parent, address _agent, uint256 _totalDirect, uint8 _level, bool _isUser, bool _hasActivated)
  {
    name: 'updateAffiliateData',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_user', type: 'address' },
      { name: '_parent', type: 'address' },
      { name: '_agent', type: 'address' },
      { name: '_totalDirect', type: 'uint256' },
      { name: '_level', type: 'uint8' },
      { name: '_isUser', type: 'bool' },
      { name: '_hasActivated', type: 'bool' },
    ],
    outputs: [],
  },

  // updateBinaryData(address _user, address _parent, address _leftAddress, address _rightAddress, uint256 _leftVolume, uint256 _rightVolume, uint256 _coolDown)
  {
    name: 'updateBinaryData',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_user', type: 'address' },
      { name: '_parent', type: 'address' },
      { name: '_leftAddress', type: 'address' },
      { name: '_rightAddress', type: 'address' },
      { name: '_leftVolume', type: 'uint256' },
      { name: '_rightVolume', type: 'uint256' },
      { name: '_coolDown', type: 'uint256' },
    ],
    outputs: [],
  },

  // updateWalletData(address _user, uint256 _balance, uint256 _capping, uint256 _totalIncome, uint256 _coolDown, uint256 _tokenBalance)
  {
    name: 'updateWalletData',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_user', type: 'address' },
      { name: '_balance', type: 'uint256' },
      { name: '_capping', type: 'uint256' },
      { name: '_totalIncome', type: 'uint256' },
      { name: '_coolDown', type: 'uint256' },
      { name: '_tokenBalance', type: 'uint256' },
    ],
    outputs: [],
  },

  // updatePassiveData(address _user, uint256 _totalPassive, uint256 _totalEquity, uint256 _coolDown)
  {
    name: 'updatePassiveData',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_user', type: 'address' },
      { name: '_totalPassive', type: 'uint256' },
      { name: '_totalEquity', type: 'uint256' },
      { name: '_coolDown', type: 'uint256' },
    ],
    outputs: [],
  },

  // owner() view returns (address)
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
]

// Approximate BSC block at time of old contract deployment (used to limit log range)
export const DEPLOY_BLOCK_HINT = 44000000n

// ─── Loyalty Rewards Contract ─────────────────────────────────────────────────
export const LOYALTY_REWARDS_ADDRESS = '0x5D3EB7B111f60EAfD05Fa97318a03B858c34D487'

export const LOYALTY_REWARDS_ABI = [
  // ── Write ──────────────────────────────────────────────────────────────────

  // claimReward() — verify rank ≥ 7 + 8% passive rate → create pending record
  { name: 'claimReward', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },

  // collectReward(uint8) — 48h cooldown after claim → transfer USDT to caller
  {
    name: 'collectReward', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'rank', type: 'uint8' }], outputs: [],
  },

  // fundLiquidity(uint256) — onlyOwner, requires prior USDT approve
  {
    name: 'fundLiquidity', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }], outputs: [],
  },

  // withdrawFunds(uint256) — emergency drain, onlyOwner
  {
    name: 'withdrawFunds', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }], outputs: [],
  },

  // setRankReward(uint8, uint256) — onlyOwner, sets reward per rank
  {
    name: 'setRankReward', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'rank', type: 'uint8' }, { name: 'amount', type: 'uint256' }], outputs: [],
  },

  // setCollectCooldown(uint256) — onlyOwner, sets cooldown period
  {
    name: 'setCollectCooldown', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: '_cooldown', type: 'uint256' }], outputs: [],
  },

  // transferOwnership(address) — onlyOwner
  {
    name: 'transferOwnership', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'newOwner', type: 'address' }], outputs: [],
  },

  // ── View ───────────────────────────────────────────────────────────────────

  // loyaltyRecords(address, uint8) → (amount, timestamp, rank, claimed)
  {
    name: 'loyaltyRecords', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'wallet', type: 'address' }, { name: 'rank', type: 'uint8' }],
    outputs: [
      { name: 'amount',    type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'rank',      type: 'uint8'   },
      { name: 'claimed',   type: 'bool'    },
    ],
  },

  // getAllQualified() → [{wallet, rank}] — onlyOwner
  {
    name: 'getAllQualified', type: 'function', stateMutability: 'view',
    inputs: [],
    outputs: [{
      name: '', type: 'tuple[]',
      components: [{ name: 'wallet', type: 'address' }, { name: 'rank', type: 'uint8' }],
    }],
  },

  // getLoyaltyRecord(address, uint8) → full record
  {
    name: 'getLoyaltyRecord', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'wallet', type: 'address' }, { name: 'rank', type: 'uint8' }],
    outputs: [
      { name: 'rank',      type: 'uint8'   },
      { name: 'amount',    type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'claimed',   type: 'bool'    },
    ],
  },

  // contractBalance() → uint256 — USDT held by this contract
  {
    name: 'contractBalance', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ name: '', type: 'uint256' }],
  },

  // COLLECT_COOLDOWN() → uint256 — 48 hours in seconds (172800)
  {
    name: 'COLLECT_COOLDOWN', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ name: '', type: 'uint256' }],
  },

  // ── Audit & Stats ──────────────────────────────────────────────────────────

  // getAuditStats() → full liquidity audit
  {
    name: 'getAuditStats', type: 'function', stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'balance',                type: 'uint256' },
      { name: 'totalPendingObligations', type: 'uint256' },
      { name: 'totalAlreadyClaimed',    type: 'uint256' },
      { name: 'qualifiedWalletCount',   type: 'uint256' },
      { name: 'pendingCount',           type: 'uint256' },
      { name: 'collectedCount',         type: 'uint256' },
      { name: 'surplusOrDeficit',       type: 'int256'  },
    ],
  },

  // checkLiquiditySufficiency() → (isSufficient, shortfallOrSurplus)
  {
    name: 'checkLiquiditySufficiency', type: 'function', stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'isSufficient',      type: 'bool'    },
      { name: 'shortfallOrSurplus', type: 'uint256' },
    ],
  },

  // getObligationsByRank(uint8) → (pendingCount, pendingAmount)
  {
    name: 'getObligationsByRank', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'rank', type: 'uint8' }],
    outputs: [
      { name: 'pendingCount',  type: 'uint256' },
      { name: 'pendingAmount', type: 'uint256' },
    ],
  },

  // getTotalQualifiedCount() → uint256
  {
    name: 'getTotalQualifiedCount', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ name: '', type: 'uint256' }],
  },

  // getQualifiedPaginated(uint256, uint256) → entries[], hasMore
  {
    name: 'getQualifiedPaginated', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'startIdx', type: 'uint256' }, { name: 'pageSize', type: 'uint256' }],
    outputs: [
      {
        name: 'entries', type: 'tuple[]',
        components: [{ name: 'wallet', type: 'address' }, { name: 'rank', type: 'uint8' }],
      },
      { name: 'hasMore', type: 'bool' },
    ],
  },

  // getPendingClaimsCount() → uint256
  {
    name: 'getPendingClaimsCount', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ name: '', type: 'uint256' }],
  },

  // getTotalPendingObligations() → uint256
  {
    name: 'getTotalPendingObligations', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ name: '', type: 'uint256' }],
  },

  { name: 'owner', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'address' }] },

  // ── Events ─────────────────────────────────────────────────────────────────

  {
    name: 'RewardPending', type: 'event',
    inputs: [
      { name: 'wallet',    type: 'address', indexed: true  },
      { name: 'rank',      type: 'uint8',   indexed: false },
      { name: 'amount',    type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'RewardClaimed', type: 'event',
    inputs: [
      { name: 'wallet',    type: 'address', indexed: true  },
      { name: 'rank',      type: 'uint8',   indexed: false },
      { name: 'amount',    type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'LiquidityFunded', type: 'event',
    inputs: [
      { name: 'funder', type: 'address', indexed: true  },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'FundsWithdrawn', type: 'event',
    inputs: [
      { name: 'recipient', type: 'address', indexed: true },
      { name: 'amount',    type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'RankRewardUpdated', type: 'event',
    inputs: [
      { name: 'rank',     type: 'uint8',   indexed: true  },
      { name: 'newAmount', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'CooldownUpdated', type: 'event',
    inputs: [
      { name: 'newCooldown', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'OwnershipTransferred', type: 'event',
    inputs: [
      { name: 'previousOwner', type: 'address', indexed: true },
      { name: 'newOwner',      type: 'address', indexed: true },
    ],
  },
]

// ─── FBMXStaking ABI ──────────────────────────────────────────────────────────
export const FBMXSTAKING_ABI = [
  // stake(uint256 amount, uint256 lockDays) — lockDays: 7 | 30 | 60 | 90
  { name: 'stake', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }, { name: 'lockDays', type: 'uint256' }],
    outputs: [] },

  // withdraw(uint256 stakeIndex)
  { name: 'withdraw', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'stakeIndex', type: 'uint256' }], outputs: [] },

  // getUserStakes(address) → Stake[]
  { name: 'getUserStakes', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'tuple[]', components: [
      { name: 'amount',     type: 'uint256' },
      { name: 'reward',     type: 'uint256' },
      { name: 'unlockTime', type: 'uint256' },
      { name: 'withdrawn',  type: 'bool'    },
    ]}] },

  // getUserStakeCount(address) → uint256
  { name: 'getUserStakeCount', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }] },

  // availableRewards() → uint256  (contract balance − liabilities)
  { name: 'availableRewards', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }] },

  // totalStaked() → uint256
  { name: 'totalStaked', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }] },

  // totalAllocatedRewards() → uint256
  { name: 'totalAllocatedRewards', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }] },
]
