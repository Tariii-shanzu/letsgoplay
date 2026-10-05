import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function checkAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
