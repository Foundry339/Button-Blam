import { TEAMS } from "../config/teams.js";

const formatter = new Intl.NumberFormat("en-US");

/**
 * @param {{yourTeam: HTMLElement, redCount: HTMLElement, blueCount: HTMLElement,
 *   redBar: HTMLElement, blueBar: HTMLElement, card: HTMLElement}} els
 */
export function renderTeamWar(els, redTotal, blueTotal, userTeam) {
  const total = redTotal + blueTotal || 1;
  const redPct = (redTotal / total) * 100;
  const bluePct = 100 - redPct;

  els.redCount.textContent = formatter.format(redTotal);
  els.blueCount.textContent = formatter.format(blueTotal);
  els.redBar.style.width = `${redPct}%`;
  els.blueBar.style.width = `${bluePct}%`;

  const team = TEAMS[userTeam];
  els.yourTeam.textContent = `${team.emoji} You're on Team ${team.name}`;
  els.card.classList.toggle("team-card--red", userTeam === "red");
  els.card.classList.toggle("team-card--blue", userTeam === "blue");
}
