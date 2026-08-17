// Phoenix power-up: a rare phoenix sighting bursts into flame, scatters
// into embers that pull back together into a single spark, and shoots
// upward - a complete "death and rebirth" moment in one beat. Then the
// next 50 clicks each turn the "+1" floating value flame-colored with a
// trail of tiny rising embers, instead of the plain gold pop. Mirrors the
// tropical fish/bubble, storm/lightning, disco/strobe, and moai/punch
// power-ups.

const PHOENIX_CHANCE = 1 / 6000;
export const PHOENIX_POWER_UP_CLICKS = 50;

const PHOENIX_EMOJI = "\u{1F426}\u{200D}\u{1F525}";
const EMBER_EMOJI = "\u{1F525}";
const SPARK_EMOJI = "\u{2728}";

const MIN_EMBERS = 14;
const MAX_EMBERS = 20;

/** Roll the dice for a phoenix sighting. Returns whether it hit. */
export function maybeTriggerPhoenixPowerUp(chance = PHOENIX_CHANCE) {
  return Math.random() < chance;
}

/**
 * One-off "burn and rebirth": a large phoenix appears and ignites, embers
 * scatter outward then pull back together, and a single spark shoots
 * upward and vanishes. Viewport-anchored like the other reveals.
 */
export function spawnPhoenixRebirth(buttonEl) {
  const buttonRect = buttonEl.getBoundingClientRect();
  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height / 2;
  const size = buttonRect.width * 1.1;
  const appearDuration = 850;
  const scatterDuration = 1050;

  const phoenix = document.createElement("div");
  phoenix.className = "phoenix-appear";
  phoenix.setAttribute("aria-hidden", "true");
  phoenix.textContent = PHOENIX_EMOJI;
  phoenix.style.left = `${centerX}px`;
  phoenix.style.top = `${centerY}px`;
  phoenix.style.width = `${size}px`;
  phoenix.style.height = `${size}px`;
  phoenix.style.fontSize = `${size * 0.85}px`;
  phoenix.style.setProperty("--phoenix-duration", `${appearDuration}ms`);

  document.body.appendChild(phoenix);
  requestAnimationFrame(() => phoenix.classList.add("is-igniting"));
  window.setTimeout(() => phoenix.remove(), appearDuration);

  // Embers scatter and pull back together right as the phoenix ignites out.
  const scatterStart = appearDuration * 0.75;
  window.setTimeout(() => spawnEmberScatter(centerX, centerY, scatterDuration), scatterStart);

  // The reborn spark shoots up once the embers have gathered back in.
  window.setTimeout(() => spawnRebirthSpark(centerX, centerY), scatterStart + scatterDuration * 0.9);
}

function spawnEmberScatter(centerX, centerY, duration) {
  const count = MIN_EMBERS + Math.floor(Math.random() * (MAX_EMBERS - MIN_EMBERS + 1));
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
    const distance = 60 + Math.random() * 90;
    spawnEmberParticle(centerX, centerY, angle, distance, duration);
  }
}

function spawnEmberParticle(centerX, centerY, angle, distance, duration) {
  const ember = document.createElement("span");
  ember.className = "phoenix-ember";
  ember.setAttribute("aria-hidden", "true");
  ember.textContent = EMBER_EMOJI;

  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;
  const jitteredDuration = duration + Math.random() * 200 - 100;
  const size = 12 + Math.random() * 10;

  ember.style.left = `${centerX}px`;
  ember.style.top = `${centerY}px`;
  ember.style.fontSize = `${size}px`;
  ember.style.animationDuration = `${jitteredDuration}ms`;
  ember.style.setProperty("--ember-tx", `${tx}px`);
  ember.style.setProperty("--ember-ty", `${ty}px`);

  document.body.appendChild(ember);
  requestAnimationFrame(() => ember.classList.add("is-scattering"));
  window.setTimeout(() => ember.remove(), jitteredDuration + 50);
}

function spawnRebirthSpark(centerX, centerY) {
  const spark = document.createElement("span");
  spark.className = "phoenix-spark";
  spark.setAttribute("aria-hidden", "true");
  spark.textContent = SPARK_EMOJI;
  spark.style.left = `${centerX}px`;
  spark.style.top = `${centerY}px`;

  document.body.appendChild(spark);
  requestAnimationFrame(() => spark.classList.add("is-rising"));
  window.setTimeout(() => spark.remove(), 700);
}

/**
 * Flame-colored "+N" with a trail of tiny rising embers, swapped in for
 * the normal floating value while the phoenix power-up is active.
 */
export function spawnEmberFloatingValue(stageEl, value, clientX, clientY) {
  const stageRect = stageEl.getBoundingClientRect();
  const x = clientX - stageRect.left;
  const y = clientY - stageRect.top;

  const el = document.createElement("span");
  el.className = "float-value float-value--ember";
  el.textContent = `+${value}`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  stageEl.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });

  const trailCount = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < trailCount; i++) {
    const ember = document.createElement("span");
    ember.className = "ember-trail-particle";
    ember.setAttribute("aria-hidden", "true");
    ember.textContent = EMBER_EMOJI;

    const drift = (Math.random() * 2 - 1) * 24;
    const rise = -(60 + Math.random() * 60);
    const duration = 700 + Math.random() * 400;
    const delay = Math.random() * 150;
    const size = 13 + Math.random() * 8;

    ember.style.left = `${x + (Math.random() * 2 - 1) * 10}px`;
    ember.style.top = `${y}px`;
    ember.style.fontSize = `${size}px`;
    ember.style.animationDuration = `${duration}ms`;
    ember.style.animationDelay = `${delay}ms`;
    ember.style.setProperty("--ember-trail-drift", `${drift}px`);
    ember.style.setProperty("--ember-trail-rise", `${rise}px`);

    stageEl.appendChild(ember);
    ember.addEventListener("animationend", () => ember.remove(), { once: true });
  }
}
