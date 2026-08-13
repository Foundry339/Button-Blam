// Renders the "everyone on the site" numbers. Data currently comes from
// core/api.js's mock resolvers; once a real backend exists, swap those and
// this file keeps working unchanged.
const formatter = new Intl.NumberFormat("en-US");

/**
 * @param {{allTime: HTMLElement, today: HTMLElement}} els
 */
export function renderGlobalStats(els, { totalClicksAllTime, clicksToday }) {
  els.allTime.textContent = formatter.format(totalClicksAllTime);
  els.today.textContent = formatter.format(clicksToday);
}

/**
 * Purely cosmetic "the world is still clicking" ticker: nudges the numbers
 * up by a small random amount every few seconds. Not persisted — it's just
 * ambience for the mock data, and gets replaced by real polling later.
 */
export function startAmbientTicker(els, stats) {
  return window.setInterval(() => {
    stats.totalClicksAllTime += Math.floor(Math.random() * 40) + 5;
    stats.clicksToday += Math.floor(Math.random() * 15) + 1;
    renderGlobalStats(els, stats);
  }, 4000);
}
