const formatter = new Intl.NumberFormat("en-US");

/**
 * @param {{total: HTMLElement, streak: HTMLElement, highestSession: HTMLElement, achievements: HTMLElement}} els
 */
export function renderPersonalStats(els, stats, unlockedCount) {
  els.total.textContent = formatter.format(stats.totalClicks);
  els.streak.textContent = `${formatter.format(stats.currentStreak)} day${stats.currentStreak === 1 ? "" : "s"}`;
  els.highestSession.textContent = formatter.format(stats.highestSessionClicks);
  els.achievements.textContent = formatter.format(unlockedCount);
}
