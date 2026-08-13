// Pure(-ish) click/event logic, decoupled from the DOM. main.js wires this
// up to the button UI; nothing in here touches document/window directly.
import { EVENTS, NONE_WEIGHT } from "../config/events.js";

const TOTAL_WEIGHT = NONE_WEIGHT + EVENTS.reduce((sum, e) => sum + e.weight, 0);

/**
 * Roll the event pool once. Returns null for "nothing special happened" or
 * the matching event config otherwise.
 */
export function rollEvent() {
  let roll = Math.random() * TOTAL_WEIGHT;
  if (roll < NONE_WEIGHT) return null;
  roll -= NONE_WEIGHT;
  for (const event of EVENTS) {
    if (roll < event.weight) return event;
    roll -= event.weight;
  }
  return null;
}

/**
 * Resolve a single click into the click delta it produces, given the
 * currently-active multiplier (from a "worth 10x/100x" event, if any) and
 * whatever event was just rolled.
 * @param {number} activeMultiplier
 * @param {ReturnType<typeof rollEvent>} event
 */
export function resolveClickValue(activeMultiplier, event) {
  let value = 1 * activeMultiplier;
  if (event?.bonus) value += event.bonus;
  if (event?.multiplyThisClick) value *= event.multiplyThisClick;
  return Math.round(value);
}
