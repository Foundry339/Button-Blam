// Rare burst of fire emojis that pop up near the button and fly away.
// Pure eye candy for the burst itself - it never touches the real button.
// The 50-click recoloring run it kicks off lives in button.js's color-cycle
// functions; main.js is what wires the two together.

const MAX_ACTIVE_BURSTS = 1;
const FIRE_EMOJI = "\u{1F525}";
const MIN_PARTICLES = 14;
const MAX_PARTICLES = 20;

let activeBursts = 0;

/** Roll the dice; spawn a fire burst near the button if it hits. Returns whether it fired. */
export function maybeSpawnFire(stageEl, buttonEl, chance = 0.005) {
  if (activeBursts >= MAX_ACTIVE_BURSTS) return false;
  if (Math.random() > chance) return false;
  spawnFireBurst(stageEl, buttonEl);
  return true;
}

function spawnFireBurst(stageEl, buttonEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left - stageRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top - stageRect.top + buttonRect.height / 2;
  // Spread across most of the stage's width, not just the button's own
  // footprint, so a chunk of the burst clearly lands outside the button.
  const horizontalSpread = stageRect.width * 0.46;
  const verticalSpread = buttonRect.height * 0.55;

  const count = MIN_PARTICLES + Math.floor(Math.random() * (MAX_PARTICLES - MIN_PARTICLES + 1));
  activeBursts += 1;
  let remaining = count;

  for (let i = 0; i < count; i++) {
    const delay = Math.random() * 350;
    window.setTimeout(() => {
      spawnFireParticle(stageEl, centerX, centerY, horizontalSpread, verticalSpread, () => {
        remaining -= 1;
        if (remaining <= 0) activeBursts = Math.max(0, activeBursts - 1);
      });
    }, delay);
  }
}

function spawnFireParticle(stageEl, centerX, centerY, horizontalSpread, verticalSpread, onDone) {
  const particle = document.createElement("span");
  particle.className = "fire-particle";
  particle.textContent = FIRE_EMOJI;
  particle.setAttribute("aria-hidden", "true");

  const startX = centerX + (Math.random() * 2 - 1) * horizontalSpread;
  const startY = centerY + (Math.random() * 2 - 1) * verticalSpread;
  const drift = (Math.random() * 2 - 1) * 60;
  const rise = -(90 + Math.random() * 90);
  const duration = 700 + Math.random() * 500;
  const size = 20 + Math.random() * 16;

  particle.style.left = `${startX}px`;
  particle.style.top = `${startY}px`;
  particle.style.fontSize = `${size}px`;
  particle.style.animationDuration = `${duration}ms`;
  particle.style.setProperty("--fire-drift", `${drift}px`);
  particle.style.setProperty("--fire-rise", `${rise}px`);

  stageEl.appendChild(particle);
  particle.addEventListener(
    "animationend",
    () => {
      particle.remove();
      onDone();
    },
    { once: true }
  );
}
