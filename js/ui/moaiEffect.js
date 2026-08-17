// Moai power-up: a rare moai sighting grows rapidly and slams onto the
// button before vanishing, then the next 25 clicks each guarantee a punch
// impact wherever the button gets clicked. Mirrors the tropical fish/bubble,
// storm cloud/lightning, and disco ball/strobe power-ups.

const MOAI_CHANCE = 1 / 6000;
export const MOAI_POWER_UP_CLICKS = 25;

const MOAI_EMOJI = "\u{1F5FF}";
const IMPACT_EMOJI = "\u{1F4A5}";

/** Roll the dice for a moai sighting. Returns whether it hit. */
export function maybeTriggerMoaiPowerUp(chance = MOAI_CHANCE) {
  return Math.random() < chance;
}

/**
 * One-off moai that starts small, grows rapidly, slams onto the button,
 * and vanishes. Viewport-anchored like the fish/storm/disco reveals, so it
 * lands right on the button regardless of page layout.
 */
export function spawnMoaiSlamReveal(buttonEl) {
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height / 2;
  const size = buttonRect.width;
  const duration = 1400;

  const moai = document.createElement("div");
  moai.className = "moai-slam";
  moai.setAttribute("aria-hidden", "true");
  moai.textContent = MOAI_EMOJI;

  moai.style.left = `${centerX}px`;
  moai.style.top = `${centerY}px`;
  moai.style.width = `${size}px`;
  moai.style.height = `${size}px`;
  moai.style.fontSize = `${size * 0.85}px`;
  moai.style.setProperty("--moai-duration", `${duration}ms`);

  document.body.appendChild(moai);
  requestAnimationFrame(() => moai.classList.add("is-slamming"));

  // The punch impact lands right as the moai actually hits the button.
  window.setTimeout(() => spawnPunchImpact(centerX, centerY), duration * 0.68);
  window.setTimeout(() => moai.remove(), duration);
}

/** Guaranteed punch impact wherever the button was clicked. */
export function spawnClickImpact(clientX, clientY) {
  spawnPunchImpact(clientX, clientY);
}

function spawnPunchImpact(x, y) {
  const impact = document.createElement("div");
  impact.className = "punch-impact";
  impact.setAttribute("aria-hidden", "true");
  impact.textContent = IMPACT_EMOJI;
  impact.style.left = `${x}px`;
  impact.style.top = `${y}px`;

  document.body.appendChild(impact);
  requestAnimationFrame(() => impact.classList.add("is-bursting"));

  window.setTimeout(() => impact.remove(), 340);
}
