// Fireworks show for the "every 1,000 clicks" milestone-adjacent moments -
// staggered shells rise from random spots along the bottom of the screen
// and burst into a radial spray of particles, unlike the falling rain used
// for the real achievement milestones.

const FIREWORK_COLORS = ["#ff5964", "#ffcc00", "#5ce1e6", "#7cff6b", "#ff8bd1", "#ffffff"];
const MAX_ACTIVE_SHOWS = 2;
const MIN_SHELLS = 4;
const MAX_SHELLS = 6;
const MIN_PARTICLES = 26;
const MAX_PARTICLES = 34;
const LAUNCH_WINDOW_MS = 1400;
const RISE_MS = 550;
const BURST_MS = 950;

let activeShows = 0;

export function spawnFireworks() {
  if (activeShows >= MAX_ACTIVE_SHOWS) return;

  const layer = document.createElement("div");
  layer.className = "fireworks-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const shellCount = MIN_SHELLS + Math.floor(Math.random() * (MAX_SHELLS - MIN_SHELLS + 1));
  activeShows += 1;
  let remainingShells = shellCount;

  const onShellDone = () => {
    remainingShells -= 1;
    if (remainingShells <= 0) {
      layer.remove();
      activeShows = Math.max(0, activeShows - 1);
    }
  };

  for (let i = 0; i < shellCount; i++) {
    const delay = (i / shellCount) * LAUNCH_WINDOW_MS + Math.random() * 200;
    launchShell(layer, delay, onShellDone);
  }
}

function launchShell(layer, delayMs, onShellDone) {
  const leftVw = 15 + Math.random() * 70;
  const apexVh = 20 + Math.random() * 35;
  const riseDistance = window.innerHeight * (1 - apexVh / 100);
  const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

  const trail = document.createElement("span");
  trail.className = "firework-trail";
  trail.style.left = `${leftVw}vw`;
  trail.style.background = color;
  trail.style.boxShadow = `0 0 6px 2px ${color}`;
  trail.style.setProperty("--fw-rise", `-${riseDistance}px`);
  trail.style.animationDuration = `${RISE_MS}ms`;
  trail.style.animationDelay = `${delayMs}ms`;

  layer.appendChild(trail);
  trail.addEventListener(
    "animationend",
    () => {
      trail.remove();
      burst(layer, leftVw, apexVh, color, onShellDone);
    },
    { once: true }
  );
}

function burst(layer, leftVw, topVh, color, onShellDone) {
  const count = MIN_PARTICLES + Math.floor(Math.random() * (MAX_PARTICLES - MIN_PARTICLES + 1));
  let remaining = count;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "firework-particle";
    particle.style.left = `${leftVw}vw`;
    particle.style.top = `${topVh}vh`;
    particle.style.background = color;

    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
    const distance = 60 + Math.random() * 90;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance + 40;

    particle.style.setProperty("--fw-tx", `${tx}px`);
    particle.style.setProperty("--fw-ty", `${ty}px`);
    particle.style.animationDuration = `${BURST_MS + Math.random() * 300}ms`;

    layer.appendChild(particle);
    particle.addEventListener(
      "animationend",
      () => {
        particle.remove();
        remaining -= 1;
        if (remaining <= 0) onShellDone();
      },
      { once: true }
    );
  }
}
