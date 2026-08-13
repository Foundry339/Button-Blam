// Rare rocket ship that blasts off from the button and rockets offscreen.
// Pure eye candy - no gameplay effect, just a reason to keep clicking.

const MAX_ACTIVE_ROCKETS = 1;
const EXHAUST_INTERVAL_MS = 55;

const ROCKET_SVG = `
  <svg viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <path d="M20 2 C28 14 30 30 30 44 L10 44 C10 30 12 14 20 2 Z" fill="#f4f4f6" />
    <path d="M20 2 C25 10 27 20 27 30 L13 30 C13 20 15 10 20 2 Z" fill="#ff4d5e" />
    <circle cx="20" cy="34" r="4.5" fill="#3fa9ff" />
    <circle cx="20" cy="34" r="4.5" fill="none" stroke="#c8c8d0" stroke-width="1.2" />
    <path d="M10 44 L2 58 L12 50 Z" fill="#ff4d5e" />
    <path d="M30 44 L38 58 L28 50 Z" fill="#ff4d5e" />
    <g class="rocket__flame">
      <path d="M13.5 44 C13 51 16.5 58 20 64 C23.5 58 27 51 26.5 44 Z" fill="#ff8a3d" />
      <path d="M16.5 45 C16 50.5 18 56 20 60 C22 56 24 50.5 23.5 45 Z" fill="#fbbf24" />
    </g>
  </svg>
`;

let activeRockets = 0;

/** Roll the dice; blast off a rocket from the button if it hits. */
export function maybeSpawnRocket(stageEl, buttonEl, chance = 0.02) {
  if (activeRockets >= MAX_ACTIVE_ROCKETS) return;
  if (Math.random() > chance) return;
  spawnRocket(stageEl, buttonEl);
}

function spawnRocket(stageEl, buttonEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();

  const rocket = document.createElement("div");
  rocket.className = "rocket";
  rocket.setAttribute("aria-hidden", "true");
  rocket.innerHTML = ROCKET_SVG;

  const riseDistance = -(900 + Math.random() * 300);
  const drift = (Math.random() * 2 - 1) * 70;
  const duration = 900 + Math.random() * 400;
  const startTilt = (Math.random() * 2 - 1) * 8;

  rocket.style.setProperty("--rise-distance", `${riseDistance}px`);
  rocket.style.setProperty("--drift", `${drift}px`);
  rocket.style.setProperty("--flight-duration", `${duration}ms`);
  rocket.style.setProperty("--start-tilt", `${startTilt}deg`);
  rocket.style.setProperty("--end-tilt", `${startTilt * 0.4}deg`);
  rocket.style.left = `${buttonRect.left - stageRect.left + buttonRect.width / 2}px`;
  rocket.style.top = `${buttonRect.top - stageRect.top + buttonRect.height * 0.5}px`;

  stageEl.appendChild(rocket);
  activeRockets += 1;
  requestAnimationFrame(() => rocket.classList.add("is-launching"));

  const exhaustTimer = window.setInterval(() => {
    if (!rocket.isConnected) {
      window.clearInterval(exhaustTimer);
      return;
    }
    const rocketRect = rocket.getBoundingClientRect();
    spawnExhaust(stageEl, rocketRect.left + rocketRect.width / 2 - stageRect.left, rocketRect.bottom - stageRect.top - 6);
  }, EXHAUST_INTERVAL_MS);

  window.setTimeout(() => {
    window.clearInterval(exhaustTimer);
    rocket.remove();
    activeRockets = Math.max(0, activeRockets - 1);
  }, duration);
}

function spawnExhaust(stageEl, x, y) {
  const particle = document.createElement("span");
  particle.className = "rocket-exhaust";
  particle.setAttribute("aria-hidden", "true");

  const size = 5 + Math.random() * 5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.setProperty("--ex-dx", `${(Math.random() * 2 - 1) * 16}px`);
  particle.style.setProperty("--ex-dy", `${12 + Math.random() * 18}px`);

  stageEl.appendChild(particle);
  particle.addEventListener("animationend", () => particle.remove(), { once: true });
}
