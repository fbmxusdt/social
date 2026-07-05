import {
  Coins, TrendingDown, GitBranch, Zap, BadgeDollarSign, Clock,
} from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'
import { RANK_LABELS, RANK_COLORS } from '../config/ranks'

function StatCard({ label, value, sub, icon: Icon, color = 'gold', pulse }) {
  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-3 sm:p-4 card-glow transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color === 'gold' ? 'bg-brand-gold/10 text-brand-gold' :
          color === 'green' ? 'bg-brand-green/10 text-brand-green' :
            color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
              color === 'red' ? 'bg-red-500/10 text-red-400' :
                'bg-purple-500/10 text-purple-400'
          }`}>
          <Icon size={15} />
        </div>
        {pulse && <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse mt-1" />}
      </div>
      <div className="text-sm sm:text-base font-mono font-bold text-white mb-0.5 truncate">{value}</div>
      <div className="text-[11px] text-brand-muted leading-tight">{label}</div>
      {sub && <div className="text-[10px] text-brand-gold mt-1 truncate">{sub}</div>}
    </div>
  )
}

function LiveCooldownRow({ label, endsAt, color }) {
  const { formatted, isActive } = useCountdown(endsAt)
  return (
    <div className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
      <span className="text-xs text-brand-muted">{label}</span>
      <span className={`text-xs font-mono font-bold ${isActive ? (color === 'red' ? 'text-brand-red' : 'text-amber-400') : 'text-brand-green'}`}>
        {isActive ? formatted : 'Ready ✓'}
      </span>
    </div>
  )
}

// Compact, read-only account summary shown across the registered flow pages.
// All values come from the batched useUserData() reads passed in by FlowLayout.
export default function AccountSummary({
  user,
  passivePercentage,
  usdtBalance, fbmxBalance,
  isPassiveCooldown, passiveCooldownEnds,
  isBinaryCooldown, binaryCooldownEnds,
  withdrawCooldownEnds,
  globalCooldownEnds, txCooldownSecs,
}) {
  if (!user) return null

  const weakerLeg = Math.min(Number(user.leftVolume), Number(user.rightVolume))

  return (
    <div className="space-y-4">
      {/* Rank badge */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-2xl text-white flex-shrink-0 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${RANK_COLORS[user.level]}, ${RANK_COLORS[user.level]}88)` }}>
          {user.level}
        </div>
        <div className="min-w-0">
          <div className="text-brand-muted text-[11px]">Membership Rank</div>
          <div className="font-display font-bold text-white text-base truncate">
            {RANK_LABELS[user.level] ?? `Rank ${user.level}`}
          </div>
          {/* Current passive earning rate — getPercentage() basis points / 100 */}
          <div className="text-brand-gold text-xs font-mono mt-0.5">
            {passivePercentage != null ? `${passivePercentage.toFixed(2)}% / DAY` : '…% / DAY'}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Wallet Balance" value={`$${Number(user.walletBalance).toFixed(2)}`}
          sub="Rankup & withdrawal" icon={Coins} color="gold" />
        <StatCard label="Passive Reward" value={`$${Number(user.passiveReward).toFixed(2)}`}
          sub={`Equity: $${Number(user.activeEquity).toFixed(2)}`} icon={TrendingDown} color="gold"
          pulse={!isPassiveCooldown} />
        <StatCard label="Binary (weaker)" value={`$${weakerLeg.toFixed(2)}`}
          sub={`L:$${Number(user.leftVolume).toFixed(2)} R:$${Number(user.rightVolume).toFixed(2)}`}
          icon={GitBranch} color="green" pulse={!isBinaryCooldown} />
        <StatCard label="FBMX In-Contract" value={Number(user.fbmxInContract).toFixed(4)}
          sub="Utility fee balance" icon={Zap} color="blue" />
        <StatCard label="Remaining Capping" value={`$${Number(user.capping).toFixed(2)}`}
          sub="Capping" icon={BadgeDollarSign} color="red" />
        <StatCard label="Total Income" value={`$${Number(user.totalIncome).toFixed(2)}`}
          sub="Accumulated" icon={BadgeDollarSign} color="green" />
      </div>

      {/* Wallet balances */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 space-y-2">
        <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Wallet Balances</div>
        <div className="flex justify-between text-xs">
          <span className="text-brand-muted">USDT</span>
          <span className="font-mono text-white">{Number(usdtBalance).toFixed(4)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-brand-muted">FBMX</span>
          <span className="font-mono text-brand-gold">{Number(fbmxBalance).toFixed(4)}</span>
        </div>
      </div>

      {/* Cooldowns */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
        <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock size={11} /> Cooldowns
        </div>
        <LiveCooldownRow label="Passive (24h)" endsAt={passiveCooldownEnds} color="amber" />
        <LiveCooldownRow label="Binary (24h)" endsAt={binaryCooldownEnds} color="amber" />
        <LiveCooldownRow label="Withdraw (24h)" endsAt={withdrawCooldownEnds} color="amber" />
        <LiveCooldownRow label={`Global lock (${txCooldownSecs}s)`} endsAt={globalCooldownEnds} color="red" />
      </div>
    </div>
  )
}
