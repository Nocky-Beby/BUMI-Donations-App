import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/my", authenticate, async (req, res) => {
  const items = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return res.json({
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      message: item.message,
      type: item.type,
      channel: item.channel,
      status: String(item.status).toLowerCase(),
      read: Boolean(item.readAt),
      createdAt: item.createdAt,
    })),
  });
});

router.patch("/:id/read", authenticate, async (req, res) => {
  const existing = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user.id) {
    return res.status(404).json({ message: "Notification introuvable." });
  }

  const item = await prisma.notification.update({
    where: { id: req.params.id },
    data: { readAt: new Date(), status: existing.status === "PENDING" ? "READ" : existing.status },
  });

  return res.json({ message: "Notification marquée comme lue.", item });
});

export default router;
