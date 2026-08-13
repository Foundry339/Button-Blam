/** Show a short-lived "Achievement Unlocked" toast for a milestone. */
export function showAchievementToast(containerEl, milestone) {
  const toast = document.createElement("div");
  toast.className = "achievement-toast";
  toast.innerHTML = `
    <span class="achievement-toast__eyebrow">Achievement Unlocked</span>
    <span class="achievement-toast__title">${milestone.title}</span>
  `;
  containerEl.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 2600);
}
