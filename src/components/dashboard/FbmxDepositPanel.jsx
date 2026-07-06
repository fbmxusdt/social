import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, maxUint256 } from 'viem'
import { Coins, Loader2, CheckCircle, AlertCircle, Info, Lock } from 'lucide-react'
import {
  FBMXDAO_ADDRESS, FBMXDAO_ABI,
  FBMX_ADDRESS, ERC20_ABI,
} from '../../config/contracts'

// ─── FBMX Deposit ─────────────────────────────────────────────────────────────
// depositFBMX(uint256 _amount) — stores FBMX in tokenBalance; needed for collect/withdraw fees.
// Two-step approve→deposit state machine: 'idle' | 'approving' | 'depositing' | 'done'.
export default function FbmxDepositPanel({ fbmxBalance, fbmxBalanceRaw, fbmxAllowanceRaw, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState('idle')

  const amountRaw = amount ? parseUnits(amount, 18) : 0n
  const hasBalance = fbmxBalanceRaw >= amountRaw
  const hasAllowance = fbmxAllowanceRaw >= amountRaw
  const needsApproval = !hasAllowance && amountRaw > 0n

  const { writeContract, data: txHash, isPending, isError, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (!isSuccess) return
    if (step === 'approving') {
      setStep('idle')
      onSuccess?.()
    } else if (step === 'depositing') {
      setStep('done')
      onSuccess?.()
    }
  }, [isSuccess])              // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isReceiptError) setStep('idle')
  }, [isReceiptError])

  useEffect(() => {
    if (step !== 'done') return
    const t = setTimeout(() => setStep('idle'), 4000)
    return () => clearTimeout(t)
  }, [step])

  const handleApprove = () => {
    setStep('approving')
    writeContract(
      { address: FBMX_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [FBMXDAO_ADDRESS, maxUint256] },
      { onError: () => setStep('idle') }
    )
  }

  const handleDeposit = () => {
    setStep('depositing')
    writeContract(
      { address: FBMXDAO_ADDRESS, abi: FBMXDAO_ABI, functionName: 'depositFBMX', args: [amountRaw] },
      { onError: () => setStep('idle') }
    )
  }

  return (
    <div className="space-y-5">
      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-brand-surface border border-brand-border rounded-xl">
        <Info size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
        <div className="text-sm text-brand-muted leading-relaxed">
          FBMX held in the contract acts as a <strong className="text-white">utility fee</strong>.
          Each collect or withdraw burns <strong className="text-brand-gold">0.05 FBMX</strong> from your in-contract balance.
          Minimum deposit: 5 FBMX.
        </div>
      </div>

      {/* Amount input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-base font-medium text-brand-muted">Amount (FBMX)</label>
          <button className="text-sm text-brand-gold hover:underline" onClick={() => setAmount(Number(fbmxBalance).toFixed(6))}>
            Max: {Number(fbmxBalance).toFixed(4)} FBMX
          </button>
        </div>
        <div className="flex items-center bg-brand-surface border border-brand-border rounded-xl overflow-hidden focus-within:border-brand-gold/50 focus-within:ring-2 focus-within:ring-brand-gold/10">
          <input
            type="number" min="0" value={amount}
            onChange={(e) => { setAmount(e.target.value); setStep('idle'); reset?.() }}
            placeholder="5.00"
            className="flex-1 px-4 py-3 bg-transparent text-white font-mono text-base outline-none"
          />
          <span className="px-4 text-brand-gold text-base font-bold border-l border-brand-border">FBMX</span>
        </div>
        {amount && !hasBalance && (
          <p className="mt-1.5 text-brand-red text-sm flex items-center gap-1">
            <AlertCircle size={13} /> Insufficient FBMX balance
          </p>
        )}
      </div>

      {isError && (
        <div className="flex items-start gap-2 p-3 bg-brand-red/10 border border-brand-red/20 rounded-lg text-brand-red text-sm">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          {error?.shortMessage || error?.message || 'Transaction failed'}
        </div>
      )}

      {needsApproval ? (
        <div className="space-y-2">
          <button
            onClick={handleApprove}
            disabled={step !== 'idle' || !hasBalance || !amount}
            className="w-full btn-gold py-4 rounded-xl flex items-center justify-center gap-2 font-display font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {step === 'approving'
              ? isPending
                ? <><Lock size={16} className="animate-pulse" /> Waiting for wallet…</>
                : <><Loader2 size={16} className="animate-spin" /> Confirming approval…</>
              : <><CheckCircle size={18} /> Step 1 — Approve FBMX</>}
          </button>
          <button disabled className="w-full py-4 rounded-xl bg-brand-surface border border-brand-border text-brand-muted text-base cursor-not-allowed">
            Step 2 — Deposit FBMX
          </button>
        </div>
      ) : (
        <button
          onClick={handleDeposit}
          disabled={step !== 'idle' || !amount || !hasBalance || amountRaw <= 0n}
          className="w-full btn-gold py-4 rounded-xl flex items-center justify-center gap-2 font-display font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {step === 'depositing'
            ? isPending
              ? <><Lock size={16} className="animate-pulse" /> Waiting for wallet…</>
              : <><Loader2 size={16} className="animate-spin" /> Confirming on-chain…</>
            : step === 'done'
              ? <><CheckCircle size={18} className="text-brand-green" /> Deposit Confirmed!</>
              : <><Coins size={18} /> Deposit {amount || '0'} FBMX</>}
        </button>
      )}
    </div>
  )
}
