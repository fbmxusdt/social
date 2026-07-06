import { useEffect, useState } from 'react'
import { Rocket, Lock, TrendingUp, ShieldCheck, Sparkles, ArrowRight, Flame } from 'lucide-react'

// Milestone announcement hero for the "HALVING TIME" launch (70% of supply
// locked in liquidity). Mobile-first: single column, full-width CTA, and an
// animated liquidity meter that fills to 70% on mount. The CTA is an in-page
// anchor so the parent decides the action target (#get-started).
const BENEFITS = [
  { icon: Lock, text: 'Stronger liquidity foundation' },
  { icon: TrendingUp, text: 'Increased market confidence' },
  { icon: ShieldCheck, text: 'Reduced token availability over time' },
  { icon: Sparkles, text: 'Positioned for long-term growth' },
]

export default function HalvingHero({ ctaHref = 'https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x5951F937ff590239D38c10e871F9982359E56C36&chain=bsc', ctaLabel = 'Secure Your FBMX Today' }) {
  const [fill, setFill] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setFill(70), 250)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-brand-border">
      {/* backdrop layers */}
      <div className="absolute inset-0 animate-grid opacity-60" aria-hidden="true" />
      <div className="absolute -top-32 left-1/2 h-56 w-[130%] -translate-x-1/2 bg-glow blur-2xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-lg px-4 py-12 text-center sm:py-16">
        {/* badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1.5">
          <Rocket size={14} className="text-brand-gold" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-gold">
            New Milestone Unlocked
          </span>
        </div>

        {/* headline */}
        <h1 className="font-display font-bold leading-[1.1] tracking-tight text-white text-3xl xs:text-4xl sm:text-5xl">
          <span className="gold-text">HALVING TIME</span>
          <br />
          Has Officially Begun
        </h1>

        {/* subhead */}
        <p className="mx-auto mt-4 max-w-md text-sm font-semibold text-brand-muted sm:text-base">
          Stronger Liquidity. Greater Stability. Bigger Growth Potential.
        </p>

        {/* liquidity meter */}
        <div className="card-glow mt-7 rounded-2xl border border-brand-border bg-brand-card/70 p-5 text-left backdrop-blur">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-brand-muted">Total Supply Locked</span>
            <span className="font-display text-2xl font-bold gold-text">70%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-brand-surface">
            <div
              className="h-full rounded-full bg-gold-gradient shadow-gold transition-[width] duration-1000 ease-out"
              style={{ width: `${fill}%` }}
            />
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-brand-muted">
            70% of the total token supply is now locked in the liquidity pool — a stronger foundation for
            long-term stability, market confidence, and sustainable growth.
          </p>
        </div>

        {/* body */}
        <p className="mt-6 text-sm leading-relaxed text-brand-muted">
          <span className="font-semibold text-white">HALVING TIME</span> is a pivotal phase where token
          availability becomes increasingly limited while the ecosystem keeps expanding. As circulating supply
          tightens, every token becomes more valuable to those who secure their position early.
        </p>

        {/* benefits */}
        <ul className="mt-6 grid grid-cols-1 gap-2.5 text-left xs:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-2.5 rounded-xl border border-brand-border bg-brand-surface/60 px-3 py-2.5"
            >
              <ShieldIcon Icon={Icon} />
              <span className="text-xs leading-snug text-white sm:text-sm">{text}</span>
            </li>
          ))}
        </ul>

        {/* closing */}
        <p className="mt-6 text-sm font-semibold leading-relaxed text-white">
          The early accumulation phase won’t last forever. Become part of the momentum while FBMX is still in
          its premium early-growth phase.
        </p>

        {/* CTA — external DEX link opens in a new tab so the dApp stays open */}
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-base sm:w-auto"
        >
          {ctaLabel}
          <ArrowRight size={18} />
        </a>

        {/* passive-rewards halving card — the second half of the halving mechanism */}
        <div className="card-glow mt-8 rounded-2xl border border-brand-gold/20 bg-brand-card/70 p-5 text-left backdrop-blur">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-brand-muted">
              <Flame size={14} className="shrink-0 self-center text-brand-gold" />
              Passive Rewards
            </span>
            <span className="font-display text-2xl font-bold gold-text">&minus;50%</span>
          </div>
          <h3 className="font-display text-base font-bold text-white sm:text-lg">
            Emissions Halved — Scarcity by Design
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-brand-muted sm:text-sm">
            Effective with HALVING TIME, passive reward emissions are cut by 50%. Fewer new tokens entering
            circulation means less sell pressure and growing scarcity — a deliberate reinforcement mechanism
            engineered to strengthen the value of every FBMX in circulation.
          </p>
          <p className="mt-2 text-xs leading-relaxed sm:text-sm">
            <span className="font-semibold text-white">The math is simple:</span>{' '}
            <span className="text-brand-muted">
              70% of supply locked + 50% fewer emissions = supply tightens while the ecosystem grows. Every
              token you secure today puts you ahead of the next wave of growth.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

// Small wrapper so each benefit icon keeps a fixed footprint on tiny screens.
function ShieldIcon({ Icon }) {
  return <Icon size={16} className="shrink-0 text-brand-green" />
}
