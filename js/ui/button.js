// Everything about how the big button *looks* and *feels* when clicked.
// Game logic (what a click is worth) lives in core/clickEngine.js - this
// file only ever touches the DOM.
import { BUTTON_TEXT_SWAPS } from "../config/events.js";

let revertTimer = null;

/** Brief press/pop animation on every click, regardless of event. */
export function pulseButton(buttonEl) {
  buttonEl.classList.remove("btn-pulse");
  // Force reflow so the animation restarts even on rapid clicks.
  void buttonEl.offsetWidth;
  buttonEl.classList.add("btn-pulse");
}

/** Knock-back recoil, used during the moai punch power-up. */
export function punchButton(buttonEl) {
  buttonEl.classList.remove("btn-punch");
  void buttonEl.offsetWidth;
  buttonEl.classList.add("btn-punch");
}

/**
 * Floating "+N" text that rises and fades near the click point.
 * @param {string} [variantClass] Extra class for a themed color (e.g. the
 *   matrix effect's green), on top of the normal gold styling.
 */
export function spawnFloatingValue(stageEl, value, clientX, clientY, variantClass) {
  const el = document.createElement("span");
  el.className = variantClass ? `float-value ${variantClass}` : "float-value";
  el.textContent = `+${value}`;
  const stageRect = stageEl.getBoundingClientRect();
  el.style.left = `${clientX - stageRect.left}px`;
  el.style.top = `${clientY - stageRect.top}px`;
  stageEl.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

// Dark, glitched-grey tint (with a faint matrix-green glow) applied to the
// button while the matrix effect's aftermath lingers.
const MATRIX_TINT = { bright: "#6b7280", mid: "#374151", dark: "#111827", glow: "77, 255, 122" };

export function applyMatrixTint(buttonEl) {
  buttonEl.style.setProperty("--btn-bright", MATRIX_TINT.bright);
  buttonEl.style.setProperty("--btn-mid", MATRIX_TINT.mid);
  buttonEl.style.setProperty("--btn-dark", MATRIX_TINT.dark);
  buttonEl.style.setProperty("--btn-glow", MATRIX_TINT.glow);
}

export function clearMatrixTint(buttonEl) {
  buttonEl.style.removeProperty("--btn-bright");
  buttonEl.style.removeProperty("--btn-mid");
  buttonEl.style.removeProperty("--btn-dark");
  buttonEl.style.removeProperty("--btn-glow");
}

// Color trios (bright/mid/dark + a matching glow tint) the button cycles
// through during a fire-triggered run. Kept curated rather than fully random
// RGB so every combination still looks like a glossy version of the button.
const COLOR_THEMES = [
  { bright: "#fca5a5", mid: "#ef4444", dark: "#7f1d1d", glow: "239, 68, 68" },
  { bright: "#fdba74", mid: "#f97316", dark: "#7c2d12", glow: "249, 115, 22" },
  { bright: "#fde047", mid: "#eab308", dark: "#713f12", glow: "234, 179, 8" },
  { bright: "#86efac", mid: "#22c55e", dark: "#14532d", glow: "34, 197, 94" },
  { bright: "#67e8f9", mid: "#06b6d4", dark: "#164e63", glow: "6, 182, 212" },
  { bright: "#93c5fd", mid: "#3b82f6", dark: "#1e3a8a", glow: "59, 130, 246" },
  { bright: "#f0abfc", mid: "#d946ef", dark: "#701a75", glow: "217, 70, 239" },
  { bright: "#fda4af", mid: "#f43f5e", dark: "#881337", glow: "244, 63, 94" },
];

let colorCycleClicksRemaining = -1; // -1 = inactive, already at default color
let lastColorTheme = null;

/** Kick off (or restart) a run of clicks where the button recolors each time. */
export function startColorCycle(clicks = 30) {
  colorCycleClicksRemaining = clicks;
}

/**
 * Call once per click. While a color cycle is active, applies a fresh random
 * color and counts the click down; once it runs out, reverts to the button's
 * normal purple on the very next call. No-op when no cycle is active.
 */
export function tickColorCycle(buttonEl) {
  if (colorCycleClicksRemaining < 0) return;

  if (colorCycleClicksRemaining === 0) {
    buttonEl.style.removeProperty("--btn-bright");
    buttonEl.style.removeProperty("--btn-mid");
    buttonEl.style.removeProperty("--btn-dark");
    buttonEl.style.removeProperty("--btn-glow");
    colorCycleClicksRemaining = -1;
    lastColorTheme = null;
    return;
  }

  let theme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
  if (COLOR_THEMES.length > 1 && theme === lastColorTheme) {
    theme = COLOR_THEMES[(COLOR_THEMES.indexOf(theme) + 1) % COLOR_THEMES.length];
  }
  lastColorTheme = theme;

  buttonEl.style.setProperty("--btn-bright", theme.bright);
  buttonEl.style.setProperty("--btn-mid", theme.mid);
  buttonEl.style.setProperty("--btn-dark", theme.dark);
  buttonEl.style.setProperty("--btn-glow", theme.glow);
  colorCycleClicksRemaining -= 1;
}

const VISUAL_CLASS_BY_EFFECT = {
  shrink: "btn-shrink",
  grow: "btn-grow",
  shake: "btn-shake",
};

/**
 * Apply a temporary visual/behavioral effect from an event, then revert
 * after its duration. Only one visual effect is active at a time.
 */
export function applyVisualEffect(buttonEl, labelEl, event) {
  if (!event?.visual) return;

  if (revertTimer) {
    clearTimeout(revertTimer);
    revertTimer = null;
  }
  buttonEl.classList.remove("btn-shrink", "btn-grow", "btn-shake");

  if (event.visual === "textSwap") {
    const original = labelEl.textContent;
    labelEl.textContent = BUTTON_TEXT_SWAPS[Math.floor(Math.random() * BUTTON_TEXT_SWAPS.length)];
    revertTimer = window.setTimeout(() => {
      labelEl.textContent = original;
    }, event.duration);
    return;
  }

  const cls = VISUAL_CLASS_BY_EFFECT[event.visual];
  if (cls) {
    buttonEl.classList.add(cls);
    revertTimer = window.setTimeout(() => {
      buttonEl.classList.remove(cls);
    }, event.duration);
  }
}
