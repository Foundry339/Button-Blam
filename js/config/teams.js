// Weekly "Button War" team definitions.
// Team assignment is local-only for now; see core/api.js for where a real
// backend would take over recording which team a user joined.
export const TEAMS = {
  red: { id: "red", name: "RED BUTTON", emoji: "\u{1F534}", color: "#ff4d5e" },
  blue: { id: "blue", name: "BLUE BUTTON", emoji: "\u{1F535}", color: "#3fa9ff" },
};

export const TEAM_IDS = Object.keys(TEAMS);
