import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { ArrowRight, UserPlus, Zap } from 'lucide-react'
import { BSC_CHAIN_ID } from '../config/wagmi'
import { useUserData } from '../hooks/useUserData'
import ConnectPrompt from '../components/ConnectPrompt'
import WrongNetworkBanner from '../components/WrongNetworkBanner'

// Landing page = wallet-connect gate + state-based entry routing.
export default function Connect() {
  const { isConnected, chain } = useAccount()
  const { isRegistered } = useUserData()

  if (!isConnected) return <div className="pt-16"><ConnectPrompt /></div>
  if (chain?.id !== BSC_CHAIN_ID) return <div className="pt-16"><WrongNetworkBanner /></div>

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto mb-6">
          {isRegistered ? <Zap size={32} className="text-brand-gold" /> : <UserPlus size={32} className="text-brand-gold" />}
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">
          {isRegistered ? 'Welcome Back' : 'Join FBMXSOCIAL'}
        </h2>
        <p className="text-brand-muted text-sm mb-8 leading-relaxed">
          {isRegistered
            ? 'Your wallet is registered. Continue to activate your rank, collect rewards, or withdraw.'
            : 'Your wallet isn’t a member yet. Register to start earning passive and binary rewards.'}
        </p>
        <Link
          to={isRegistered ? '/dashboard' : '/register'}
          className="btn-gold px-8 py-3.5 rounded-xl inline-flex items-center gap-2"
        >
          {isRegistered ? 'Enter App' : 'Register Now'}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
