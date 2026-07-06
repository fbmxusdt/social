import FlowLayout from '../components/FlowLayout'
import { WithdrawPanel } from '../components/dashboard/CollectWithdrawPanels'

// Withdraw USDT using a fixed tier amount unlocked by rank level.
export default function Withdraw() {
  return (
    <FlowLayout title="Withdraw" subtitle="Withdraw a fixed tier amount based on your rank. 24h cooldown · 0.05 FBMX fee.">
      {(d) => (
        <WithdrawPanel
          user={d.user}
          withdrawCooldownEnds={d.withdrawCooldownEnds}
          globalCooldownEnds={d.globalCooldownEnds}
          txCooldownSecs={d.txCooldownSecs}
          onSuccess={d.refetch}
        />
      )}
    </FlowLayout>
  )
}
