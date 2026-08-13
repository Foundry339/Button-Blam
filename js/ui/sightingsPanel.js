const formatter = new Intl.NumberFormat("en-US");

const SIGHTINGS = [
  { id: "balloon", icon: "\u{1F388}", title: "Balloons" },
  { id: "rocket", icon: "\u{1F680}", title: "Rockets" },
  { id: "ufo", icon: "\u{1F6F8}", title: "UFO Abductions" },
  { id: "duck", icon: "\u{1F986}", title: "Duck" },
  { id: "fire", icon: "\u{1F525}", title: "Fire" },
  { id: "donut", icon: "\u{1F369}", title: "Donut" },
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
