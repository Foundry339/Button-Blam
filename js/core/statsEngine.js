// Persisted personal statistics: total clicks, daily streak, and the best
// single-session click count. Session click count itself lives in memory
// (main.js) since it should reset on every fresh page load.
import { loadState, saveState } from "./storage.js";

const KEY = "stats";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultStats() {
  return {
    totalClicks: 0,
    highestSessionClicks: 0,
    currentStreak: 0,
    lastClickDate: null,
  };
}

export function loadStats() {
  return { ...defaultStats(), ...loadState(KEY, {}) };
}

function persist(stats) {
  saveState(KEY, stats);
}

/**
 * Call once per app load, before any clicks happen, to roll the daily streak
 * forward based on today's date vs. the last recorded click date.
 */
export function refreshStreakForNewSession(stats) {
  const today = todayISO();
  if (stats.lastClickDate === today) {
    // Already clicked today — streak stands as-is until the next click.
    return stats;
  }
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  if (stats.lastClickDate === yesterday) {
    // Streak continues once they click today; don't increment yet.
    return stats;
  }
  if (stats.lastClickDate !== null) {
    // Gap of 2+ days (or first click ever aside): streak broken.
    stats.currentStreak = 0;
  }
  return stats;
}

/**
 * Apply a click delta to persisted totals and streak bookkeeping.
 * @param {ReturnType<typeof loadStats>} stats
 * @param {number} delta
 * @param {number} sessionClicksAfter total clicks so far *this session*
 */
export function applyClick(stats, delta, sessionClicksAfter) {
  const today = todayISO();
  stats.totalClicks += delta;
  if (stats.lastClickDate !== today) {
    stats.currentStreak += 1;
    stats.lastClickDate = today;
  }
  if (sessionClicksAfter > stats.highestSessionClicks) {
    stats.highestSessionClicks = sessionClicksAfter;
  }
  persist(stats);
  return stats;
}
