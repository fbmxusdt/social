import FlowLayout from '../components/FlowLayout'
import { CollectPassivePanel, CollectBinaryPanel } from '../components/dashboard/CollectWithdrawPanels'

// Collect passive + collect binary rewards on one page.
export default function Collect() {
  return (
    <FlowLayout title="Collect Rewards" subtitle="Claim daily passive income and weaker-leg binary volume. Each collect burns 0.05 FBMX.">
      {(d) => (
        <div className="grid lg:grid-cols-2 gap-5">
          <CollectPassivePanel
            user={d.user}
            passiveCooldownEnds={d.passiveCooldownEnds}
            globalCooldownEnds={d.globalCooldownEnds}
            txCooldownSecs={d.txCooldownSecs}
            onSuccess={d.refetch}
          />
          <CollectBinaryPanel
            user={d.user}
            binaryCooldownEnds={d.binaryCooldownEnds}
            globalCooldownEnds={d.globalCooldownEnds}
            txCooldownSecs={d.txCooldownSecs}
            onSuccess={d.refetch}
          />
        </div>
      )}
    </FlowLayout>
  )
}
