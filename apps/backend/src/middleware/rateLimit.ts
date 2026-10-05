import { Request, Response, NextFunction } from "express";
import { redisClient } from "../lib/redis.js";

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const ip = req.ip || "unknown";
    const key = `rate-limit:${ip}`;

    const current = await redisClient.get(key);
    const count = current ? Number(current) : 0;

    if (count >= 60) {
      return res.status(429).json({ error: "Too many requests" });
    }

    await redisClient.set(key, String(count + 1), { EX: 60 });
    next();
  } catch {
    next();
  }
}
