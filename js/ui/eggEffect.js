// Rare golden egg: a bird flutters in, lays a golden egg near the button,
// and flies off. After a beat the egg shakes and cracks open in a burst of
// sparkles. Pure eye candy - no power-up, just a fun "jackpot" moment.

const MAX_ACTIVE_EGGS = 1;
const BIRD_EMOJI = "\u{1F985}";
const EGG_EMOJI = "\u{1F95A}";
const SPARKLE_EMOJI = "\u{2728}";

const MIN_SPARKLES = 18;
const MAX_SPARKLES = 26;

let activeEggs = 0;

/** Roll the dice; spawn the golden egg sequence near the button if it hits. Returns whether it fired. */
export function maybeSpawnEgg(stageEl, buttonEl, chance = 1 / 800) {
  if (activeEggs >= MAX_ACTIVE_EGGS) return false;
  if (Math.random() > chance) return false;
  spawnEggSequence(stageEl, buttonEl);
  return true;
}

function spawnEggSequence(stageEl, buttonEl) {
  activeEggs += 1;
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left - stageRect.left + buttonRect.width / 2;
  const restY = buttonRect.top - stageRect.top - buttonRect.height * 0.18;
  const birdY = restY - buttonRect.height * 0.35;
  const sideOffset = buttonRect.width * 0.3 * (Math.random() < 0.5 ? -1 : 1);
  const layX = centerX + sideOffset;

  const bird = document.createElement("div");
  bird.className = "golden-bird";
  bird.setAttribute("aria-hidden", "true");
  bird.textContent = BIRD_EMOJI;
  bird.style.left = `${layX}px`;
  bird.style.top = `${birdY}px`;
  bird.style.fontSize = `${buttonRect.width * 0.22}px`;
  stageEl.appendChild(bird);
  requestAnimationFrame(() => bird.classList.add("is-active"));

  const egg = document.createElement("div");
  egg.className = "golden-egg";
  egg.setAttribute("aria-hidden", "true");
  egg.textContent = EGG_EMOJI;
  egg.style.left = `${layX}px`;
  egg.style.top = `${restY}px`;
  egg.style.fontSize = `${buttonRect.width * 0.16}px`;

  // The bird "lays" the egg partway through its flutter, then flies off.
  window.setTimeout(() => {
    stageEl.appendChild(egg);
    requestAnimationFrame(() => egg.classList.add("is-dropping"));
  }, 350);

  window.setTimeout(() => bird.remove(), 1100);

  window.setTimeout(() => egg.classList.add("is-shaking"), 1500);

  // Shake plays twice (800ms total) before cracking.
  window.setTimeout(() => {
    egg.classList.remove("is-shaking");
    egg.classList.add("is-cracking");
  }, 2300);

  // Sparkles burst at the swell's peak (~65% through the 480ms crack
  // animation), not the instant it starts growing.
  window.setTimeout(() => {
    spawnSparkleBurst(stageEl, layX, restY);
  }, 2610);

  window.setTimeout(() => {
    egg.remove();
    activeEggs = Math.max(0, activeEggs - 1);
  }, 2800);
}

function spawnSparkleBurst(stageEl, centerX, centerY) {
  const count = MIN_SPARKLES + Math.floor(Math.random() * (MAX_SPARKLES - MIN_SPARKLES + 1));
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
    spawnSparkle(stageEl, centerX, centerY, angle);
  }
}

function spawnSparkle(stageEl, centerX, centerY, angle) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle-particle";
  sparkle.textContent = SPARKLE_EMOJI;
  sparkle.setAttribute("aria-hidden", "true");

  const distance = 90 + Math.random() * 140;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;
  const duration = 650 + Math.random() * 450;
  const size = 20 + Math.random() * 18;

  sparkle.style.left = `${centerX}px`;
  sparkle.style.top = `${centerY}px`;
  sparkle.style.fontSize = `${size}px`;
  sparkle.style.animationDuration = `${duration}ms`;
  sparkle.style.setProperty("--sparkle-tx", `${tx}px`);
  sparkle.style.setProperty("--sparkle-ty", `${ty}px`);

  stageEl.appendChild(sparkle);
  sparkle.addEventListener("animationend", () => sparkle.remove(), { once: true });
}
