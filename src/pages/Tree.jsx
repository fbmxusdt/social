import { useAccount } from 'wagmi'
import FlowLayout from '../components/FlowLayout'
import GenealogyTree from '../components/dashboard/GenealogyTree'

// Genealogy explorer: binary tree (left/right placement) + affiliate referral tree.
export default function Tree() {
  const { address } = useAccount()
  return (
    <FlowLayout title="Genealogy" subtitle="Explore your binary placement tree and affiliate referral network.">
      {() => <GenealogyTree address={address} />}
    </FlowLayout>
  )
}
