import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect, useSwitchChain, useReadContract } from 'wagmi'
import { BSC_CHAIN_ID } from '../config/wagmi'
import { FBMXDAO_ADDRESS, FBMXDAO_ABI } from '../config/contracts'
import {
  LayoutDashboard, UserPlus, Layers, Coins, TrendingDown, ArrowDownCircle, Users,
  Menu, X, ChevronDown, AlertTriangle, Wallet,
} from 'lucide-react'

function shortAddr(addr) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : ''
}

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/register', label: 'Register', icon: UserPlus },
  { to: '/activate', label: 'Activate', icon: Layers },
  { to: '/fbmx',     label: 'FBMX',     icon: Coins },
  { to: '/collect',  label: 'Collect',  icon: TrendingDown },
  { to: '/withdraw', label: 'Withdraw', icon: ArrowDownCircle },
  { to: '/tree',     label: 'Genealogy', icon: Users },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [menuOpen, setMenuOpen] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)

  const wrongNetwork = isConnected && chain?.id !== BSC_CHAIN_ID

  // Hide the Register link once the wallet is a member.
  const { data: isRegistered } = useReadContract({
    address: FBMXDAO_ADDRESS, abi: FBMXDAO_ABI, functionName: 'isUser', args: [address],
    query: { enabled: !!address && isConnected, staleTime: 10000 },
  })
  const navLinks = NAV_LINKS.filter(({ to }) => !(to === '/register' && isRegistered))

  // Close menus on navigation for clean state.
  useEffect(() => {
    setMenuOpen(false)
    setWalletOpen(false)
  }, [pathname])

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${
      isActive
        ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
        : 'text-brand-muted hover:text-white hover:bg-white/5'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border bg-brand-dark/90 backdrop-blur-xl pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="font-display font-800 text-brand-dark text-sm">F</span>
            </div>
            <span className="font-display font-bold text-xl text-white group-hover:text-brand-gold transition-colors">
              FBMX<span className="text-brand-gold">SOCIAL</span>
            </span>
          </Link>

          {/* Desktop nav — flow steps (only useful once connected) */}
          {isConnected && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={linkClass}>
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Wallet */}
          <div className="flex items-center gap-3">
            {wrongNetwork && (
              <button
                onClick={() => switchChain({ chainId: BSC_CHAIN_ID })}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-red/10 border border-brand-red/30 text-brand-red text-sm font-semibold hover:bg-brand-red/20 transition-all"
              >
                <AlertTriangle size={12} />
                Switch to BSC
              </button>
            )}

            {!isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setWalletOpen(!walletOpen)}
                  title="Connect Wallet"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brand-border hover:border-brand-gold/30 bg-brand-surface hover:bg-brand-card transition-all"
                >
                  <Wallet size={16} className="text-brand-gold" />
                  <ChevronDown size={14} className={`text-brand-muted transition-transform ${walletOpen ? 'rotate-180' : ''}`} />
                </button>
                {walletOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-brand-card border border-brand-border rounded-xl shadow-card overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-brand-border text-xs font-semibold text-brand-muted uppercase tracking-wider">
                      Connect Wallet
                    </div>
                    {connectors.map((connector) => (
                      <button
                        key={connector.uid}
                        onClick={() => { connect({ connector }); setWalletOpen(false) }}
                        className="w-full px-4 py-3 text-left text-base hover:bg-brand-gold/10 hover:text-brand-gold transition-colors text-brand-muted border-b border-brand-border last:border-0"
                      >
                        {connector.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setWalletOpen(!walletOpen)}
                  title={shortAddr(address)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brand-border hover:border-brand-gold/30 bg-brand-surface hover:bg-brand-card transition-all"
                >
                  <Wallet size={16} className="text-brand-gold" />
                  <ChevronDown size={14} className={`text-brand-muted transition-transform ${walletOpen ? 'rotate-180' : ''}`} />
                </button>
                {walletOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-brand-card border border-brand-border rounded-xl shadow-card overflow-hidden">
                    {/* Connected address */}
                    <div className="px-4 py-3 border-b border-brand-border flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse flex-shrink-0" />
                      <span className="font-mono text-sm text-white truncate">{shortAddr(address)}</span>
                    </div>
                    {/* Disconnect link */}
                    <button
                      onClick={() => { disconnect(); setWalletOpen(false) }}
                      className="w-full px-4 py-3 text-left text-base hover:bg-brand-red/10 hover:text-brand-red transition-colors text-brand-muted"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            {isConnected && (
              <button
                className="md:hidden p-2 text-brand-muted hover:text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && isConnected && (
        <div className="md:hidden border-t border-brand-border bg-brand-surface px-4 py-3 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive ? 'bg-brand-gold/10 text-brand-gold' : 'text-brand-muted hover:text-white'
                }`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          {wrongNetwork && (
            <button
              onClick={() => { switchChain({ chainId: BSC_CHAIN_ID }); setMenuOpen(false) }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-base font-semibold text-brand-red bg-brand-red/10"
            >
              <AlertTriangle size={14} />
              Switch to BSC Network
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
