import { useNavigate } from 'react-router-dom'
import FlowLayout from '../components/FlowLayout'
import RegisterPanel from '../components/dashboard/RegisterPanel'

// Register if the wallet isn't a member yet. RegisterPanel also renders the
// referral card when already registered, so this page doubles as "My Referral".
export default function Register() {
  const navigate = useNavigate()
  return (
    <FlowLayout requireRegistered={false} title="Register" subtitle="Enter a sponsor address and choose your binary placement.">
      {(d) => (
        <RegisterPanel
          isRegistered={d.isRegistered}
          user={d.user}
          usdtBalanceRaw={d.usdtBalanceRaw}
          onSuccess={() => { d.refetch(); navigate('/activate') }}
        />
      )}
    </FlowLayout>
  )
}
