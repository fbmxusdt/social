# fbmxsocial — Milestones

**Project Status:** 🟢 HALVING TIME hero shipped locally — pending fbmx.app upload verification
**Last Updated:** 2026-07-06
**Next Session Focus:** Verify fbmx.app deploy (new packaging flow), then on-chain dogfood
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

## Key Accomplishments This Session (2026-07-06)
- ✅ HALVING TIME hero (`HalvingHero.jsx`): animated 70% liquidity meter, −50% passive-rewards
  card, PancakeSwap buy CTA — mobile-first (95% of users on mobile), verified at 390/430px
- ✅ Fixed missing `xs: 400px` Tailwind breakpoint (existing `xs:` classes were inert)
- ✅ Added `public/.htaccess` SPA fallback for Apache/LiteSpeed hosting
- ✅ Root-caused fbmx.app all-404s: SMB volume → mode-700 dist → zip preserves → LiteSpeed 404
- ✅ Workspace tool `tools/package-cpanel.sh` + `postbuild` hook: every `npm run build`
  auto-creates permission-safe `dist.zip` (dirs 755, files 644) — wired in all 3 projects

## Key Accomplishments (2026-06-25)
- ✅ Full minimal revamp: 7-route flow, one-button Activate orchestration, shared FlowLayout
- ✅ Re-added Genealogy `/tree` (binary + affiliate views) from the fbmxdao component
- ✅ Hid Register nav post-registration (FlowLayout + Navbar)
- ✅ Verified contract constraints (antiSpam EOA-only, register no-approval, maxRank=14, private pendingTargetLevel)

## Known Limitations
1. **Not yet tested on-chain** — approve→deposit→wait→activate, cooldowns, and tree need a funded BSC wallet.
2. Referral card only reachable at `/register` by URL once registered (Register nav hidden) — UX decision pending.
3. Unused `contracts.js` exports remain (PANCAKE_V3_*, FBMXSTAKING_*, LOYALTY_REWARDS_*, ADMIN_ABI) — safe to prune.
4. ⚠️ `Connect.jsx` "Enter App" (registered) links to `/dashboard`, which no longer exists → bounces to `/`. Repoint to `/activate` or re-add the route.
5. ⚠️ `AccountSummary` now takes `passivePercentage` but `FlowLayout` doesn't pass it (shows "…% / DAY"). Wire it through.
6. Brand label split: `Connect.jsx` says "FBMXSOCIAL", Navbar says "FBMXDAO" — finish the rebrand if intended.
7. `public/favicon.svg` missing — referenced by index.html, 404s on every host (cosmetic).
8. fbmx.app upload not yet re-verified with the new permission-safe zip.

## Next Session Checklist
- [ ] Upload `dist.zip` to fbmx.app docroot → verify `/`, `/index.html`, `/register` all 200
- [ ] Commit this session's work
- [ ] Decide `/dashboard` link target in `Connect.jsx`
- [ ] On-chain dogfood of the full flow on BSC

---

**Last Session:** 2026-07-06
**Project Owner:** Dangal Macatangay
**Status:** ✅ On Track
