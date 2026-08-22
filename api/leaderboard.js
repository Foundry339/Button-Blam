import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const LEADERBOARD_KEY = "leaderboard:global";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const entries = await redis.zrange(LEADERBOARD_KEY, 0, 9, {
    rev: true,
    withScores: true,
  });

  const leaderboard = [];
  for (let i = 0; i < entries.length; i += 2) {
    leaderboard.push({ name: entries[i], clicks: entries[i + 1] });
  }

  res.status(200).json(leaderboard);
}
