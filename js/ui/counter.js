const formatter = new Intl.NumberFormat("en-US");

export function renderCounter(counterEl, total) {
  counterEl.textContent = `You've clicked: ${formatter.format(total)} time${total === 1 ? "" : "s"}`;
  counterEl.classList.remove("counter-pop");
  void counterEl.offsetWidth;
  counterEl.classList.add("counter-pop");
}
