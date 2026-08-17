// Special-occasion rain for the ultimate milestone (1,000,000 clicks) -
// partying faces fall across the whole screen instead of the usual
// confetti. Same full-viewport overlay shape as the other rains, but runs
// 3x as long since this is the top of the ladder.

const MAX_ACTIVE_RAINS = 2;
const PARTY_EMOJI = "\u{1F973}";
const MIN_PIECES = 50;
const MAX_PIECES = 70;
const SPAWN_WINDOW_MS = 900 * 3;

let activeRains = 0;

export function spawnPartyRain() {
  if (activeRains >= MAX_ACTIVE_RAINS) return;

  const layer = document.createElement("div");
  layer.className = "party-rain-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const count = MIN_PIECES + Math.floor(Math.random() * (MAX_PIECES - MIN_PIECES + 1));
  activeRains += 1;
  let remaining = count;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "party-rain-particle";
    piece.textContent = PARTY_EMOJI;

    const left = Math.random() * 100;
    const size = 22 + Math.random() * 20;
    const duration = (2200 + Math.random() * 1600) * 3;
    const delay = Math.random() * SPAWN_WINDOW_MS;
    const drift = (Math.random() * 2 - 1) * 120;
    const spin = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540);

    piece.style.left = `${left}vw`;
    piece.style.fontSize = `${size}px`;
    piece.style.animationDuration = `${duration}ms`;
    piece.style.animationDelay = `${delay}ms`;
    piece.style.setProperty("--party-drift", `${drift}px`);
    piece.style.setProperty("--party-spin", `${spin}deg`);

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
