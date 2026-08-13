// Mock "everyone in the world" statistics.
// core/api.js is the seam where this gets swapped for a real API response —
// nothing in ui/globalStatsPanel.js needs to change when that happens.
export const MOCK_GLOBAL_STATS = {
  totalClicksAllTime: 18_492_731,
  clicksToday: 427_821,
};

// Mock starting totals for the two Button War teams.
export const MOCK_TEAM_TOTALS = {
  red: 2_381_422,
  blue: 2_376_912,
};
