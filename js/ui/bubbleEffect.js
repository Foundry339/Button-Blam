// Tropical fish power-up: a rare fish sighting sends a big fish swimming
// out of the button and off the right edge of the screen, then the next
// 50 clicks each guarantee a bubble burst. This module owns the trigger
// roll and both visuals.

const FISH_CHANCE = 1 / 1000;
export const BUBBLE_POWER_UP_CLICKS = 50;

const FISH_EMOJI = "\u{1F420}";

const BUBBLE_EMOJI = "\u{1FAE7}";
const MIN_PARTICLES = 6;
const MAX_PARTICLES = 10;
const MAX_ACTIVE_PARTICLES = 60;

let activeParticles = 0;

/** Roll the dice for a tropical fish sighting. Returns whether it hit. */
export function maybeTriggerFishPowerUp(chance = FISH_CHANCE) {
  return Math.random() < chance;
}

/**
 * Big fish that swims out of the button and off the right edge of the
 * screen. Positioned in viewport coordinates (like the donut rain) rather
 * than relative to the stage, so it still clears the real edge of the
 * screen even when the button sits in a narrower center column on desktop.
 */
export function spawnFishSwimOut(buttonEl) {
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height / 2;
  const size = buttonRect.width;
  const duration = 2600 + Math.random() * 500;
  // Clear the real right edge of the viewport, not just the button's own container.
  const distance = window.innerWidth - centerX + size;

  const fish = document.createElement("div");
  fish.className = "tropical-fish";
  fish.setAttribute("aria-hidden", "true");
  fish.textContent = FISH_EMOJI;

  fish.style.left = `${centerX}px`;
  fish.style.top = `${centerY}px`;
  fish.style.width = `${size}px`;
  fish.style.height = `${size}px`;
  fish.style.fontSize = `${size * 0.85}px`;
  fish.style.setProperty("--fish-duration", `${duration}ms`);
  fish.style.setProperty("--fish-distance", `${distance}px`);

  document.body.appendChild(fish);
  requestAnimationFrame(() => fish.classList.add("is-swimming"));
  window.setTimeout(() => fish.remove(), duration);
}

/** Guaranteed burst of bubbles radiating outward from the button in every direction. */
export function spawnBubbleBurst(stageEl, buttonEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left - stageRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top - stageRect.top + buttonRect.height / 2;
  const baseRadius = buttonRect.width * 0.55;

  const count = MIN_PARTICLES + Math.floor(Math.random() * (MAX_PARTICLES - MIN_PARTICLES + 1));
  for (let i = 0; i < count; i++) {
    if (activeParticles >= MAX_ACTIVE_PARTICLES) break;
    // Spread particles evenly around the circle, then jitter so it doesn't
    // look mechanically uniform.
    const baseAngle = (Math.PI * 2 * i) / count;
    const angle = baseAngle + (Math.random() * 0.6 - 0.3);
    spawnBubbleParticle(stageEl, centerX, centerY, angle, baseRadius);
  }
}

function spawnBubbleParticle(stageEl, centerX, centerY, angle, baseRadius) {
  const particle = document.createElement("span");
  particle.className = "bubble-particle";
  particle.textContent = BUBBLE_EMOJI;
  particle.setAttribute("aria-hidden", "true");

  const distance = baseRadius + Math.random() * 90;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance - 20; // slight upward bias, bubbles float
  const duration = 650 + Math.random() * 450;
  const size = 14 + Math.random() * 14;

  particle.style.left = `${centerX}px`;
  particle.style.top = `${centerY}px`;
  particle.style.fontSize = `${size}px`;
  particle.style.animationDuration = `${duration}ms`;
  particle.style.setProperty("--bubble-tx", `${tx}px`);
  particle.style.setProperty("--bubble-ty", `${ty}px`);

  stageEl.appendChild(particle);
  activeParticles += 1;
  particle.addEventListener(
    "animationend",
    () => {
      particle.remove();
      activeParticles = Math.max(0, activeParticles - 1);
    },
    { once: true }
  );
}
