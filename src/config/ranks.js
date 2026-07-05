// ─── Rank labels & colors ─────────────────────────────────────────────────────
// Single source of truth for rank display. Indices 0–15 map to affiliate.level.
// Levels 0–15: Registered → Initiate → … → Fortress → Emperor.

export const RANK_COLORS = [
  '#6B7280', '#CD7F32', '#C0C0C0', '#F5A623', '#E5E4E2', '#00D4AA',
  '#3B82F6', '#A855F7', '#EC4899', '#F97316', '#EF4444', '#8B5CF6', '#06B6D4', '#F59E0B', '#F5A623', '#FFD700',
]

export const RANK_LABELS = [
  'Registered', 'Initiate', 'Scout', 'Pioneer', 'Challenger', 'Builder',
  'Trailblazer', 'Guardian', 'Commander', 'Vanguard', 'Warlord', 'Sovereign', 'Archon', 'Titan', 'Fortress', 'Emperor',
]
