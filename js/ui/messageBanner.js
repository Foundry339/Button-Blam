let hideTimer = null;

export function showMessage(bannerEl, text) {
  if (hideTimer) clearTimeout(hideTimer);
  bannerEl.textContent = text;
  bannerEl.classList.add("is-visible");
  hideTimer = window.setTimeout(() => {
    bannerEl.classList.remove("is-visible");
  }, 2200);
}
