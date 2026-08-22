// Tracks the name the local user has saved their score under, if any. Once
// set, the real leaderboard entry (fetched from the server under that name)
// replaces the local "YOU" placeholder instead of showing alongside it.
import { loadState, saveState } from "./storage.js";

const KEY = "leaderboardName";

export function loadSavedLeaderboardName() {
  return loadState(KEY, null);
}

export function saveLeaderboardName(name) {
  saveState(KEY, name);
}
