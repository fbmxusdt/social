import { useSwitchChain } from 'wagmi'
import { AlertTriangle, Network } from 'lucide-react'
import { BSC_CHAIN_ID } from '../config/wagmi'

// Shown when a wallet is connected to a chain other than BSC.
export default function WrongNetworkBanner() {
  const { switchChain } = useSwitchChain()
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-brand-red" />
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">Wrong Network</h2>
        <p className="text-brand-muted text-sm mb-8">FBMXDAO is deployed on Binance Smart Chain. Switch to continue.</p>
        <button onClick={() => switchChain({ chainId: BSC_CHAIN_ID })}
          className="btn-gold px-8 py-3.5 rounded-xl flex items-center gap-2 mx-auto">
          <Network size={16} />Switch to BSC
        </button>
      </div>
    </div>
  )
}
