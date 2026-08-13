// Occasional, random balloon that floats up from the button and pops.
// Pure eye candy - no gameplay effect, just a reason to keep clicking.

const BALLOON_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899"];
const MAX_ACTIVE_BALLOONS = 2;

let activeBalloons = 0;

/** Roll the dice; spawn a balloon near the button if it hits. */
export function maybeSpawnBalloon(stageEl, buttonEl, chance = 0.05) {
  if (activeBalloons >= MAX_ACTIVE_BALLOONS) return;
  if (Math.random() > chance) return;
  spawnBalloon(stageEl, buttonEl);
}

function spawnBalloon(stageEl, buttonEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();

  const balloon = document.createElement("div");
  balloon.className = "balloon";
  balloon.setAttribute("aria-hidden", "true");

  const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  const riseDistance = -(260 + Math.random() * 180); // px, negative = upward
  const drift = (Math.random() * 2 - 1) * 60; // px sideways sway
  const duration = 2200 + Math.random() * 1400; // ms

  balloon.style.setProperty("--balloon-color", color);
  balloon.style.setProperty("--rise-distance", `${riseDistance}px`);
  balloon.style.setProperty("--drift", `${drift}px`);
  balloon.style.setProperty("--rise-duration", `${duration}ms`);
  balloon.style.left = `${buttonRect.left - stageRect.left + buttonRect.width / 2}px`;
  balloon.style.top = `${buttonRect.top - stageRect.top + buttonRect.height * 0.25}px`;

  stageEl.appendChild(balloon);
  activeBalloons += 1;
  requestAnimationFrame(() => balloon.classList.add("is-rising"));

  const popDelay = duration * (0.35 + Math.random() * 0.45);
  window.setTimeout(() => popBalloon(stageEl, balloon), popDelay);
}

function popBalloon(stageEl, balloon) {
  if (!balloon.isConnected) return;

  const stageRect = stageEl.getBoundingClientRect();
  const balloonRect = balloon.getBoundingClientRect();
  const cx = balloonRect.left + balloonRect.width / 2 - stageRect.left;
  const cy = balloonRect.top + balloonRect.height / 2 - stageRect.top;
  const color = balloon.style.getPropertyValue("--balloon-color");

  balloon.remove();
  activeBalloons = Math.max(0, activeBalloons - 1);
  spawnPopBurst(stageEl, cx, cy, color);
}

function spawnPopBurst(stageEl, cx, cy, color) {
  const particleCount = 7;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");
    particle.className = "balloon-pop-particle";
    particle.setAttribute("aria-hidden", "true");

    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
    const distance = 18 + Math.random() * 20;
    particle.style.setProperty("--particle-color", color);
    particle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
    particle.style.left = `${cx}px`;
    particle.style.top = `${cy}px`;

    stageEl.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}
