// Disco ball power-up: a rare disco ball sighting drops in above the
// button with a spin and a shimmer, then the next 50 clicks each guarantee
// a strobe of colored light beams flashing out from behind the button.
// Mirrors the tropical fish/bubble and storm cloud/lightning power-ups.

const DISCO_CHANCE = 1 / 5500;
export const DISCO_POWER_UP_CLICKS = 50;

const DISCO_EMOJI = "\u{1FAA9}";
const BEAM_COLORS = ["#f472b6", "#3fa9ff", "#fbbf24", "#a855f7", "#ff4d5e", "#22c55e"];

const MIN_BEAMS = 6;
const MAX_BEAMS = 9;

/** Roll the dice for a disco ball sighting. Returns whether it hit. */
export function maybeTriggerDiscoPowerUp(chance = DISCO_CHANCE) {
  return Math.random() < chance;
}

/**
 * One-off disco ball that drops in above the button, spins, and shimmers,
 * then dissipates. Viewport-anchored like the fish/storm reveals, so it
 * looks right regardless of where the button sits in the page layout.
 */
export function spawnDiscoBallReveal(buttonEl) {
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height * 0.2;
  const size = buttonRect.width * 0.6;
  const duration = 2200;

  const ball = document.createElement("div");
  ball.className = "disco-ball";
  ball.setAttribute("aria-hidden", "true");
  ball.textContent = DISCO_EMOJI;

  ball.style.left = `${centerX}px`;
  ball.style.top = `${centerY}px`;
  ball.style.width = `${size}px`;
  ball.style.height = `${size}px`;
  ball.style.fontSize = `${size * 0.85}px`;
  ball.style.setProperty("--disco-duration", `${duration}ms`);

  document.body.appendChild(ball);
  requestAnimationFrame(() => ball.classList.add("is-dropping-in"));
  window.setTimeout(() => ball.remove(), duration);
}

/**
 * Guaranteed strobe of colored beams flashing out from behind the button.
 * Beams sit at a lower z-index than the button (see .main-button in
 * styles.css) so the button visually blocks their center, leaving only the
 * parts poking out past its edges visible - reads as light escaping from
 * behind it rather than particles flying around it.
 */
export function spawnStrobeBurst(stageEl, buttonEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left - stageRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top - stageRect.top + buttonRect.height / 2;
  const beamLength = buttonRect.width * 0.95;

  const count = MIN_BEAMS + Math.floor(Math.random() * (MAX_BEAMS - MIN_BEAMS + 1));
  const baseAngle = Math.random() * 360;
  for (let i = 0; i < count; i++) {
    const angle = baseAngle + (360 / count) * i + (Math.random() * 12 - 6);
    spawnBeam(stageEl, centerX, centerY, angle, beamLength);
  }
}

function spawnBeam(stageEl, centerX, centerY, angle, length) {
  const beam = document.createElement("span");
  beam.className = "disco-beam";
  beam.setAttribute("aria-hidden", "true");

  const color = BEAM_COLORS[Math.floor(Math.random() * BEAM_COLORS.length)];
  const thickness = 5 + Math.random() * 5;
  const duration = 260 + Math.random() * 180;

  beam.style.left = `${centerX}px`;
  beam.style.top = `${centerY}px`;
  beam.style.width = `${length}px`;
  beam.style.height = `${thickness}px`;
  beam.style.background = color;
  beam.style.animationDuration = `${duration}ms`;
  beam.style.setProperty("--beam-angle", `${angle}deg`);

  stageEl.appendChild(beam);
  beam.addEventListener("animationend", () => beam.remove(), { once: true });
}
