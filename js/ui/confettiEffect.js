// Confetti rain across the whole screen, fired whenever a new achievement
// unlocks. Not a random rare sighting - this always fires as a reward
// moment, same "full viewport overlay" shape as the donut rain.

const MAX_ACTIVE_RAINS = 2; // achievements can unlock close together
const MIN_PIECES = 70;
const MAX_PIECES = 100;
const SPAWN_WINDOW_MS = 900;
const CONFETTI_COLORS = ["#f472b6", "#fbbf24", "#a855f7", "#3fa9ff", "#ff4d5e", "#22c55e"];

let activeRains = 0;

export function spawnConfettiRain() {
  if (activeRains >= MAX_ACTIVE_RAINS) return;

  const layer = document.createElement("div");
  layer.className = "confetti-rain-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const count = MIN_PIECES + Math.floor(Math.random() * (MAX_PIECES - MIN_PIECES + 1));
  activeRains += 1;
  let remaining = count;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";

    const left = Math.random() * 100;
    const width = 6 + Math.random() * 8;
    const height = width * (0.35 + Math.random() * 0.3);
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const duration = 2200 + Math.random() * 1600;
    const delay = Math.random() * SPAWN_WINDOW_MS;
    const drift = (Math.random() * 2 - 1) * 120;
    const spin = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540);

    piece.style.left = `${left}vw`;
    piece.style.width = `${width}px`;
    piece.style.height = `${height}px`;
    piece.style.background = color;
    piece.style.animationDuration = `${duration}ms`;
    piece.style.animationDelay = `${delay}ms`;
    piece.style.setProperty("--confetti-drift", `${drift}px`);
    piece.style.setProperty("--confetti-spin", `${spin}deg`);

    layer.appendChild(piece);
    piece.addEventListener(
      "animationend",
      () => {
        piece.remove();
        remaining -= 1;
        if (remaining <= 0) {
          layer.remove();
          activeRains = Math.max(0, activeRains - 1);
        }
      },
      { once: true }
    );
  }
}
