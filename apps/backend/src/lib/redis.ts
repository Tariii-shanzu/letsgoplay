import { createClient } from "redis";
import { env } from "../config/env.js";

export const redisClient = createClient({
  url: env.redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export async function ensureRedisConnected() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
