// App bootstrap: wires config + core logic + UI modules together.
// This is the only file that touches all the layers at once - everything
// else stays focused on one concern (data, game logic, or rendering).
import { MILESTONES } from "./config/milestones.js";

// These milestones rain hamburgers instead of the usual confetti.
const HAMBURGER_RAIN_THRESHOLDS = new Set([1000, 1500, 3000]);
// These milestones rain gemstones instead of the usual confetti.
const GEM_RAIN_THRESHOLDS = new Set([6500, 15000, 30000]);
// The top milestone rains partying faces instead of the usual confetti.
const PARTY_RAIN_THRESHOLDS = new Set([1000000]);
// These milestones rain money bags instead of the usual confetti.
const MONEY_RAIN_THRESHOLDS = new Set([50000, 500000]);
// Every 1,000 clicks gets a fireworks show, except thresholds that already
// have their own milestone achievement + rain effect.
const MILESTONE_THRESHOLDS = new Set(MILESTONES.map((m) => m.threshold));

import { rollEvent } from "./core/clickEngine.js";
import { loadUnlockedAchievements, checkNewlyUnlocked } from "./core/achievementEngine.js";
import { loadSightingCounts, recordSighting } from "./core/sightingsEngine.js";
import { loadStats, refreshStreakForNewSession, applyClick } from "./core/statsEngine.js";
import { resetAll } from "./core/storage.js";
import { loadOrAssignTeam, loadLocalTallyDelta, addToLocalTally } from "./core/teamEngine.js";
import { fetchGlobalStats, fetchTeamTotals, fetchLeaderboard, submitScore } from "./core/api.js";
import { loadSavedLeaderboardName, saveLeaderboardName } from "./core/leaderboardEngine.js";
import { track } from "./core/analytics.js";

import { pulseButton, punchButton, spawnFloatingValue, applyVisualEffect, startColorCycle, tickColorCycle } from "./ui/button.js";
import { playClickBloop, playPunchThump, playPhoenixSizzle } from "./ui/sound.js";
import { maybeSpawnBalloon } from "./ui/balloonEffect.js";
import { maybeSpawnRocket } from "./ui/rocketEffect.js";
import { maybeSpawnUfo } from "./ui/ufoEffect.js";
import { maybeSpawnDuck } from "./ui/duckEffect.js";
import { maybeSpawnFire } from "./ui/fireEffect.js";
import { maybeSpawnDonutRain } from "./ui/donutEffect.js";
import { maybeSpawnEgg } from "./ui/eggEffect.js";
import { maybeTriggerFishPowerUp, spawnFishSwimOut, spawnBubbleBurst, BUBBLE_POWER_UP_CLICKS } from "./ui/bubbleEffect.js";
import { maybeTriggerStormPowerUp, spawnStormCloudReveal, spawnLightningBurst, spawnRainDrizzle, STORM_POWER_UP_CLICKS } from "./ui/stormEffect.js";
import { maybeTriggerDiscoPowerUp, spawnDiscoBallReveal, spawnStrobeBurst, DISCO_POWER_UP_CLICKS } from "./ui/discoEffect.js";
import { maybeTriggerMoaiPowerUp, spawnMoaiSlamReveal, spawnClickImpact, MOAI_POWER_UP_CLICKS } from "./ui/moaiEffect.js";
import { maybeTriggerPhoenixPowerUp, spawnPhoenixRebirth, spawnEmberFloatingValue, PHOENIX_POWER_UP_CLICKS } from "./ui/phoenixEffect.js";
import { renderCounter } from "./ui/counter.js";
import { showMessage } from "./ui/messageBanner.js";
import { showAchievementToast } from "./ui/achievementToast.js";
import { spawnConfettiRain } from "./ui/confettiEffect.js";
import { spawnHamburgerRain } from "./ui/hamburgerRainEffect.js";
import { spawnGemRain } from "./ui/gemRainEffect.js";
import { spawnPartyRain } from "./ui/partyRainEffect.js";
import { spawnMoneyRain } from "./ui/moneyRainEffect.js";
import { spawnFireworks } from "./ui/fireworksEffect.js";
import { renderAchievementsGrid } from "./ui/achievementsPanel.js";
import { renderSightingsGrid } from "./ui/sightingsPanel.js";
import { renderPersonalStats } from "./ui/statsPanel.js";
import { renderGlobalStats, startAmbientTicker } from "./ui/globalStatsPanel.js";
import { renderLeaderboard } from "./ui/leaderboardPanel.js";
import { initScoreForm, setScoreFormBusy, setScoreFormStatus, isValidLeaderboardName } from "./ui/scoreSubmitPanel.js";
import { renderShareCard } from "./ui/shareCard.js";
import { renderTeamWar } from "./ui/teamWarPanel.js";

const el = (id) => document.getElementById(id);

const dom = {
  stage: el("button-stage"),
  button: el("main-button"),
  buttonLabel: el("button-label"),
  counter: el("click-counter"),
  message: el("event-message"),
  achievementsGrid: el("achievements-grid"),
  sightingsGrid: el("sightings-grid"),
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
  resetButton: el("reset-button"),
  scoreSubmitForm: el("score-submit-form"),
  scoreSubmitName: el("score-submit-name"),
  scoreSubmitButton: el("score-submit-button"),
  scoreSubmitStatus: el("score-submit-status"),
  shareScoreButton: el("share-score-button"),
};

// ---- Persisted state -------------------------------------------------
let stats = loadStats();
stats = refreshStreakForNewSession(stats);
const unlockedAchievements = loadUnlockedAchievements();
const sightingCounts = loadSightingCounts();
const userTeam = loadOrAssignTeam();
let savedLeaderboardName = loadSavedLeaderboardName();

// ---- Session-only state -----------------------------------------------
let sessionClicks = 0;
let teamTotals = { red: 0, blue: 0 };
let leaderboardEntries = [];
// Not persisted - a refresh mid-power-up just ends it early, which is fine
// for a bonus phase like this.
let bubblePowerUpClicksRemaining = 0;
let stormPowerUpClicksRemaining = 0;
let discoPowerUpClicksRemaining = 0;
let moaiPowerUpClicksRemaining = 0;
let phoenixPowerUpClicksRemaining = 0;

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
  // Once the user has a real entry on the server-side board (fetched under
  // their saved name), skip the local "YOU" merge so they don't appear twice.
  const localUserClicks = savedLeaderboardName ? 0 : stats.totalClicks;
  renderLeaderboard(dom.leaderboardList, leaderboardEntries, localUserClicks);
}

// ---- Initial render -----------------------------------------------------
renderPersonal();
renderAchievementsGrid(dom.achievementsGrid, MILESTONES, unlockedAchievements);
renderSightingsGrid(dom.sightingsGrid, sightingCounts);
initScoreForm(dom, savedLeaderboardName);

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
  const delta = 1;

  sessionClicks += delta;
  stats = applyClick(stats, delta, sessionClicks);

  pulseButton(dom.button);
  // Swap in the flame-colored "+N" and ember trail while phoenix's power-up
  // is active, back to the normal gold pop once it ends.
  if (phoenixPowerUpClicksRemaining > 0) {
    spawnEmberFloatingValue(dom.stage, delta, clientX, clientY);
  } else {
    spawnFloatingValue(dom.stage, delta, clientX, clientY);
  }
  // Swap in a punchy thump for moai's punches or a sizzle for phoenix's
  // embers, back to the normal bloop once whichever power-up ends.
  if (moaiPowerUpClicksRemaining > 0) {
    playPunchThump();
  } else if (phoenixPowerUpClicksRemaining > 0) {
    playPhoenixSizzle();
  } else {
    playClickBloop();
  }

  let sawEffect = false;

  // Fish/storm/disco/moai/phoenix can only be sighted between power-ups,
  // and only one power-up runs at a time - bubbles, lightning, strobing,
  // punches, and embers all going at once would just be visual noise. Each
  // sighting itself is the whole spectacle on its click; the guaranteed
  // effect starts on the clicks after it.
  const powerUpActive =
    bubblePowerUpClicksRemaining > 0 ||
    stormPowerUpClicksRemaining > 0 ||
    discoPowerUpClicksRemaining > 0 ||
    moaiPowerUpClicksRemaining > 0 ||
    phoenixPowerUpClicksRemaining > 0;

  if (!powerUpActive && maybeTriggerFishPowerUp()) {
    recordSighting(sightingCounts, "fish");
    sawEffect = true;
    spawnFishSwimOut(dom.button);
    bubblePowerUpClicksRemaining = BUBBLE_POWER_UP_CLICKS;
  } else if (!powerUpActive && maybeTriggerStormPowerUp()) {
    recordSighting(sightingCounts, "storm");
    sawEffect = true;
    spawnStormCloudReveal(dom.button);
    stormPowerUpClicksRemaining = STORM_POWER_UP_CLICKS;
  } else if (!powerUpActive && maybeTriggerDiscoPowerUp()) {
    recordSighting(sightingCounts, "disco");
    sawEffect = true;
    spawnDiscoBallReveal(dom.button);
    discoPowerUpClicksRemaining = DISCO_POWER_UP_CLICKS;
  } else if (!powerUpActive && maybeTriggerMoaiPowerUp()) {
    recordSighting(sightingCounts, "moai");
    sawEffect = true;
    spawnMoaiSlamReveal(dom.button);
    moaiPowerUpClicksRemaining = MOAI_POWER_UP_CLICKS;
  } else if (!powerUpActive && maybeTriggerPhoenixPowerUp()) {
    recordSighting(sightingCounts, "phoenix");
    sawEffect = true;
    spawnPhoenixRebirth(dom.button);
    phoenixPowerUpClicksRemaining = PHOENIX_POWER_UP_CLICKS;
  } else if (bubblePowerUpClicksRemaining > 0) {
    // Bubbles crowd out every other sighting for the duration of the power-up.
    spawnBubbleBurst(dom.stage, dom.button);
    bubblePowerUpClicksRemaining -= 1;
  } else if (stormPowerUpClicksRemaining > 0) {
    // Same deal for lightning, plus a scattering of rain alongside it.
    spawnLightningBurst(dom.stage, dom.button);
    spawnRainDrizzle(dom.stage, dom.button);
    stormPowerUpClicksRemaining -= 1;
  } else if (discoPowerUpClicksRemaining > 0) {
    // Same deal for the strobe.
    spawnStrobeBurst(dom.stage, dom.button);
    discoPowerUpClicksRemaining -= 1;
  } else if (moaiPowerUpClicksRemaining > 0) {
    // Same deal for the punch - lands right where the user clicked.
    punchButton(dom.button);
    spawnClickImpact(clientX, clientY);
    moaiPowerUpClicksRemaining -= 1;
  } else if (phoenixPowerUpClicksRemaining > 0) {
    // The ember floating value swap above already delivers this click's
    // effect - just count it down here.
    phoenixPowerUpClicksRemaining -= 1;
  } else {
    if (maybeSpawnBalloon(dom.stage, dom.button)) {
      recordSighting(sightingCounts, "balloon");
      sawEffect = true;
    }
    if (maybeSpawnRocket(dom.stage, dom.button)) {
      recordSighting(sightingCounts, "rocket");
      sawEffect = true;
    }
    if (maybeSpawnUfo(dom.stage, dom.button, dom.buttonLabel)) {
      recordSighting(sightingCounts, "ufo");
      sawEffect = true;
    }
    if (maybeSpawnDuck(dom.stage, dom.button)) {
      recordSighting(sightingCounts, "duck");
      sawEffect = true;
    }
    if (maybeSpawnFire(dom.stage, dom.button)) {
      recordSighting(sightingCounts, "fire");
      sawEffect = true;
      startColorCycle();
    }
    if (maybeSpawnDonutRain()) {
      recordSighting(sightingCounts, "donut");
      sawEffect = true;
    }
    if (maybeSpawnEgg(dom.stage, dom.button)) {
      recordSighting(sightingCounts, "egg");
      sawEffect = true;
    }
  }
  if (sawEffect) renderSightingsGrid(dom.sightingsGrid, sightingCounts);

  tickColorCycle(dom.button);

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
  }

  const newlyUnlocked = checkNewlyUnlocked(stats.totalClicks, unlockedAchievements);
  newlyUnlocked.forEach((milestone, i) => {
    window.setTimeout(() => {
      showAchievementToast(dom.toastContainer, milestone);
      if (HAMBURGER_RAIN_THRESHOLDS.has(milestone.threshold)) {
        spawnHamburgerRain();
      } else if (GEM_RAIN_THRESHOLDS.has(milestone.threshold)) {
        spawnGemRain();
      } else if (PARTY_RAIN_THRESHOLDS.has(milestone.threshold)) {
        spawnPartyRain();
      } else if (MONEY_RAIN_THRESHOLDS.has(milestone.threshold)) {
        spawnMoneyRain();
      } else {
        spawnConfettiRain();
      }
      track("milestone_reached", { id: milestone.id, threshold: milestone.threshold });
      track("achievement_unlocked", { id: milestone.id, title: milestone.title });
    }, i * 700);
  });
  if (newlyUnlocked.length) {
    renderAchievementsGrid(dom.achievementsGrid, MILESTONES, unlockedAchievements);
    renderPersonal();
  }

  // Relies on delta always being 1 (see above) so totalClicks never skips
  // past a multiple of 1000.
  if (stats.totalClicks % 1000 === 0 && !MILESTONE_THRESHOLDS.has(stats.totalClicks)) {
    spawnFireworks();
    track("fireworks_triggered", { totalClicks: stats.totalClicks });
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

dom.resetButton?.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Reset all progress? This wipes your total clicks, achievements, and rare sightings on this device. This can't be undone."
  );
  if (!confirmed) return;
  track("progress_reset");
  resetAll();
  window.location.reload();
});

dom.scoreSubmitForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = dom.scoreSubmitName.value.trim();
  if (!isValidLeaderboardName(name)) {
    setScoreFormStatus(dom, "error", "Name must be 1-20 characters (letters, numbers, spaces, . ! ? _ -).");
    return;
  }

  setScoreFormBusy(dom, true);
  setScoreFormStatus(dom, "idle", "");

  submitScore({ name, clicks: stats.totalClicks, startedAt: stats.firstPlayedAt })
    .then((result) => {
      if (!result.ok) {
        setScoreFormStatus(dom, "error", result.error ?? "Couldn't save your score. Try again.");
        return;
      }

      savedLeaderboardName = name;
      saveLeaderboardName(name);
      track("score_submitted", { clicks: stats.totalClicks });
      setScoreFormStatus(dom, "success", `Saved as "${name}"! Submit again any time your score improves.`);

      fetchLeaderboard().then((leaderboard) => {
        leaderboardEntries = leaderboard;
        renderBoard();
      });
    })
    .catch(() => {
      setScoreFormStatus(dom, "error", "Network error - try again.");
    })
    .finally(() => {
      setScoreFormBusy(dom, false);
    });
});

const shareCountFormatter = new Intl.NumberFormat("en-US");

dom.shareScoreButton?.addEventListener("click", async () => {
  dom.shareScoreButton.disabled = true;
  try {
    const blob = await renderShareCard(stats.totalClicks);
    const shareText = `I've clicked the Button Blam button ${shareCountFormatter.format(stats.totalClicks)} times.`;
    const file = new File([blob], "button-blam-score.png", { type: "image/png" });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "Button Blam", text: shareText, url: "https://buttonblam.com/" });
      return;
    }

    if (navigator.share) {
      // No file-attachment support on this browser - share text + link instead.
      await navigator.share({ title: "Button Blam", text: shareText, url: "https://buttonblam.com/" });
      return;
    }

    // No Web Share API at all (most desktop browsers) - download the card.
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "button-blam-score.png";
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    if (err.name !== "AbortError") {
      // AbortError just means the user closed the native share sheet - anything
      // else (e.g. canvas/share failure) is worth knowing about while this is new.
      console.error("Share failed:", err);
    }
  } finally {
    dom.shareScoreButton.disabled = false;
  }
});
