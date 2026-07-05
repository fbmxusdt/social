import { NavLink, Navigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import {
  LayoutDashboard, UserPlus, Layers, Coins, TrendingDown, ArrowDownCircle, Users, RefreshCw,
} from 'lucide-react'
import { BSC_CHAIN_ID } from '../config/wagmi'
import { useUserData } from '../hooks/useUserData'
import ConnectPrompt from './ConnectPrompt'
import WrongNetworkBanner from './WrongNetworkBanner'

const STEPS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/register', label: 'Register', icon: UserPlus },
  { to: '/activate', label: 'Activate', icon: Layers },
  { to: '/fbmx',     label: 'FBMX',     icon: Coins },
  { to: '/collect',  label: 'Collect',  icon: TrendingDown },
  { to: '/withdraw', label: 'Withdraw', icon: ArrowDownCircle },
  { to: '/tree',     label: 'Genealogy', icon: Users },
]

// Shared shell for the registered-flow pages. Handles connect / wrong-network /
// not-registered gating, renders the step nav + read-only AccountSummary, and
// passes the batched useUserData() result to `children` (render-prop) so the
// page body and the summary share a single set of reads.
export default function FlowLayout({ children, title, subtitle, requireRegistered = true }) {
  const { address, isConnected, chain } = useAccount()
  const data = useUserData()
  const { isRegistered, refetch, isLoading } = data

  if (!isConnected) return <div className="pt-16"><ConnectPrompt /></div>
  if (isConnected && chain?.id !== BSC_CHAIN_ID) return <div className="pt-16"><WrongNetworkBanner /></div>
  if (requireRegistered && !isRegistered) return <Navigate to="/register" replace />

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-black text-2xl text-white">{title}</h1>
            {subtitle && <p className="text-brand-muted text-sm mt-1">{subtitle}</p>}
            <p className="text-brand-muted text-xs mt-1 font-mono">
              {address?.slice(0, 8)}…{address?.slice(-6)}
              {isRegistered && (
                <span className="ml-3 px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-[11px] border border-brand-green/20 font-sans">
                  ✓ Registered
                </span>
              )}
            </p>
          </div>
          <button onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-border hover:border-brand-gold/30 bg-brand-surface hover:bg-brand-card transition-all text-sm text-brand-muted hover:text-white">
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar: step nav */}
          <div className="lg:col-span-1 space-y-4 hidden">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-2 space-y-1">
              {STEPS.filter(({ to }) => !(to === '/register' && isRegistered)).map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${isActive
                      ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                      : 'text-brand-muted hover:text-white hover:bg-brand-surface'
                    }`}>
                  <Icon size={15} />
                  <span className="flex-1">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-4 sm:p-6 min-h-[420px]">
              {typeof children === 'function' ? children(data) : children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
