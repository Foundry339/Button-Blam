// Very rare, silly UFO that swoops in and "abducts" the button.
// It never touches the real button element - a decorative stand-in clone
// gets lifted into the beam instead, so this can't collide with the
// button's own shrink/grow/shake effect system in button.js.

const MAX_ACTIVE_UFOS = 1;
const FLIGHT_MS = 2300;

const UFO_SVG = `
  <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <ellipse cx="60" cy="20" rx="24" ry="18" fill="#a5f3fc" opacity="0.85" />
    <ellipse cx="60" cy="38" rx="58" ry="14" fill="#94a3b8" />
    <ellipse cx="60" cy="34" rx="58" ry="10" fill="#e2e8f0" />
    <circle cx="30" cy="40" r="4" fill="#fbbf24" />
    <circle cx="60" cy="44" r="4" fill="#fbbf24" />
    <circle cx="90" cy="40" r="4" fill="#fbbf24" />
  </svg>
`;

let activeUfos = 0;

/** Roll the dice; send a UFO to abduct the button if it hits. */
export function maybeSpawnUfo(stageEl, buttonEl, labelEl, chance = 0.002) {
  if (activeUfos >= MAX_ACTIVE_UFOS) return;
  if (Math.random() > chance) return;
  spawnUfo(stageEl, buttonEl, labelEl);
}

function spawnUfo(stageEl, buttonEl, labelEl) {
  const stageRect = stageEl.getBoundingClientRect();
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left - stageRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top - stageRect.top + buttonRect.height / 2;
  const buttonTop = buttonRect.top - stageRect.top;

  activeUfos += 1;

  const ufo = document.createElement("div");
  ufo.className = "ufo";
  ufo.setAttribute("aria-hidden", "true");
  ufo.innerHTML = UFO_SVG;
  ufo.style.top = `${buttonTop - 100}px`;

  const beam = document.createElement("div");
  beam.className = "ufo-beam";
  beam.setAttribute("aria-hidden", "true");
  beam.style.left = `${centerX}px`;
  beam.style.top = `${buttonTop - 62}px`;
  beam.style.height = `${buttonRect.height * 0.65 + 60}px`;

  const clone = document.createElement("div");
  clone.className = "ufo-abductee";
  clone.setAttribute("aria-hidden", "true");
  clone.style.width = `${buttonRect.width}px`;
  clone.style.height = `${buttonRect.height}px`;
  clone.style.left = `${centerX}px`;
  clone.style.top = `${centerY}px`;
  clone.style.setProperty("--lift", `${-(buttonRect.height * 0.55 + 90)}px`);
  clone.textContent = labelEl?.textContent ?? "";

  stageEl.append(ufo, beam, clone);

  requestAnimationFrame(() => {
    ufo.classList.add("is-active");
    beam.classList.add("is-active");
    clone.classList.add("is-active");
  });

  window.setTimeout(() => {
    ufo.remove();
    beam.remove();
    clone.remove();
    activeUfos = Math.max(0, activeUfos - 1);
  }, FLIGHT_MS);
}
