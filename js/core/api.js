// Future-backend seam. Everything here currently resolves mock/local data
// synchronously-ish (wrapped in Promise.resolve so callers already treat it
// as async). To connect a real backend later, replace the bodies of these
// functions with fetch() calls to your API — nothing calling them needs to
// change shape, since they already return Promises of the same shapes.
import { MOCK_GLOBAL_STATS, MOCK_TEAM_TOTALS } from "../config/globalStatsMock.js";
import { MOCK_LEADERBOARD } from "../config/leaderboardMock.js";

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

/**
 * Fetch the top leaderboard entries.
 * Real version: `return fetch('/api/leaderboard').then(r => r.json())`
 */
export function fetchLeaderboard() {
  return Promise.resolve([...MOCK_LEADERBOARD]);
}

/**
 * Batch-submit a user's local click delta to the server. Intentionally not
 * called anywhere yet — the MVP keeps all clicking client-side and local
 * (see core/clickEngine.js). When a backend exists, call this periodically
 * (e.g. every N clicks or every few seconds) instead of on every click.
 * Real version: `return fetch('/api/clicks', { method: 'POST', body: ... })`
 * @param {{ delta: number, team: string | null }} _payload
 */
export function submitClickBatch(_payload) {
  return Promise.resolve({ ok: true });
}
