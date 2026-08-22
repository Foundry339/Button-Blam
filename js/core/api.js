// Future-backend seam. Stats/teams still resolve mock data
// synchronously-ish (wrapped in Promise.resolve so callers already treat it
// as async); the leaderboard and score submission now hit the real API
// routes in /api. To connect the remaining mocks later, replace the bodies
// of those functions with fetch() calls - nothing calling them needs to
// change shape, since they already return Promises of the same shapes.
import { MOCK_GLOBAL_STATS, MOCK_TEAM_TOTALS } from "../config/globalStatsMock.js";

/**
 * Fetch site-wide click totals.
 * Real version: `return fetch('/api/stats/global').then(r => r.json())`
 */
export function fetchGlobalStats() {
  return Promise.resolve({ ...MOCK_GLOBAL_STATS });
}

/**
 * Fetch current Button War team totals.
 * Real version: `return fetch('/api/teams/totals').then(r => r.json())`
 */
export function fetchTeamTotals() {
  return Promise.resolve({ ...MOCK_TEAM_TOTALS });
}

/** Fetch the top leaderboard entries. */
export function fetchLeaderboard() {
  return fetch("/api/leaderboard").then((r) => r.json());
}

/**
 * Submit the local user's final score under a chosen name. The server only
 * keeps it if it beats that name's existing high score (see api/score.js).
 * @param {{ name: string, clicks: number, startedAt: number }} payload
 */
export function submitScore(payload) {
  return fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => r.json());
}

/**
 * Batch-submit a user's local click delta to the server. Intentionally not
 * called anywhere yet - the MVP keeps all clicking client-side and local
 * (see core/clickEngine.js). This is a placeholder for a future upgrade
 * where clicks are streamed in small batches instead of submitted as one
 * final score via submitScore(), making session length/rate harder to fake.
 * Real version: `return fetch('/api/clicks', { method: 'POST', body: ... })`
 * @param {{ delta: number, team: string | null }} _payload
 */
export function submitClickBatch(_payload) {
  return Promise.resolve({ ok: true });
}
