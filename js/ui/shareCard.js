// Draws a shareable "score card" PNG for the current click count. Pure
// canvas rendering - callers decide what to do with the resulting blob
// (native share sheet, download link, etc). See main.js for that wiring.
const WIDTH = 1200;
const HEIGHT = 630;
const FONT = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

const formatter = new Intl.NumberFormat("en-US");

export function renderShareCard(clicks) {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");

  const bg = ctx.createRadialGradient(WIDTH / 2, 0, 0, WIDTH / 2, 0, HEIGHT * 1.1);
  bg.addColorStop(0, "#3b0764");
  bg.addColorStop(0.65, "#1a0b2e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.textAlign = "center";

  const titleGradient = ctx.createLinearGradient(WIDTH * 0.25, 0, WIDTH * 0.75, 0);
  titleGradient.addColorStop(0, "#f472b6");
  titleGradient.addColorStop(0.55, "#a855f7");
  titleGradient.addColorStop(1, "#fbbf24");
  ctx.fillStyle = titleGradient;
  ctx.font = `900 56px ${FONT}`;
  ctx.fillText("BUTTON BLAM", WIDTH / 2, 150);

  ctx.fillStyle = "#fbbf24";
  ctx.font = `900 140px ${FONT}`;
  ctx.fillText(formatter.format(clicks), WIDTH / 2, 340);

  ctx.fillStyle = "#f7f3ff";
  ctx.font = `700 40px ${FONT}`;
  ctx.fillText(clicks === 1 ? "click. So far." : "clicks. So far.", WIDTH / 2, 400);

  ctx.fillStyle = "rgba(247, 243, 255, 0.6)";
  ctx.font = `600 28px ${FONT}`;
  ctx.fillText("buttonblam.com", WIDTH / 2, 480);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
