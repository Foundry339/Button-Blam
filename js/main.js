// App bootstrap: wires config + core logic + UI modules together.
// This is the only file that touches all the layers at once — everything
// else stays focused on one concern (data, game logic, or rendering).
import { MILESTONES } from "./config/milestones.js";

import { rollEvent, resolveClickValue } from "./core/clickEngine.js";
import { loadUnlockedAchievements, checkNewlyUnlocked } from "./core/achievementEngine.js";
import { loadStats, refreshStreakForNewSession, applyClick } from "./core/statsEngine.js";
import { loadOrAssignTeam, loadLocalTallyDelta, addToLocalTally } from "./core/teamEngine.js";
import { fetchGlobalStats, fetchTeamTotals, fetchLeaderboard } from "./core/api.js";
import { track } from "./core/analytics.js";

import { pulseButton, spawnFloatingValue, applyVisualEffect, setMultiplierVisual } from "./ui/button.js";
import { renderCounter } from "./ui/counter.js";
import { showMessage } from "./ui/messageBanner.js";
import { showAchievementToast } from "./ui/achievementToast.js";
import { renderAchievementsGrid } from "./ui/achievementsPanel.js";
import { renderPersonalStats } from "./ui/statsPanel.js";
import { renderGlobalStats, startAmbientTicker } from "./ui/globalStatsPanel.js";
import { renderLeaderboard } from "./ui/leaderboardPanel.js";
import { renderTeamWar } from "./ui/teamWarPanel.js";

const el = (id) => document.getElementById(id);

const dom = {
  stage: el("button-stage"),
  button: el("main-button"),
  buttonLabel: el("button-label"),
  counter: el("click-counter"),
  message: el("event-message"),
  achievementsGrid: el("achievements-grid"),
  toastContainer: el("achievement-toast-container"),
  statTotal: el("stat-total"),
  statStreak: el("stat-streak"),
  statHighestSession: el("stat-highest-session"),
  statAchievements: el("stat-achievements"),
  globalAllTime: el("global-all-time"),
  globalToday: el("global-today"),
  yourTeam: el("team-your-team"),
  teamCard: el("team-card"),
  teamRedCount: el("team-red-count"),
  teamBlueCount: el("team-blue-count"),
  teamRedBar: el("team-red-bar"),
  teamBlueBar: el("team-blue-bar"),
  leaderboardList: el("leaderboard-list"),
  leaderboardSection: el("leaderboard"),
};

// ---- Persisted state -------------------------------------------------
let stats = loadStats();
stats = refreshStreakForNewSession(stats);
const unlockedAchievements = loadUnlockedAchievements();
const userTeam = loadOrAssignTeam();

// ---- Session-only state -----------------------------------------------
let sessionClicks = 0;
let activeMultiplier = 1;
let multiplierRevertTimer = null;
let teamTotals = { red: 0, blue: 0 };
let leaderboardEntries = [];

function renderPersonal() {
  renderCounter(dom.counter, stats.totalClicks);
  renderPersonalStats(
    { total: dom.statTotal, streak: dom.statStreak, highestSession: dom.statHighestSession, achievements: dom.statAchievements },
    stats,
    unlockedAchievements.size
  );
}

function renderTeam() {
  renderTeamWar(
    { yourTeam: dom.yourTeam, redCount: dom.teamRedCount, blueCount: dom.teamBlueCount, redBar: dom.teamRedBar, blueBar: dom.teamBlueBar, card: dom.teamCard },
    teamTotals.red,
    teamTotals.blue,
    userTeam
  );
}

function renderBoard() {
  renderLeaderboard(dom.leaderboardList, leaderboardEntries, stats.totalClicks);
}

// ---- Initial render -----------------------------------------------------
renderPersonal();
renderAchievementsGrid(dom.achievementsGrid, MILESTONES, unlockedAchievements);

Promise.all([fetchGlobalStats(), fetchTeamTotals(), fetchLeaderboard()]).then(
  ([globalStats, totals, leaderboard]) => {
    renderGlobalStats({ allTime: dom.globalAllTime, today: dom.globalToday }, globalStats);
    startAmbientTicker({ allTime: dom.globalAllTime, today: dom.globalToday }, globalStats);

    const localDelta = loadLocalTallyDelta();
    teamTotals = { ...totals };
    teamTotals[userTeam] += localDelta;
    renderTeam();

    leaderboardEntries = leaderboard;
    renderBoard();
  }
);

track("session_started");
window.addEventListener("beforeunload", () => track("session_ended"));

if (dom.leaderboardSection && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track("leaderboard_viewed");
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  observer.observe(dom.leaderboardSection);
}

// ---- The click, the whole point of this website -----------------------
function handleClick(clientX, clientY) {
  const event = rollEvent();
  const delta = resolveClickValue(activeMultiplier, event);

  sessionClicks += delta;
  stats = applyClick(stats, delta, sessionClicks);

  pulseButton(dom.button);
  spawnFloatingValue(dom.stage, delta, clientX, clientY);
  renderPersonal();

  track("button_clicked", { delta, eventId: event?.id ?? null });

  const localTally = addToLocalTally(delta);
  teamTotals[userTeam] += delta;
  void localTally;
  renderTeam();

  renderBoard();

  if (event) {
    showMessage(dom.message, event.message);
    applyVisualEffect(dom.button, dom.buttonLabel, event);

    if (event.visual === "multiplier") {
      activeMultiplier = event.multiplier;
      setMultiplierVisual(dom.button, activeMultiplier);
      if (multiplierRevertTimer) clearTimeout(multiplierRevertTimer);
      multiplierRevertTimer = window.setTimeout(() => {
        activeMultiplier = 1;
        setMultiplierVisual(dom.button, activeMultiplier);
      }, event.duration);
    }
  }

  const newlyUnlocked = checkNewlyUnlocked(stats.totalClicks, unlockedAchievements);
  newlyUnlocked.forEach((milestone, i) => {
    window.setTimeout(() => {
      showAchievementToast(dom.toastContainer, milestone);
      track("milestone_reached", { id: milestone.id, threshold: milestone.threshold });
      track("achievement_unlocked", { id: milestone.id, title: milestone.title });
    }, i * 700);
  });
  if (newlyUnlocked.length) {
    renderAchievementsGrid(dom.achievementsGrid, MILESTONES, unlockedAchievements);
    renderPersonal();
  }
}

// A native <button> already dispatches "click" for mouse, touch, and
// keyboard (Enter/Space) activation, so this one listener covers all of them.
dom.button.addEventListener("click", (e) => {
  const rect = dom.button.getBoundingClientRect();
  const x = e.clientX || rect.left + rect.width / 2;
  const y = e.clientY || rect.top + rect.height / 2;
  handleClick(x, y);
});
