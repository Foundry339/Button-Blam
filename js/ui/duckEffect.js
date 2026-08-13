// Rare, nonsensical giant rubber duck that drifts across the screen.
// Pure eye candy - no gameplay effect, no reason for it, just a reason to
// keep clicking. Never touches the button - only a decorative sibling.

const MAX_ACTIVE_DUCKS = 1;
const DUCK_EMOJI = "\u{1F986}";

let activeDucks = 0;

/** Roll the dice; send a big rubber duck drifting across the screen if it hits. Returns whether it fired. */
export function maybeSpawnDuck(stageEl, buttonEl, chance = 0.01) {
  if (activeDucks >= MAX_ACTIVE_DUCKS) return false;
  if (Math.random() > chance) return false;
  spawnDuck(stageEl, buttonEl);
  return true;
}

function spawnDuck(stageEl, buttonEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();

  const duck = document.createElement("div");
  duck.className = "duck";
  duck.setAttribute("aria-hidden", "true");
  duck.textContent = DUCK_EMOJI;

  const size = 120 + Math.random() * 70;
  const duration = 3400 + Math.random() * 1600;
  const leftToRight = Math.random() < 0.5;
  const crossDistance = stageRect.width + size * 1.4;
  const yPos =
    buttonRect.top - stageRect.top + buttonRect.height * (0.25 + Math.random() * 0.4) - size / 2;

  duck.style.width = `${size}px`;
  duck.style.height = `${size}px`;
  duck.style.fontSize = `${size * 0.85}px`;
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
