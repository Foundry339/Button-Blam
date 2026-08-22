// Rare piñata: swings down above the button, hangs and sways, shakes with
// anticipation, then cracks open in a shower of candy. Pure eye candy - no
// power-up, just a fun "jackpot" moment. Same shape as the golden egg
// sequence, but bigger and a beat slower so it reads as a bigger deal.

const MAX_ACTIVE_PINATAS = 1;
const PINATA_EMOJI = "\u{1FA85}";
const CANDY_EMOJI = ["\u{1F36C}", "\u{1F36D}", "\u{1F36B}"];

const MIN_CANDY = 26;
const MAX_CANDY = 36;

let activePinatas = 0;

/**
 * Roll the dice; spawn the piñata sequence near the button if it hits.
 * Returns whether it fired.
 */
export function maybeSpawnPinata(stageEl, buttonEl, chance = 1 / 2500) {
  if (activePinatas >= MAX_ACTIVE_PINATAS) return false;
  if (Math.random() > chance) return false;
  spawnPinataSequence(stageEl, buttonEl);
  return true;
}

function spawnPinataSequence(stageEl, buttonEl) {
  activePinatas += 1;
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left - stageRect.left + buttonRect.width / 2;
  const size = buttonRect.width * 0.28;

  // Hang it just above the button, but never push it past the headroom
  // actually available above the stage - on narrow mobile layouts there's
  // only a few px of padding there, so a fixed fraction of button height
  // can shove it up into the subtitle text above.
  const headroom = buttonRect.top - stageRect.top;
  const desiredOffset = buttonRect.height * 0.2;
  const maxOffset = Math.max(headroom - size / 2 - 4, 0);
  const offset = Math.min(desiredOffset, maxOffset);
  const restY = buttonRect.top - stageRect.top - offset;

  const pinata = document.createElement("div");
  pinata.className = "pinata";
  pinata.setAttribute("aria-hidden", "true");
  pinata.textContent = PINATA_EMOJI;
  pinata.style.left = `${centerX}px`;
  pinata.style.top = `${restY}px`;
  pinata.style.fontSize = `${size}px`;
  stageEl.appendChild(pinata);
  requestAnimationFrame(() => pinata.classList.add("is-dropping"));

  // Gentle hanging sway once it's dropped in.
  window.setTimeout(() => {
    pinata.classList.remove("is-dropping");
    pinata.classList.add("is-swaying");
  }, 700);

  // Shake builds anticipation before the crack (mirrors the egg's beat).
  window.setTimeout(() => {
    pinata.classList.remove("is-swaying");
    pinata.classList.add("is-shaking");
  }, 1700);

  window.setTimeout(() => {
    pinata.classList.remove("is-shaking");
    pinata.classList.add("is-cracking");
    spawnCandyBurst(stageEl, centerX, restY);
  }, 2500);

  window.setTimeout(() => {
    pinata.remove();
    activePinatas = Math.max(0, activePinatas - 1);
  }, 3000);
}

function spawnCandyBurst(stageEl, centerX, centerY) {
  // Candy shouldn't fly up past the top of the stage (into the subtitle
  // above it) - clamp how far up a piece is allowed to burst based on how
  // much room is actually above the crack point.
  const maxUpward = Math.max(centerY - 12, 0);
  const count = MIN_CANDY + Math.floor(Math.random() * (MAX_CANDY - MIN_CANDY + 1));
  for (let i = 0; i < count; i++) {
    spawnCandy(stageEl, centerX, centerY, maxUpward);
  }
}

function spawnCandy(stageEl, centerX, centerY, maxUpward) {
  const candy = document.createElement("span");
  candy.className = "candy-particle";
  candy.textContent = CANDY_EMOJI[Math.floor(Math.random() * CANDY_EMOJI.length)];
  candy.setAttribute("aria-hidden", "true");

  // Burst outward and slightly up first, then gravity takes over and pulls
  // it down further as it fades - reads as spilling, not just radiating.
  const angle = Math.PI + Math.random() * Math.PI; // upper hemisphere, in radians
  const burstDistance = 90 + Math.random() * 160;
  const burstX = Math.cos(angle) * burstDistance;
  const burstY = Math.max(Math.sin(angle) * burstDistance, -maxUpward);
  const fallX = burstX + (Math.random() * 2 - 1) * 110;
  const fallY = burstY + 520 + Math.random() * 360;
  const rotate = (Math.random() < 0.5 ? -1 : 1) * (240 + Math.random() * 360);
  const duration = 1700 + Math.random() * 900;
  const size = 20 + Math.random() * 16;

  candy.style.left = `${centerX}px`;
  candy.style.top = `${centerY}px`;
  candy.style.fontSize = `${size}px`;
  candy.style.animationDuration = `${duration}ms`;
  candy.style.setProperty("--candy-bx", `${burstX}px`);
  candy.style.setProperty("--candy-by", `${burstY}px`);
  candy.style.setProperty("--candy-fx", `${fallX}px`);
  candy.style.setProperty("--candy-fy", `${fallY}px`);
  candy.style.setProperty("--candy-rot", `${rotate}deg`);

  stageEl.appendChild(candy);
  candy.addEventListener("animationend", () => candy.remove(), { once: true });
}
