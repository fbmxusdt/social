import FlowLayout from '../components/FlowLayout'
import FbmxDepositPanel from '../components/dashboard/FbmxDepositPanel'

// FBMX approval + deposit. Funds the in-contract tokenBalance that every
// collect/withdraw burns 0.05 FBMX from.
export default function Fbmx() {
  return (
    <FlowLayout title="FBMX Balance" subtitle="Deposit FBMX to cover the 0.05 FBMX fee charged on every collect and withdrawal.">
      {(d) => (
        <FbmxDepositPanel
          fbmxBalance={d.fbmxBalance}
          fbmxBalanceRaw={d.fbmxBalanceRaw}
          fbmxAllowanceRaw={d.fbmxAllowanceRaw}
          onSuccess={d.refetch}
        />
      )}
    </FlowLayout>
  )
}
