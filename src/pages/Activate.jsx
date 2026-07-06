import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatUnits, maxUint256 } from 'viem'
import {
  Zap, Layers, Loader2, CheckCircle, AlertCircle, Lock, Clock, Info, ArrowRight,
} from 'lucide-react'
import {
  FBMXDAO_ADDRESS, FBMXDAO_ABI, USDT_ADDRESS, ERC20_ABI,
  ENTRY_FEE, MAX_JUMP_LEVEL,
} from '../config/contracts'
import { useCountdown } from '../hooks/useCountdown'
import { RANK_LABELS } from '../config/ranks'
import FlowLayout from '../components/FlowLayout'

// Jump cost from level 0 → targetLevel in one tx: ENTRY_FEE × (2^targetLevel − 1).
function jumpCost(targetLevel) {
  if (targetLevel <= 0) return 0n
  return ENTRY_FEE * ((1n << BigInt(targetLevel)) - 1n)
}

const fmtUsdt = (raw) => Number(formatUnits(raw, 18)).toLocaleString(undefined, { maximumFractionDigits: 2 })

// One button drives the full chain: approve(USDT) → depositUSDT(target) → activateRank().
// These are 3 separate EOA txs (the contract's antiSpam modifier forbids batching),
// and a transactionCooldown wait sits between deposit and activate. The step is derived
// from public reads (allowance, deposited-but-unactivated wallet balance, hasActivated)
// so the flow is resumable if the page reloads mid-sequence.
function ActivatePanel({ d }) {
  const { user, usdtBalance, usdtBalanceRaw, usdtAllowanceRaw, globalCooldownEnds, txCooldownSecs, refetch } = d

  const hasActivated = user?.hasActivated ?? false
  const canJump = !hasActivated
  const [jumpTarget, setJumpTarget] = useState(1)

  // Cost + on-chain target for the current mode.
  const target = canJump ? jumpTarget : 0
  const cost = canJump ? jumpCost(jumpTarget) : (user?.upgradeAmount ?? 0n)

  // Derived next-step from public reads.
  const walletBalRaw = user?.walletBalanceRaw ?? 0n
  const needApprove = usdtAllowanceRaw < cost
  const needDeposit = walletBalRaw < cost            // deposited-but-unactivated USDT not yet enough
  const hasUsdt = usdtBalanceRaw >= cost
  const insufficientUsdt = needDeposit && !hasUsdt   // only need wallet USDT if a deposit is still required

  // step: idle | approving | depositing | waiting | activating | done
  const [step, setStep] = useState('idle')
  const [waitUntil, setWaitUntil] = useState(0)      // unix secs — anti-spam wait target (display only)

  const { writeContract, data: txHash, isPending, isError, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError } = useWaitForTransactionReceipt({ hash: txHash })

  const { isActive: globalActive, formatted: globalFmt } = useCountdown(globalCooldownEnds)
  const { formatted: waitFmt } = useCountdown(waitUntil)

  // ── Step firing ────────────────────────────────────────────────────────────
  const fireApprove = () => {
    setStep('approving')
    writeContract(
      { address: USDT_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [FBMXDAO_ADDRESS, maxUint256] },
      { onError: () => setStep('idle') }
    )
  }
  const fireDeposit = () => {
    setStep('depositing')
    writeContract(
      { address: FBMXDAO_ADDRESS, abi: FBMXDAO_ABI, functionName: 'depositUSDT', args: [target] },
      { onError: () => setStep('idle') }
    )
  }
  const fireActivate = () => {
    setStep('activating')
    writeContract(
      { address: FBMXDAO_ADDRESS, abi: FBMXDAO_ABI, functionName: 'activateRank', args: [] },
      { onError: () => setStep('idle') }
    )
  }

  // Single entry point — fire the first step that's actually needed.
  const handleStart = () => {
    if (globalActive || insufficientUsdt || cost <= 0n) return
    if (needApprove) fireApprove()
    else if (needDeposit) fireDeposit()
    else fireActivate()
  }

  // Auto-advance on confirmed receipts (approve has no antiSpam wait; deposit does).
  useEffect(() => {
    if (!isSuccess) return
    if (step === 'approving') {
      refetch?.()
      fireDeposit()                                  // allowance was the only blocker → deposit next
    } else if (step === 'depositing') {
      refetch?.()
      setWaitUntil(Math.floor(Date.now() / 1000) + Number(txCooldownSecs) + 1)
      setStep('waiting')
    } else if (step === 'activating') {
      setStep('done')
      refetch?.()
    }
  }, [isSuccess])                                    // eslint-disable-line react-hooks/exhaustive-deps

  // Anti-spam wait between deposit and activate — fire activate once the cooldown elapses.
  // Driven by a timeout (not the read-derived countdown) so it can't fire early on a stale read.
  useEffect(() => {
    if (step !== 'waiting') return
    const ms = (Number(txCooldownSecs) + 1) * 1000
    const t = setTimeout(() => fireActivate(), ms)
    return () => clearTimeout(t)
  }, [step])                                         // eslint-disable-line react-hooks/exhaustive-deps

  // Reset step on revert.
  useEffect(() => {
    if (isReceiptError) setStep('idle')
  }, [isReceiptError])

  // Auto-clear success banner.
  useEffect(() => {
    if (step !== 'done') return
    const t = setTimeout(() => setStep('idle'), 4000)
    return () => clearTimeout(t)
  }, [step])

  const busy = step !== 'idle' && step !== 'done'

  // ── Button label ─────────────────────────────────────────────────────────────
  const renderLabel = () => {
    if (step === 'approving') return isPending
      ? <><Lock size={16} className="animate-pulse" /> Approve USDT — confirm in wallet…</>
      : <><Loader2 size={16} className="animate-spin" /> Confirming approval…</>
    if (step === 'depositing') return isPending
      ? <><Lock size={16} className="animate-pulse" /> Deposit — confirm in wallet…</>
      : <><Loader2 size={16} className="animate-spin" /> Confirming deposit…</>
    if (step === 'waiting') return <><Clock size={16} className="animate-pulse" /> Anti-spam cooldown {waitFmt ?? '…'} — activate next…</>
    if (step === 'activating') return isPending
      ? <><Lock size={16} className="animate-pulse" /> Activate — confirm in wallet…</>
      : <><Loader2 size={16} className="animate-spin" /> Confirming activation…</>
    if (step === 'done') return <><CheckCircle size={18} className="text-brand-green" /> Activated!</>
    if (globalActive) return <><Clock size={16} /> Anti-spam wait {globalFmt}</>
    // idle
    const verb = needApprove ? 'Approve, Deposit & Activate'
      : needDeposit ? 'Deposit & Activate'
        : 'Finish Activation'
    return <>{canJump ? <Zap size={18} /> : <Layers size={18} />} {verb}{cost > 0n ? ` — ${fmtUsdt(cost)} USDT` : ''}</>
  }

  // Visual 3-step indicator.
  const stepIndex = { idle: 0, approving: 0, depositing: 1, waiting: 1, activating: 2, done: 3 }[step]
  const STEP_LABELS = ['Approve', 'Deposit', 'Activate']

  return (
    <div className="space-y-5">
      {/* Mode banner */}
      <div className="flex items-center gap-3 p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
        <Zap size={18} className="text-brand-gold flex-shrink-0" />
        <div className="flex-1 text-sm text-brand-muted leading-relaxed">
          {canJump
            ? <><strong className="text-white">First activation:</strong> pick a level to jump to. One button approves USDT, deposits, and activates — in three wallet confirmations.</>
            : <><strong className="text-white">Rank up:</strong> currently {RANK_LABELS[user?.level] ?? `Rank ${user?.level}`}. One button deposits for the next rank and activates it.</>}
        </div>
      </div>

      {/* Jump level grid (first activation only) */}
      {canJump && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4 space-y-3">
          <div className="text-lg font-medium text-brand-muted">Select Level</div>
          <div className="grid grid-cols-4 xs:grid-cols-7 gap-2">
            {Array.from({ length: MAX_JUMP_LEVEL }, (_, i) => i + 1).map((level) => {
              const c = jumpCost(level)
              const canAfford = usdtBalanceRaw >= c
              const isSelected = jumpTarget === level
              return (
                <button
                  key={level}
                  onClick={() => { setJumpTarget(level); setStep('idle'); reset?.() }}
                  disabled={!canAfford || busy}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-brand-gold/50 bg-brand-gold/10 ring-1 ring-brand-gold/30'
                      : canAfford
                      ? 'border-brand-border bg-brand-card hover:border-brand-gold/30'
                      : 'border-brand-border bg-brand-dark opacity-30 cursor-not-allowed'
                  }`}
                >
                  <div className={`font-display font-bold text-lg ${isSelected ? 'text-brand-gold' : canAfford ? 'text-white' : 'text-brand-muted'}`}>
                    L{level}
                  </div>
                  <div className="text-sm text-brand-muted mt-1">${Number(formatUnits(c, 18)).toFixed(0)}</div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Sequential rank-up info (after first activation) */}
      {!canJump && (
        <div className="flex items-start gap-3 p-4 bg-brand-surface border border-brand-border rounded-xl">
          <Info size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
          <div className="text-sm text-brand-muted leading-relaxed">
            Next rank deposit is <strong className="text-brand-gold">{user?.upgradeAmountFmt} USDT</strong>{' '}
            (entryFee × 2^level), then one activation.
          </div>
        </div>
      )}

      {/* Cost / balance / allowance */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5 space-y-3">
        <div className="flex justify-between text-base">
          <span className="text-brand-muted">{canJump ? `Jump to Level ${jumpTarget}` : `Rank up to Level ${(user?.level ?? 0) + 1}`}</span>
          <span className="font-mono font-bold text-white">{fmtUsdt(cost)} USDT</span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-brand-muted">Your USDT balance</span>
          <span className={`font-mono font-semibold ${hasUsdt ? 'text-brand-green' : 'text-brand-red'}`}>
            {Number(usdtBalance).toFixed(4)} USDT
          </span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-brand-muted">Approval status</span>
          {!needApprove
            ? <span className="text-brand-green text-sm font-semibold flex items-center gap-1"><CheckCircle size={13} /> Approved</span>
            : <span className="text-amber-400 text-sm font-semibold">Will approve</span>}
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold w-full justify-center transition-all ${
              stepIndex > i ? 'border-brand-green/30 bg-brand-green/10 text-brand-green'
                : stepIndex === i && busy ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-gold'
                  : 'border-brand-border bg-brand-surface text-brand-muted'
            }`}>
              {stepIndex > i ? <CheckCircle size={12} /> : <span className="font-mono">{i + 1}</span>}
              {label}
            </div>
            {i < STEP_LABELS.length - 1 && <ArrowRight size={12} className="text-brand-muted flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Insufficient balance */}
      {insufficientUsdt && (
        <div className="flex items-center gap-2 p-3 bg-brand-red/10 border border-brand-red/20 rounded-lg text-brand-red text-sm">
          <AlertCircle size={14} />
          Insufficient USDT. You need {fmtUsdt(cost)} USDT in your wallet.
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-start gap-2 p-3 bg-brand-red/10 border border-brand-red/20 rounded-lg text-brand-red text-sm">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          {error?.shortMessage || error?.message || 'Transaction failed'}
        </div>
      )}

      {/* The one button */}
      <button
        onClick={handleStart}
        disabled={busy || insufficientUsdt || cost <= 0n || globalActive}
        className="w-full btn-gold py-4 rounded-xl flex items-center justify-center gap-2 font-display font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {renderLabel()}
      </button>

      <p className="text-xs text-brand-muted text-center">
        Three wallet confirmations run back-to-back: approve USDT, deposit, then activate (after a {Number(txCooldownSecs)}s anti-spam wait). Keep your wallet open.
      </p>
    </div>
  )
}

export default function Activate() {
  return (
    <FlowLayout title="Activate Rank" subtitle="Approve, deposit, and activate in one flow.">
      {(d) => <ActivatePanel d={d} />}
    </FlowLayout>
  )
}
