// Analytics seam. Every call is currently a no-op (console.debug in dev),
// but every meaningful interaction in the app is already routed through here
// so wiring up a real analytics provider later is a one-file change:
// swap the body of track() for e.g. posthog.capture(name, payload).
const DEBUG = false;

/**
 * @param {"button_clicked"|"milestone_reached"|"achievement_unlocked"|
 *   "session_started"|"session_ended"|"team_selected"|"leaderboard_viewed"} name
 * @param {Record<string, unknown>} [payload]
 */
export function track(name, payload = {}) {
  if (DEBUG) {
    console.debug(`[analytics] ${name}`, payload);
  }
}
