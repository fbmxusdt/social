import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAddress } from 'viem'
import Navbar from './components/Navbar'
import Connect from './pages/Connect'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Activate from './pages/Activate'
import Fbmx from './pages/Fbmx'
import Collect from './pages/Collect'
import Withdraw from './pages/Withdraw'
import Tree from './pages/Tree'

const REFERRER_KEY = 'fbmx_referrer'

// Captures ?ref=0x... from any URL into localStorage.
// Runs on every navigation so a new referral link always overwrites the old one.
function ReferralCapture() {
  const location = useLocation()
  useEffect(() => {
    const ref = new URLSearchParams(location.search).get('ref')
    if (ref && isAddress(ref)) {
      localStorage.setItem(REFERRER_KEY, ref)
    }
  }, [location.search])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-brand-dark font-body">
      <ReferralCapture />
      <Navbar />
      <Routes>
        <Route path="/"          element={<Connect />}   />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register"  element={<Register />}  />
        <Route path="/activate" element={<Activate />} />
        <Route path="/fbmx"     element={<Fbmx />}     />
        <Route path="/collect"  element={<Collect />}  />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/tree"     element={<Tree />}     />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
