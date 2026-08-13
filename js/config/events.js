// Special event pool rolled on every click.
// "weight" controls relative probability — a bigger number fires more often.
// NONE_WEIGHT is the implicit "nothing happens" outcome so common events stay
// occasional and rare/visual events stay genuinely rare.
export const NONE_WEIGHT = 820;

export const EVENTS = [
  // Common — just a fun message, no side effects.
  { id: "bonus5", weight: 26, message: "+5 BONUS CLICKS!", bonus: 5, tier: "common" },
  { id: "bonus10", weight: 16, message: "+10 CLICKS!", bonus: 10, tier: "common" },
  { id: "double", weight: 14, message: "DOUBLE CLICK BONUS!", multiplyThisClick: 2, tier: "common" },
  { id: "likes-you", weight: 18, message: "THE BUTTON LIKES YOU.", tier: "common" },
  { id: "still-doing-this", weight: 18, message: "ARE YOU STILL DOING THIS?", tier: "common" },
  { id: "productive", weight: 18, message: "YOU COULD BE DOING SOMETHING PRODUCTIVE.", tier: "common" },
  { id: "impressive", weight: 14, message: "IMPRESSIVE.", tier: "common" },
  { id: "why", weight: 14, message: "WHY?", tier: "common" },
  { id: "seriously", weight: 14, message: "SERIOUSLY?", tier: "common" },
  { id: "dont-stop", weight: 14, message: "DON'T STOP NOW.", tier: "common" },
  { id: "demands-more", weight: 10, message: "THE BUTTON DEMANDS MORE.", tier: "common" },
  { id: "terrible-decision", weight: 10, message: "YOU HAVE MADE A TERRIBLE DECISION.", tier: "common" },

  // Rare — temporarily changes the button's look or behavior.
  { id: "shrink", weight: 4, message: "THE BUTTON SHRINKS AWAY.", visual: "shrink", duration: 3000, tier: "rare" },
  { id: "grow", weight: 4, message: "THE BUTTON GROWS BOLD.", visual: "grow", duration: 3000, tier: "rare" },
  { id: "shake", weight: 5, message: "THE BUTTON IS UNSTABLE.", visual: "shake", duration: 1200, tier: "rare" },
  { id: "text-swap", weight: 4, message: "THE BUTTON HAS THOUGHTS.", visual: "textSwap", duration: 2500, tier: "rare" },
  { id: "vanish", weight: 3, message: "WHERE DID IT GO?", visual: "vanish", duration: 1000, tier: "rare" },
  { id: "worth-10x", weight: 3, message: "THE BUTTON IS NOW WORTH 10 CLICKS!", visual: "multiplier", multiplier: 10, duration: 8000, tier: "rare" },
  { id: "worth-100x", weight: 1, message: "THE BUTTON IS WORTH 100 CLICKS!!!", visual: "multiplier", multiplier: 100, duration: 5000, tier: "ultra-rare" },
];

// Alternate button labels shown briefly during the "textSwap" event.
export const BUTTON_TEXT_SWAPS = [
  "CLICK ME AGAIN",
  "DO IT.",
  "ONE MORE.",
  "AGAIN.",
  "FEED ME",
  "I DARE YOU",
];
