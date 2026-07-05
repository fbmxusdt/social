# fbmxsocial — Milestones

**Project Status:** 🟢 Minimal UI built (build-verified) — pending on-chain dogfood
**Last Updated:** 2026-06-25
**Next Session Focus:** On-chain walkthrough of the full flow on BSC with a funded wallet
**Origin:** Forked from `fbmxdao` (React 19 + Wagmi v2 + Viem, BSC mainnet) on 2026-06-25. Standalone
git repo, no remote.

---

## Phase Breakdown

### ✅ Phase 1: Scope the minimal variant
**Status:** COMPLETE
- [x] Decided keep = user/public flow only; strip Swap/Staking/Rewards/Loyalty/Admin/marketing
- [x] `npm ci` + clean `npm run build`
- [ ] Project domain still points at fbmxdao.com (deferred to pre-deploy)

### ✅ Phase 2: Build the minimal user-flow UI
**Status:** COMPLETE (build-verified)
- [x] Route-per-step: `/`, `/register`, `/activate`, `/fbmx`, `/collect`, `/withdraw`, `/tree`
- [x] One-button Activate (approve→deposit→wait→activate), resumable from on-chain reads
- [x] Shared FlowLayout (gating + account summary + step nav, render-prop data)
- [x] Genealogy explorer (binary + affiliate trees) reused from fbmxdao
- [x] Register nav hidden once registered
- [x] Deleted unused pages/components/lib; updated CLAUDE.md

### ⏳ Phase 3: On-chain verification & ship
**Status:** NOT STARTED
- [ ] Dogfood full flow on BSC mainnet (funded test wallet)
- [ ] Set project domain (package.json homepage + deploy `--cname`)
- [ ] `npm run deploy`

---

## Key Accomplishments This Session (2026-06-25)
- ✅ Full minimal revamp: 7-route flow, one-button Activate orchestration, shared FlowLayout
- ✅ Re-added Genealogy `/tree` (binary + affiliate views) from the fbmxdao component
- ✅ Hid Register nav post-registration (FlowLayout + Navbar)
- ✅ Verified contract constraints (antiSpam EOA-only, register no-approval, maxRank=14, private pendingTargetLevel)
- ✅ Clean `npm run build`

## Known Limitations
1. **Not yet tested on-chain** — approve→deposit→wait→activate, cooldowns, and tree need a funded BSC wallet.
2. Referral card only reachable at `/register` by URL once registered (Register nav hidden) — UX decision pending.
3. `homepage` + deploy `--cname` still target `fbmxdao.com`.
4. Unused `contracts.js` exports remain (PANCAKE_V3_*, FBMXSTAKING_*, LOYALTY_REWARDS_*, ADMIN_ABI) — safe to prune.
5. Not committed (untracked dir, no remote); user hasn't requested a commit.
6. ⚠️ `Connect.jsx` "Enter App" (registered) links to `/dashboard`, which no longer exists → bounces to `/`. Repoint to `/activate` or re-add the route.
7. ⚠️ `AccountSummary` now takes `passivePercentage` but `FlowLayout` doesn't pass it (shows "…% / DAY"). Wire it through.
8. Brand label split: `Connect.jsx` says "FBMXSOCIAL", Navbar says "FBMXDAO" — finish the rebrand if intended.

## Next Session Checklist
- [ ] On-chain dogfood of the full flow on BSC
- [ ] Decide referral-card access for registered users
- [ ] Set domain → `npm run build` → `npm run deploy`

---

**Last Session:** 2026-06-25
**Project Owner:** Dangal Macatangay
**Status:** ✅ On Track
