// Storm cloud power-up: a rare storm sighting rolls a dark cloud in over
// the button with a flash of lightning, then the next 30 clicks each
// guarantee a crackle of lightning bolts around the button. Mirrors the
// tropical fish/bubble power-up in bubbleEffect.js, just reskinned.

const STORM_CHANCE = 1 / 700;
export const STORM_POWER_UP_CLICKS = 30;

const CLOUD_EMOJI = "\u{1F329}\u{FE0F}"; // cloud with lightning
const BOLT_EMOJI = "\u{26A1}";

const MIN_BOLTS = 4;
const MAX_BOLTS = 7;
const MAX_ACTIVE_BOLTS = 40;

const RAIN_EMOJI = "\u{1F4A7}";
const MIN_DROPS = 5;
const MAX_DROPS = 8;
const MAX_ACTIVE_DROPS = 50;

let activeBolts = 0;
let activeDrops = 0;

/** Roll the dice for a storm cloud sighting. Returns whether it hit. */
export function maybeTriggerStormPowerUp(chance = STORM_CHANCE) {
  return Math.random() < chance;
}

/**
 * One-off dark cloud that rolls in and settles over the button with a
 * flash of lightning, then dissipates. Viewport-anchored like the fish
 * swim-out, so it looks right regardless of where the button sits in the
 * page layout.
 */
export function spawnStormCloudReveal(buttonEl) {
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height * 0.2;
  const size = buttonRect.width * 0.85;
  const duration = 2200;

  const cloud = document.createElement("div");
  cloud.className = "storm-cloud";
  cloud.setAttribute("aria-hidden", "true");
  cloud.textContent = CLOUD_EMOJI;

  cloud.style.left = `${centerX}px`;
  cloud.style.top = `${centerY}px`;
  cloud.style.width = `${size}px`;
  cloud.style.height = `${size}px`;
  cloud.style.fontSize = `${size * 0.85}px`;
  cloud.style.setProperty("--cloud-duration", `${duration}ms`);

  document.body.appendChild(cloud);
  requestAnimationFrame(() => cloud.classList.add("is-rolling-in"));
  window.setTimeout(() => cloud.remove(), duration);
}

/** Guaranteed crackle of lightning bolts flashing around the button. */
export function spawnLightningBurst(stageEl, buttonEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left - stageRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top - stageRect.top + buttonRect.height / 2;
  const radius = buttonRect.width * 0.5;

  const count = MIN_BOLTS + Math.floor(Math.random() * (MAX_BOLTS - MIN_BOLTS + 1));
  for (let i = 0; i < count; i++) {
    if (activeBolts >= MAX_ACTIVE_BOLTS) break;
    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
    spawnLightningBolt(stageEl, centerX, centerY, angle, radius);
  }
}

function spawnLightningBolt(stageEl, centerX, centerY, angle, radius) {
  const bolt = document.createElement("span");
  bolt.className = "lightning-particle";
  bolt.textContent = BOLT_EMOJI;
  bolt.setAttribute("aria-hidden", "true");

  // Bolts crackle close around the button rather than flying outward.
  const distance = radius + Math.random() * 30;
  const x = centerX + Math.cos(angle) * distance;
  const y = centerY + Math.sin(angle) * distance;
  const duration = 320 + Math.random() * 220;
  const size = 16 + Math.random() * 14;
  const rotate = Math.random() * 40 - 20;

  bolt.style.left = `${x}px`;
  bolt.style.top = `${y}px`;
  bolt.style.fontSize = `${size}px`;
  bolt.style.animationDuration = `${duration}ms`;
  bolt.style.setProperty("--bolt-rotate", `${rotate}deg`);

  stageEl.appendChild(bolt);
  activeBolts += 1;
  bolt.addEventListener(
    "animationend",
    () => {
      bolt.remove();
      activeBolts = Math.max(0, activeBolts - 1);
    },
    { once: true }
  );
}

/** A few raindrops falling past the button, alongside each lightning crackle. */
export function spawnRainDrizzle(stageEl, buttonEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left - stageRect.left + buttonRect.width / 2;
  const topY = buttonRect.top - stageRect.top - buttonRect.height * 0.35;
  const horizontalSpread = buttonRect.width * 0.6;
  const fallDistance = buttonRect.height * 1.6;

  const count = MIN_DROPS + Math.floor(Math.random() * (MAX_DROPS - MIN_DROPS + 1));
  for (let i = 0; i < count; i++) {
    if (activeDrops >= MAX_ACTIVE_DROPS) break;
    spawnRainDrop(stageEl, centerX, topY, horizontalSpread, fallDistance);
  }
}

function spawnRainDrop(stageEl, centerX, topY, horizontalSpread, fallDistance) {
  const drop = document.createElement("span");
  drop.className = "rain-particle";
  drop.textContent = RAIN_EMOJI;
  drop.setAttribute("aria-hidden", "true");

  const startX = centerX + (Math.random() * 2 - 1) * horizontalSpread;
  const drift = (Math.random() * 2 - 1) * 20;
  const fall = fallDistance * (0.8 + Math.random() * 0.5);
  const duration = 500 + Math.random() * 350;
  const delay = Math.random() * 200;
  const size = 12 + Math.random() * 8;

  drop.style.left = `${startX}px`;
  drop.style.top = `${topY}px`;
  drop.style.fontSize = `${size}px`;
  drop.style.animationDuration = `${duration}ms`;
  drop.style.animationDelay = `${delay}ms`;
  drop.style.setProperty("--rain-drift", `${drift}px`);
  drop.style.setProperty("--rain-fall", `${fall}px`);

  stageEl.appendChild(drop);
  activeDrops += 1;
  drop.addEventListener(
    "animationend",
    () => {
      drop.remove();
      activeDrops = Math.max(0, activeDrops - 1);
    },
    { once: true }
  );
}
