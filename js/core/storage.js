// Thin wrapper around localStorage so the rest of the app never touches
// window.localStorage or JSON.parse/stringify directly. If storage is ever
// swapped for IndexedDB or a server-synced store, this is the only file that
// needs to change.
const NAMESPACE = "jomc";

function keyFor(name) {
  return `${NAMESPACE}:${name}`;
}

export function loadState(name, fallback) {
  try {
    const raw = window.localStorage.getItem(keyFor(name));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveState(name, value) {
  try {
    window.localStorage.setItem(keyFor(name), JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota, etc). Fail silently -
    // clicking still works, it just won't persist.
  }
}

/** Wipes every piece of state this game has ever saved (stats, achievements, etc). */
export function resetAll() {
  try {
    const prefix = `${NAMESPACE}:`;
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith(prefix)) window.localStorage.removeItem(key);
    }
  } catch {
    // Storage unavailable - nothing to reset.
  }
}
