// Tracks how many times each rare visual effect (balloon, rocket, UFO,
// duck, fire, donut) has appeared, persisted across sessions like everything else.
import { loadState, saveState } from "./storage.js";

const KEY = "effectSightings";
const DEFAULT_COUNTS = { balloon: 0, rocket: 0, ufo: 0, duck: 0, fire: 0, donut: 0 };

export function loadSightingCounts() {
  return { ...DEFAULT_COUNTS, ...loadState(KEY, {}) };
}

/** Bump a sighting count and persist. Returns the same object for chaining. */
export function recordSighting(counts, type) {
  counts[type] = (counts[type] ?? 0) + 1;
  saveState(KEY, counts);
  return counts;
}
