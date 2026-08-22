import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const LEADERBOARD_KEY = "leaderboard:global";

const NAME_PATTERN = /^[a-zA-Z0-9 _.!?-]{1,20}$/;
const MAX_CLICKS = 10_000_000;
const MAX_CLICKS_PER_SECOND = 15;
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 5000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, clicks, startedAt } = req.body ?? {};

  if (typeof name !== "string" || !NAME_PATTERN.test(name.trim())) {
    res.status(400).json({ error: "Invalid name" });
    return;
  }

  if (!Number.isInteger(clicks) || clicks <= 0 || clicks > MAX_CLICKS) {
    res.status(400).json({ error: "Invalid score" });
    return;
  }

  const now = Date.now();
  if (
    typeof startedAt !== "number" ||
    !Number.isFinite(startedAt) ||
    startedAt > now + CLOCK_SKEW_MS ||
    startedAt < now - MAX_SESSION_AGE_MS
  ) {
    res.status(400).json({ error: "Invalid session" });
    return;
  }

  const elapsedSeconds = Math.max((now - startedAt) / 1000, 1);
  const rate = clicks / elapsedSeconds;
  if (rate > MAX_CLICKS_PER_SECOND) {
    res.status(400).json({ error: "Implausible score" });
    return;
  }

  await redis.zadd(LEADERBOARD_KEY, { gt: true }, { score: clicks, member: name.trim() });

  res.status(200).json({ ok: true });
}
