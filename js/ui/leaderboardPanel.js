const formatter = new Intl.NumberFormat("en-US");

/**
 * Renders the top-pushers list. If the local user's click count would place
 * them on the board, they're merged in and highlighted as "YOU" - a taste of
 * what a real connected leaderboard will feel like once core/api.js talks to
 * a backend.
 */
export function renderLeaderboard(listEl, entries, userClicks) {
  const combined = [...entries];
  if (userClicks > 0) {
    combined.push({ name: "YOU", clicks: userClicks, isUser: true });
  }
  combined.sort((a, b) => b.clicks - a.clicks);

  listEl.innerHTML = combined
    .slice(0, 8)
    .map((entry, index) => {
      const rank = index + 1;
      return `
        <li class="leaderboard__row${entry.isUser ? " leaderboard__row--you" : ""}">
          <span class="leaderboard__rank">#${rank}</span>
          <span class="leaderboard__name">${entry.name}</span>
          <span class="leaderboard__clicks">${formatter.format(entry.clicks)}</span>
        </li>
      `;
    })
    .join("");
}
