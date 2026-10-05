import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middleware/auth.js";

const router = Router();

const createProxySchema = z.object({
  name: z.string().min(2),
  targetUrl: z.string().url(),
  protocol: z.enum(["HTTP", "HTTPS", "SOCKS5"]).optional(),
  status: z.enum(["ONLINE", "OFFLINE", "PAUSED"]).optional(),
});

router.get("/", async (req: AuthRequest, res) => {
  const proxies = await prisma.proxy.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
  });

  return res.json(proxies);
});

router.post("/", async (req: AuthRequest, res) => {
  const parsed = createProxySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const proxy = await prisma.proxy.create({
    data: {
      name: parsed.data.name,
      targetUrl: parsed.data.targetUrl,
      protocol: parsed.data.protocol ?? "HTTP",
      status: parsed.data.status ?? "ONLINE",
      userId: req.user!.id,
    },
  });

  return res.status(201).json(proxy);
});

router.put("/:id", async (req: AuthRequest, res) => {
  const parsed = createProxySchema.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const proxy = await prisma.proxy.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!proxy) {
    return res.status(404).json({ error: "Proxy not found" });
  }

  const updated = await prisma.proxy.update({
    where: { id: proxy.id },
    data: parsed.data,
  });

  return res.json(updated);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const proxy = await prisma.proxy.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!proxy) {
    return res.status(404).json({ error: "Proxy not found" });
  }

  await prisma.proxy.delete({ where: { id: proxy.id } });

  return res.json({ success: true });
});

router.get("/:id", async (req: AuthRequest, res) => {
  const proxy = await prisma.proxy.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!proxy) {
    return res.status(404).json({ error: "Proxy not found" });
  }

  return res.json(proxy);
});

export default router;
