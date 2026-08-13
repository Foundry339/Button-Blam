// Tracks which milestone achievements have been unlocked, persisted so each
// one only ever fires once per user.
import { MILESTONES } from "../config/milestones.js";
import { loadState, saveState } from "./storage.js";

const KEY = "achievements";

export function loadUnlockedAchievements() {
  return new Set(loadState(KEY, []));
}

function persist(unlockedSet) {
  saveState(KEY, [...unlockedSet]);
}

/**
 * Given the new total click count, return any milestones crossed for the
 * first time (in ascending order) and mark them as unlocked.
 * @param {number} totalClicks
 * @param {Set<string>} unlockedSet
 * @returns {typeof MILESTONES}
 */
export function checkNewlyUnlocked(totalClicks, unlockedSet) {
  const newlyUnlocked = [];
  for (const milestone of MILESTONES) {
    if (totalClicks >= milestone.threshold && !unlockedSet.has(milestone.id)) {
      unlockedSet.add(milestone.id);
      newlyUnlocked.push(milestone);
    }
  }
  if (newlyUnlocked.length) persist(unlockedSet);
  return newlyUnlocked;
}
