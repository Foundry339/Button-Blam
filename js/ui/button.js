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

/** Floating "+N" text that rises and fades near the click point. */
export function spawnFloatingValue(stageEl, value, clientX, clientY) {
  const el = document.createElement("span");
  el.className = "float-value";
  el.textContent = `+${value}`;
  const stageRect = stageEl.getBoundingClientRect();
  el.style.left = `${clientX - stageRect.left}px`;
  el.style.top = `${clientY - stageRect.top}px`;
  stageEl.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

const VISUAL_CLASS_BY_EFFECT = {
  shrink: "btn-shrink",
  grow: "btn-grow",
  shake: "btn-shake",
  vanish: "btn-vanish",
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
  buttonEl.classList.remove("btn-shrink", "btn-grow", "btn-shake", "btn-vanish");

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

/** Toggle the "worth 10x/100x" glow while a multiplier is active. */
export function setMultiplierVisual(buttonEl, multiplier) {
  buttonEl.classList.toggle("btn-multiplier", multiplier > 1);
  buttonEl.dataset.multiplier = String(multiplier);
}
