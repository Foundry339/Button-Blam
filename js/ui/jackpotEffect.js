// Rare jackpot: a mini slot machine appears above the button, reels spin
// through classic symbols, and land on 7-7-7 in a shower of coins. Pure eye
// candy - no power-up. Reuses the milestone money rain for the coin shower,
// same visual as a big milestone hit, but independently rollable per click.
import { spawnMoneyRain } from "./moneyRainEffect.js";

const MAX_ACTIVE_JACKPOTS = 1;
const REEL_SYMBOLS = ["\u{1F352}", "\u{1F34B}", "\u{1F34A}", "\u{1F347}", "\u{1F48E}", "\u{1F514}", "\u{2B50}"];
const JACKPOT_SYMBOL = "7\u{FE0F}\u{20E3}"; // 7️⃣
const SPIN_INTERVAL_MS = 80;
const STOP_TIMES_MS = [900, 1300, 1700];

let activeJackpots = 0;

/**
 * Roll the dice; spawn the jackpot sequence near the button if it hits.
 * Returns whether it fired.
 */
export function maybeSpawnJackpot(stageEl, buttonEl, chance = 1 / 2200) {
  if (activeJackpots >= MAX_ACTIVE_JACKPOTS) return false;
  if (Math.random() > chance) return false;
  spawnJackpotSequence(stageEl, buttonEl);
  return true;
}

function spawnJackpotSequence(stageEl, buttonEl) {
  activeJackpots += 1;
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left - stageRect.left + buttonRect.width / 2;
  const size = buttonRect.width * 0.22;

  // Same headroom-aware positioning as the piñata - the machine (reels +
  // label) is roughly 1.2x the reel size tall, so clamp against half that
  // so it never gets pushed up into the subtitle on tight mobile layouts.
  const halfHeight = size * 0.6;
  const headroom = buttonRect.top - stageRect.top;
  const desiredOffset = buttonRect.height * 0.28;
  const maxOffset = Math.max(headroom - halfHeight - 4, 0);
  const offset = Math.min(desiredOffset, maxOffset);
  const restY = buttonRect.top - stageRect.top - offset;

  const machine = document.createElement("div");
  machine.className = "jackpot-machine";
  machine.setAttribute("aria-hidden", "true");
  machine.style.left = `${centerX}px`;
  machine.style.top = `${restY}px`;
  machine.style.setProperty("--jackpot-size", `${size}px`);

  const reelsEl = document.createElement("div");
  reelsEl.className = "jackpot-reels";
  const reels = [0, 1, 2].map(() => {
    const reel = document.createElement("span");
    reel.className = "jackpot-reel";
    reel.textContent = REEL_SYMBOLS[Math.floor(Math.random() * REEL_SYMBOLS.length)];
    reelsEl.appendChild(reel);
    return reel;
  });
  machine.appendChild(reelsEl);

  const label = document.createElement("span");
  label.className = "jackpot-label";
  label.textContent = "JACKPOT!";
  machine.appendChild(label);

  stageEl.appendChild(machine);
  requestAnimationFrame(() => machine.classList.add("is-active"));

  // Spin each reel through random symbols, then stop them one at a time,
  // left to right, each landing on 7 - classic slot-machine anticipation.
  const spinIntervals = reels.map((reel) =>
    window.setInterval(() => {
      reel.textContent = REEL_SYMBOLS[Math.floor(Math.random() * REEL_SYMBOLS.length)];
    }, SPIN_INTERVAL_MS)
  );

  reels.forEach((reel, i) => {
    window.setTimeout(() => {
      window.clearInterval(spinIntervals[i]);
      reel.textContent = JACKPOT_SYMBOL;
      reel.classList.add("is-locked");
    }, STOP_TIMES_MS[i]);
  });

  const wonAt = STOP_TIMES_MS[STOP_TIMES_MS.length - 1] + 150;
  window.setTimeout(() => {
    machine.classList.add("is-won");
    spawnMoneyRain();
  }, wonAt);

  window.setTimeout(() => {
    machine.remove();
    activeJackpots = Math.max(0, activeJackpots - 1);
  }, wonAt + 1800);
}
