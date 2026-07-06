# CLAUDE.md — fbmxsocial

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Project:** `fbmxsocial` — a minimal variant forked from the `fbmxdao` dApp. Architecture below
is inherited from fbmxdao; contract constants (e.g. `FBMXDAO_ADDRESS`) are code identifiers and
remain unchanged.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # Production build (outputs to dist/)
npm run preview  # Serve the production build locally
npm run deploy   # npm run build → gh-pages -d dist --cname customdomain.com (publishes to GitHub Pages and custom domain)
```

No lint or test scripts exist. There is no TypeScript compilation step — JSX files are processed directly by Vite.

**Vite base path:** controlled by `VITE_BASE_URL` env var (defaults to `/`). Set to `/homev2/` for the GitHub Pages deployment at `fbmxusdt.github.io/homev2/`.

---

## Architecture

React 19 + Wagmi v2 + Viem dApp targeting **BSC mainnet (chain ID 56)**. All contract config is in `src/config/contracts.js` — never hardcode addresses or ABIs elsewhere.

**Wagmi config** (`src/config/wagmi.js`): RPC is hardcoded to `bsc-dataseed1.binance.org`. Connectors: injected (MetaMask etc.), WalletConnect (project ID hardcoded), Coinbase Wallet. `BSC_CHAIN_ID` is exported from this file — import it for chain checks rather than using the literal `56`.

**Vite browser shims** (in `vite.config.js`): `global → globalThis` and `process → process/browser` are required for wagmi/viem to work in the browser. Don't remove them.

**Minimal user-flow UI (route per step).** The app is stripped to the member journey — no Swap / Staking / Rewards / Loyalty / Admin / marketing pages. Routes (`App.jsx`):

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `Connect.jsx` | Wallet-connect landing + state-based entry routing (→ `/register` or `/activate`) |
| `/register` | `Register.jsx` | `register()`; doubles as "My Referral" once registered |
| `/activate` | `Activate.jsx` | **One button** runs `approve(USDT)` → `depositUSDT(target)` → `activateRank()` |
| `/fbmx` | `Fbmx.jsx` | `approve(FBMX)` → `depositFBMX()` (funds the 0.05-FBMX-per-action fee balance) |
| `/collect` | `Collect.jsx` | `collectPassiveRewards()` + `collectBinaryRewards()` |
| `/withdraw` | `Withdraw.jsx` | `withdrawBalance()` (tier-locked) |

**Data flow:**
1. `src/hooks/useUserData.js` batches 17 contract reads via `useReadContracts` (refetches every 10s), computes cooldown booleans, and returns a `user` object, token balances, allowances, cooldown timestamps, and protocol stats. `user.walletBalanceRaw` is the deposited-but-unactivated USDT (raw BigInt) used by `Activate.jsx`.
2. `src/components/FlowLayout.jsx` wraps the registered-flow pages: it calls `useUserData()` once, gates on connect / wrong-network / not-registered (`<Navigate to="/register">`), renders the step nav + read-only `AccountSummary`, and passes the `useUserData()` result to page bodies via a **render-prop** (`{(d) => …}`).
3. Each panel (`RegisterPanel`, `Activate`, `FbmxDepositPanel`, `CollectWithdrawPanels`, `WithdrawPanel`) calls `useWriteContract` + `useWaitForTransactionReceipt` directly:
   ```js
   writeContract({ address, abi, functionName, args }, { onSuccess, onError })
   ```
4. **Activate orchestration:** the 3 calls are separate EOA txs (the contract's `antiSpam` modifier requires `msg.sender == tx.origin`, so batching is impossible) with a `transactionCooldown` wait between deposit and activate. The step is derived from public reads (`usdtAllowanceRaw`, `walletBalanceRaw`, `hasActivated`) so the flow resumes after a mid-sequence reload.

**Additional hooks exported from `useUserData.js`:**
- `usePlacementPreview(referrerAddress, group)` — calls `getPlacement()` to preview binary placement before registering (used by `RegisterPanel`)
- `useChildrenPage(address, startIndex, count)` — paginated `getChildren()` (no current caller after the genealogy tree was removed)

---

## Key Contracts

| Constant | Address |
|----------|---------|
| `FBMXDAO_ADDRESS` (V2, active) | `0xf70bbb99E75999A3eE3f137F2701AFf82225519C` (source of truth = `contracts.js:3`) |
| `FBMXDAO_ADDRESS_OLD` (migration source) | `0xCac3c8Cdc5649fa2575da8F6F06431af6D529494` |
| `USDT_ADDRESS` | `0x55d398326f99059fF775485246999027B3197955` |
| `FBMX_ADDRESS` | `0x5951F937ff590239D38c10e871F9982359E56C36` |
| `PANCAKE_V3_POOL` | `0x200410102224189d502e33a1691f13f1b872755a` |
| `PANCAKE_V3_ROUTER` | `0x1b81D678ffb9C0263b24A97847620C99d213eB14` |

**V2-only functions** (not in old contract):
- `hasActivated(address)` → bool — true after first activation
- `transactionCooldown()` → uint256 — configurable anti-spam seconds (on-chain default **6s**; frontend fallback `COOLDOWN_TX_DEFAULT = 6`)
- `activateRank()` — upgrade rank from wallet balance (no USDT top-up)
- `depositUSDT(targetLevel)` — `0` = sequential; `>0` = jump to level in one tx (only when `hasActivated == false`)

**`antiSpam` modifier** guards `register`, `depositUSDT`, `activateRank`, both collects, and `withdrawBalance`: requires `msg.sender == tx.origin` (**EOA only — no multicall/wrapper batching**), one call per block, and `transactionCooldown` seconds between calls. `register` does **not** pull USDT (only checks balance ≥ entryFee). `pendingTargetLevel` is `private` (not frontend-readable).

**Level-jump cost:** `ENTRY_FEE * (2^targetLevel - 1)` where `ENTRY_FEE = 5 USDT`. Contract `maxRank = 14`, so a one-tx jump can only target levels **1–14** (`MAX_JUMP_LEVEL`); level 15 (Emperor) is reachable only via sequential re-ups.

**Contract return values are positional tuples** — always use index access, not named properties:
- `affiliates(addr)`: `[0]`=parent, `[1]`=agent, `[2]`=totalDirect, `[3]`=level
- `binaries(addr)`: `[0]`=parent, `[1]`=left, `[2]`=right, `[3]`=leftVol, `[4]`=rightVol, `[5]`=coolDown
- `wallets(addr)`: `[0]`=balance, `[1]`=capping, `[2]`=totalIncome, `[3]`=coolDown
- `passives(addr)`: `[0]`=totalPassive, `[1]`=totalEquity, `[2]`=coolDown

**Domain constants in `contracts.js`:**
- `WITHDRAW_TIERS` — array of `{ label, amount (wei BigInt), minLevel }` for the 5 withdrawal tiers ($15/$50/$100/$500/$1000)
- `MIN_FBMX_REQUIRED = 0.05 FBMX` (5×10¹⁶ wei) — burned from `tokenBalance` on every collect/withdraw call
- `MAX_RANK = 15`, `MAX_JUMP_LEVEL = 14` (contract `maxRank`), `COOLDOWN_24H = 86400`, `COOLDOWN_TX_DEFAULT = 6`

**`useUserData` return shape note:** Most money values are formatted strings (`formatUnits(..., 18)`). Exceptions: `upgradeAmount` and `user.walletBalanceRaw` are raw BigInts (for direct allowance/cost comparison); `usdtBalanceRaw`, `fbmxBalanceRaw`, `usdtAllowanceRaw`, `fbmxAllowanceRaw` are raw BigInts alongside their formatted counterparts.

---

## Rank System

Source of truth: `RANK_LABELS` and `RANK_COLORS` in `src/config/ranks.js` (imported by `AccountSummary.jsx` and `Activate.jsx`). Levels 0–15: Registered → Initiate → Scout → Pioneer → Challenger → Builder → Trailblazer → Guardian → Commander → Vanguard → Warlord → Sovereign → Archon → Titan → Fortress → Emperor.

---

## Cooldowns

Four independent cooldowns tracked in `useUserData`:

| Name | Contract storage | Duration |
|------|-----------------|----------|
| Passive | `passives[addr].coolDown` | 24h |
| Binary | `binaries[addr].coolDown` | 24h |
| Withdraw | `wallets[addr].coolDown` | 24h |
| Global (anti-spam) | `lastCallTime[addr]` + `transactionCooldown()` | configurable |

All panels receive `xyzCooldownEnds` (Unix timestamp as number) and pass it to `useCountdown()` for live display.

---

## Styling

Tailwind with a custom dark theme. Key brand tokens: `brand-gold` (#F5A623), `brand-green` (#00D4AA), `brand-red` (#FF4D6D), `brand-card` (#161B27), `brand-surface` (#10141C), `brand-border` (#1E2535), `brand-muted` (#8892A4). Custom responsive breakpoint `xs: 400px` added alongside the Tailwind defaults.

Utility classes in `src/index.css`: `.btn-gold`, `.card-glow`, `.gold-text`, `.animate-marquee`, `.animate-grid`, `.scrollbar-none`.

Fonts: **Syne** (`font-display`), **DM Sans** (body), **JetBrains Mono** (`font-mono`).

---

## Removed in the minimal revamp

The Admin/migration UI, Swap, Staking, Rewards explainer, Loyalty, marketing Landing, genealogy tree, transaction history, and standalone Upgrade panel were deleted to keep the app to the user flow. `ADMIN_ABI`, `LOYALTY_REWARDS_*`, `FBMXSTAKING_*`, and `PANCAKE_V3_*` exports in `contracts.js` are now unused (left in place; safe to prune). Git history preserves the removed files if migration tooling is needed again.
