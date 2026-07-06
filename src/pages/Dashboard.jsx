import FlowLayout from '../components/FlowLayout'
import AccountSummary from '../components/AccountSummary'

// Dedicated page for the read-only account summary. The summary used to live in
// the FlowLayout sidebar on every step; it now has its own route so the other
// pages stay focused on their single action.
export default function Dashboard() {
  return (
    <FlowLayout title="Dashboard" subtitle="Your account summary at a glance.">
      {(d) => (
        <AccountSummary
          user={d.user}
          passivePercentage={d.passivePercentage}
          usdtBalance={d.usdtBalance}
          fbmxBalance={d.fbmxBalance}
          isPassiveCooldown={d.isPassiveCooldown}
          passiveCooldownEnds={d.passiveCooldownEnds}
          isBinaryCooldown={d.isBinaryCooldown}
          binaryCooldownEnds={d.binaryCooldownEnds}
          withdrawCooldownEnds={d.withdrawCooldownEnds}
          globalCooldownEnds={d.globalCooldownEnds}
          txCooldownSecs={d.txCooldownSecs}
        />
      )}
    </FlowLayout>
  )
}
