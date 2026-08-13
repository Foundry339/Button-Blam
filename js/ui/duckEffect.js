// Rare, nonsensical giant rubber duck that drifts across the screen.
// Pure eye candy - no gameplay effect, no reason for it, just a reason to
// keep clicking. Never touches the button - only a decorative sibling.

const MAX_ACTIVE_DUCKS = 1;

const DUCK_SVG = `
  <svg viewBox="0 0 210 180" xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <path d="M48 156 L138 156
             C162 156 170 120 165 78
             C162 50 140 22 112 12
             C100 8 88 8 78 12
             C60 20 52 38 54 56
             C34 62 18 80 14 104
             C10 128 24 150 48 156 Z"
          fill="#d9de5a" stroke="#2b1c10" stroke-width="5" stroke-linejoin="round" />
    <path d="M40 75 C65 65 90 78 88 105 C86 128 65 138 45 128 C30 118 25 95 40 75 Z"
          fill="#c7cc4c" stroke="#2b1c10" stroke-width="3" stroke-linejoin="round" opacity="0.95" />
    <path d="M48 90 C62 85 74 95 70 112 C66 122 52 122 46 112 C42 102 42 96 48 90 Z"
          fill="#b7bc42" opacity="0.85" />
    <path d="M158 60 C178 48 205 52 208 63 C210 72 198 80 180 80 C168 80 158 74 155 66 C155 63 156 61 158 60 Z"
          fill="#ea8a3d" stroke="#2b1c10" stroke-width="4" stroke-linejoin="round" />
    <path d="M162 70 C176 80 194 78 203 69 C195 84 172 86 163 76 Z" fill="#c96a1f" opacity="0.9" />
    <path d="M160 68 C175 78 195 76 205 66" stroke="#2b1c10" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <ellipse cx="140" cy="42" rx="7.5" ry="9.5" fill="#241a10" transform="rotate(-14 140 42)" />
    <ellipse cx="136.5" cy="37" rx="2.2" ry="2.8" fill="#fff" opacity="0.95" />
  </svg>
`;

let activeDucks = 0;

/** Roll the dice; send a big rubber duck drifting across the screen if it hits. */
export function maybeSpawnDuck(stageEl, buttonEl, chance = 0.01) {
  if (activeDucks >= MAX_ACTIVE_DUCKS) return;
  if (Math.random() > chance) return;
  spawnDuck(stageEl, buttonEl);
}

function spawnDuck(stageEl, buttonEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();

  const duck = document.createElement("div");
  duck.className = "duck";
  duck.setAttribute("aria-hidden", "true");
  duck.innerHTML = DUCK_SVG;

  const size = 120 + Math.random() * 70;
  const duration = 3400 + Math.random() * 1600;
  const leftToRight = Math.random() < 0.5;
  const crossDistance = stageRect.width + size * 1.4;
  const yPos =
    buttonRect.top - stageRect.top + buttonRect.height * (0.25 + Math.random() * 0.4) - size / 2;

  duck.style.width = `${size}px`;
  duck.style.height = `${size}px`;
  duck.style.top = `${yPos}px`;
  duck.style.setProperty("--duck-duration", `${duration}ms`);

  if (leftToRight) {
    duck.style.left = `${-size}px`;
    duck.style.setProperty("--cross-distance", `${crossDistance}px`);
  } else {
    duck.style.left = `${stageRect.width + size}px`;
    duck.style.setProperty("--cross-distance", `${-crossDistance}px`);
  }

  stageEl.appendChild(duck);
  activeDucks += 1;
  requestAnimationFrame(() => {
    duck.classList.add(leftToRight ? "is-crossing-ltr" : "is-crossing-rtl");
  });

  window.setTimeout(() => {
    duck.remove();
    activeDucks = Math.max(0, activeDucks - 1);
  }, duration);
}
