import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/letsgoplay",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
};
