const formatter = new Intl.NumberFormat("en-US");

const SIGHTINGS = [
  { id: "balloon", icon: "\u{1F388}", title: "Balloons" },
  { id: "rocket", icon: "\u{1F680}", title: "Rockets" },
  { id: "ufo", icon: "\u{1F6F8}", title: "UFO" },
  { id: "duck", icon: "\u{1F986}", title: "Duck" },
  { id: "fire", icon: "\u{1F525}", title: "Fire" },
  { id: "donut", icon: "\u{1F369}", title: "Donut" },
  { id: "fish", icon: "\u{1F420}", title: "Fish" },
  { id: "storm", icon: "\u{1F329}\u{FE0F}", title: "Storm" },
  { id: "egg", icon: "\u{1F95A}", title: "Egg" },
  { id: "disco", icon: "\u{1FAA9}", title: "Disco" },
  { id: "moai", icon: "\u{1F5FF}", title: "Moai" },
  { id: "phoenix", icon: "\u{1F426}\u{200D}\u{1F525}", title: "Phoenix" },
  { id: "pinata", icon: "\u{1FA85}", title: "Piñata" },
  { id: "jackpot", icon: "\u{1F3B0}", title: "Jackpot" },
];

/** Renders the grid of rare-effect sighting counters, reusing the achievement badge look. */
export function renderSightingsGrid(gridEl, counts) {
  gridEl.innerHTML = SIGHTINGS.map((s) => {
    const count = counts[s.id] ?? 0;
    const seen = count > 0;
    return `
      <li class="achievement-badge${seen ? " is-unlocked" : ""}" title="${s.title} - ${formatter.format(count)} seen">
        <span class="achievement-badge__icon">${s.icon}</span>
        <span class="achievement-badge__title">${s.title}</span>
        <span class="achievement-badge__threshold">${formatter.format(count)}</span>
      </li>
    `;
  }).join("");
}
