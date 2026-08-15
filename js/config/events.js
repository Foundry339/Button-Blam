// Special event pool rolled on every click.
// "weight" controls relative probability - a bigger number fires more often.
// NONE_WEIGHT is the implicit "nothing happens" outcome so common events stay
// occasional and rare/visual events stay genuinely rare.
export const NONE_WEIGHT = 820;

export const EVENTS = [
  // Common - just a fun message, no side effects.
  { id: "likes-you", weight: 18, message: "THE BUTTON LIKES YOU.", tier: "common" },
  { id: "still-doing-this", weight: 18, message: "ARE YOU STILL DOING THIS?", tier: "common" },
  { id: "productive", weight: 18, message: "YOU COULD BE DOING SOMETHING PRODUCTIVE.", tier: "common" },
  { id: "impressive", weight: 14, message: "IMPRESSIVE.", tier: "common" },
  { id: "why", weight: 14, message: "WHY?", tier: "common" },
  { id: "seriously", weight: 14, message: "SERIOUSLY?", tier: "common" },
  { id: "dont-stop", weight: 14, message: "DON'T STOP NOW.", tier: "common" },
  { id: "demands-more", weight: 10, message: "THE BUTTON DEMANDS MORE.", tier: "common" },
  { id: "terrible-decision", weight: 10, message: "YOU HAVE MADE A TERRIBLE DECISION.", tier: "common" },
  { id: "more-blam", weight: 14, message: "MORE BLAM!", tier: "common" },
  { id: "blam-blam-blam", weight: 14, message: "BLAM! BLAM! BLAM!", tier: "common" },
  { id: "got-blam", weight: 14, message: "GOT BLAM?", tier: "common" },
  { id: "how-you-blam", weight: 14, message: "THAT'S HOW YOU BLAM!", tier: "common" },
  { id: "blam-level-max", weight: 14, message: "BLAM LEVEL: MAXIMUM.", tier: "common" },
  { id: "blam-is-real", weight: 14, message: "THE BLAM IS REAL.", tier: "common" },
  { id: "blam-feels-like", weight: 14, message: "IS THIS WHAT BLAM FEELS LIKE?", tier: "common" },
  { id: "blam-never-stops", weight: 14, message: "BLAM NEVER STOPS.", tier: "common" },
  { id: "certified-blam", weight: 14, message: "CERTIFIED BLAM.", tier: "common" },

  // Rare - temporarily changes the button's look or behavior.
  { id: "shrink", weight: 4, message: "THE BUTTON SHRINKS AWAY.", visual: "shrink", duration: 3000, tier: "rare" },
  { id: "grow", weight: 4, message: "THE BUTTON GROWS BOLD.", visual: "grow", duration: 3000, tier: "rare" },
  { id: "shake", weight: 5, message: "THE BUTTON IS UNSTABLE.", visual: "shake", duration: 1200, tier: "rare" },
  { id: "text-swap", weight: 4, message: "THE BUTTON HAS THOUGHTS.", visual: "textSwap", duration: 2500, tier: "rare" },
  { id: "vanish", weight: 3, message: "WHERE DID IT GO?", visual: "vanish", duration: 1000, tier: "rare" },
];

// Alternate button labels shown briefly during the "textSwap" event.
export const BUTTON_TEXT_SWAPS = [
  "CLICK ME AGAIN",
  "DO IT.",
  "ONE MORE.",
  "AGAIN.",
  "FEED ME",
  "BLAM!",
  "I DARE YOU",
];
