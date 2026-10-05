import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import pino from "pino";

import { env } from "./config/env.js";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import proxyRoutes from "./routes/proxies.js";
import { checkAuth } from "./middleware/auth.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";
import { ensureRedisConnected } from "./lib/redis.js";

dotenv.config();

const app = express();
const logger = pino();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimitMiddleware);

app.get("/", (_req, res) => {
  res.json({ app: "letsgoplay", status: "running" });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/proxies", checkAuth, proxyRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error(err);
  res.status(500).json({
    error: "Internal server error",
    message: env.nodeEnv === "development" ? err.message : undefined,
  });
});

async function start() {
  await ensureRedisConnected();
  app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });
}

start();
