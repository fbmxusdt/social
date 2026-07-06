import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { ArrowRight, UserPlus, Zap } from 'lucide-react'
import { BSC_CHAIN_ID } from '../config/wagmi'
import { useUserData } from '../hooks/useUserData'
import ConnectPrompt from '../components/ConnectPrompt'
import WrongNetworkBanner from '../components/WrongNetworkBanner'
import HalvingHero from '../components/HalvingHero'

// Landing page = milestone hero + wallet-connect gate + state-based entry routing.
export default function Connect() {
  const { isConnected, chain } = useAccount()
  const { isRegistered } = useUserData()

  // Wrong network is an error state — keep it focused, no marketing hero.
  if (isConnected && chain?.id !== BSC_CHAIN_ID)
    return <div className="pt-16"><WrongNetworkBanner /></div>

  return (
    <div className="pt-16">
      <HalvingHero />

      {/* CTA lands here from the hero button */}
      <section id="get-started" className="scroll-mt-20 px-4 py-12 sm:py-16">
        {!isConnected ? (
          <ConnectPrompt />
        ) : (
          <div className="mx-auto max-w-sm text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-gold/20 bg-brand-gold/10">
              {isRegistered ? <Zap size={32} className="text-brand-gold" /> : <UserPlus size={32} className="text-brand-gold" />}
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold text-white">
              {isRegistered ? 'Welcome Back' : 'Join FBMXSOCIAL'}
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-brand-muted">
              {isRegistered
                ? 'Your wallet is registered. Continue to activate your rank, collect rewards, or withdraw.'
                : 'Your wallet isn’t a member yet. Register to start earning passive and binary rewards.'}
            </p>
            <Link
              to={isRegistered ? '/dashboard' : '/register'}
              className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-base sm:w-auto"
            >
              {isRegistered ? 'Enter App' : 'Register Now'}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
