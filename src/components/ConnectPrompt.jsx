import { useState } from 'react'
import { useConnect } from 'wagmi'
import { Wallet, ChevronDown } from 'lucide-react'

// Wallet-connect card. Used by the Connect landing page and as the gate
// in FlowLayout when no wallet is connected.
export default function ConnectPrompt({
  title = 'Connect Your Wallet',
  subtitle = 'Connect a BSC-compatible wallet to access FBMXDAO and interact with the protocol.',
}) {
  const { connect, connectors } = useConnect()
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto mb-6 animate-pulse-gold">
          <Wallet size={32} className="text-brand-gold" />
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">{title}</h2>
        <p className="text-brand-muted text-sm mb-8 leading-relaxed">{subtitle}</p>
        <div className="relative inline-block">
          <button onClick={() => setOpen(!open)}
            className="btn-gold px-8 py-3.5 rounded-xl flex items-center gap-2 mx-auto">
            <Wallet size={16} />Connect Wallet
            <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-brand-card border border-brand-border rounded-xl overflow-hidden shadow-card z-10">
              {connectors.map((c) => (
                <button key={c.uid} onClick={() => { connect({ connector: c }); setOpen(false) }}
                  className="w-full px-4 py-3 text-sm text-brand-muted hover:text-white hover:bg-brand-gold/10 transition-colors text-left border-b border-brand-border last:border-0">
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
