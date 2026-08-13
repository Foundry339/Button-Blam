// This Week's Button War: random team assignment + local click tally.
// Team totals are seeded from mock data (core/api.js) and incremented
// locally as the user clicks. When a backend exists, replace
// `addClicksToLocalTally` with a submission to the server and let
// fetchTeamTotals() reflect everyone's real contributions.
import { TEAM_IDS } from "../config/teams.js";
import { loadState, saveState } from "./storage.js";
import { track } from "./analytics.js";

const TEAM_KEY = "team";
const TALLY_KEY = "teamTallyDelta";

export function loadOrAssignTeam() {
  let team = loadState(TEAM_KEY, null);
  if (!team) {
    team = TEAM_IDS[Math.floor(Math.random() * TEAM_IDS.length)];
    saveState(TEAM_KEY, team);
    track("team_selected", { team });
  }
  return team;
}

export function loadLocalTallyDelta() {
  return loadState(TALLY_KEY, 0);
}

export function addToLocalTally(delta) {
  const current = loadLocalTallyDelta();
  const next = current + delta;
  saveState(TALLY_KEY, next);
  return next;
}
