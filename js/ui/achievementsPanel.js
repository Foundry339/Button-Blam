const formatter = new Intl.NumberFormat("en-US");

/** Renders the full grid of milestones, locked and unlocked. */
export function renderAchievementsGrid(gridEl, milestones, unlockedSet) {
  gridEl.innerHTML = milestones
    .map((m) => {
      const unlocked = unlockedSet.has(m.id);
      return `
        <li class="achievement-badge${unlocked ? " is-unlocked" : ""}" title="${m.title} — ${formatter.format(m.threshold)} clicks">
          <span class="achievement-badge__icon">${unlocked ? "\u{1F3C6}" : "\u{1F512}"}</span>
          <span class="achievement-badge__title">${m.title}</span>
          <span class="achievement-badge__threshold">${formatter.format(m.threshold)}</span>
        </li>
      `;
    })
    .join("");
}
