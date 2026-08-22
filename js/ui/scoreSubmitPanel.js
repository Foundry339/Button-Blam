// Pure DOM rendering for the "save your score" form. Submission logic
// (validation, the fetch call, persisting the saved name) lives in main.js,
// same as the rest of this app's event wiring.
const NAME_PATTERN = /^[a-zA-Z0-9 _.!?-]{1,20}$/;

export function isValidLeaderboardName(name) {
  return NAME_PATTERN.test(name.trim());
}

/** Prefill the input with a previously-saved name, if any. */
export function initScoreForm(dom, savedName) {
  if (savedName) {
    dom.scoreSubmitName.value = savedName;
    setScoreFormStatus(dom, "success", `Saved as "${savedName}". Submit again any time your score improves.`);
  }
}

export function setScoreFormBusy(dom, busy) {
  dom.scoreSubmitName.disabled = busy;
  dom.scoreSubmitButton.disabled = busy;
  dom.scoreSubmitButton.textContent = busy ? "Saving..." : "Save Score";
}

/** @param {"idle" | "success" | "error"} state */
export function setScoreFormStatus(dom, state, message) {
  dom.scoreSubmitStatus.textContent = message ?? "";
  dom.scoreSubmitStatus.classList.toggle("score-submit__status--error", state === "error");
  dom.scoreSubmitStatus.classList.toggle("score-submit__status--success", state === "success");
}
