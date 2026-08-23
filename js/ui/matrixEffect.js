// Rare "digital breakdown": a burst of green code rains straight down the
// whole screen, like the button briefly glitched into the Matrix. Fixed
// viewport overlay, independent of button position - same "big occasion"
// shape as the donut rain, but falls straight down with no tumble/spin.

const MAX_ACTIVE_RAINS = 1;
const MATRIX_CHARS = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "ア", "カ", "サ", "タ", "ナ", "ハ", "マ", "ヤ", "ラ", "ワ",
];
const MIN_GLYPHS = 90;
const MAX_GLYPHS = 130;
const SPAWN_WINDOW_MS = 800;

let activeRains = 0;

/** Roll the dice; rain matrix code across the screen if it hits. Returns whether it fired. */
export function maybeSpawnMatrixRain(chance = 1 / 2600) {
  if (activeRains >= MAX_ACTIVE_RAINS) return false;
  if (Math.random() > chance) return false;
  spawnMatrixRain();
  return true;
}

function spawnMatrixRain() {
  const layer = document.createElement("div");
  layer.className = "matrix-rain-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const count = MIN_GLYPHS + Math.floor(Math.random() * (MAX_GLYPHS - MIN_GLYPHS + 1));
  activeRains += 1;
  let remaining = count;

  for (let i = 0; i < count; i++) {
    const glyph = document.createElement("span");
    glyph.className = "matrix-rain-particle";
    glyph.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

    const left = Math.random() * 100;
    const size = 16 + Math.random() * 14;
    const duration = 2800 + Math.random() * 2800;
    const delay = Math.random() * SPAWN_WINDOW_MS;

    glyph.style.left = `${left}vw`;
    glyph.style.fontSize = `${size}px`;
    glyph.style.animationDuration = `${duration}ms`;
    glyph.style.animationDelay = `${delay}ms`;

    layer.appendChild(glyph);
    glyph.addEventListener(
      "animationend",
      () => {
        glyph.remove();
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
