// The rarest sighting: a celebratory rain of donuts across the whole
// screen, not just near the button. Unlike the other rare effects this one
// is a fixed viewport overlay, independent of the button's position -
// deliberately bigger and more "occasion" than the rest.

const MAX_ACTIVE_RAINS = 1;
const DONUT_EMOJI = "\u{1F369}";
const MIN_DONUTS = 60;
const MAX_DONUTS = 84;
const SPAWN_WINDOW_MS = 3200;

let activeRains = 0;

/** Roll the dice; rain donuts across the screen if it hits. Returns whether it fired. */
export function maybeSpawnDonutRain(chance = 1 / 350) {
  if (activeRains >= MAX_ACTIVE_RAINS) return false;
  if (Math.random() > chance) return false;
  spawnDonutRain();
  return true;
}

function spawnDonutRain() {
  const layer = document.createElement("div");
  layer.className = "donut-rain-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const count = MIN_DONUTS + Math.floor(Math.random() * (MAX_DONUTS - MIN_DONUTS + 1));
  activeRains += 1;
  let remaining = count;

  for (let i = 0; i < count; i++) {
    const donut = document.createElement("span");
    donut.className = "donut-rain-particle";
    donut.textContent = DONUT_EMOJI;

    const left = 2 + Math.random() * 93;
    const size = 24 + Math.random() * 22;
    const duration = 3600 + Math.random() * 2800;
    const delay = Math.random() * SPAWN_WINDOW_MS;
    const drift = (Math.random() * 2 - 1) * 90;
    const spin = (Math.random() < 0.5 ? -1 : 1) * (240 + Math.random() * 480);

    donut.style.left = `${left}vw`;
    donut.style.fontSize = `${size}px`;
    donut.style.animationDuration = `${duration}ms`;
    donut.style.animationDelay = `${delay}ms`;
    donut.style.setProperty("--donut-drift", `${drift}px`);
    donut.style.setProperty("--donut-spin", `${spin}deg`);

    layer.appendChild(donut);
    donut.addEventListener(
      "animationend",
      () => {
        donut.remove();
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
