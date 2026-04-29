import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { mapNeed } from "../utils/mappers.js";
import { logAudit } from "../utils/audit.js";
import { syncNeedLifecycle } from "../utils/needs.js";
import { emitRealtimeEvent } from "../utils/realtime.js";

const router = express.Router();
const writableStatuses = ["draft", "published", "satisfied", "closed", "archived", "open"];

router.get("/", authenticate, async (_req, res) => {
  const items = await prisma.need.findMany({ include: { updatedBy: true }, orderBy: { updatedAt: "desc" } });
  return res.json({ items: items.map(mapNeed) });
});

router.post("/", authenticate, authorize("admin", "manager"), async (req, res) => {
  const { title, category, description, imageUrl, priority = "medium", targetAmount = 0, targetQuantity = 0, unit = "unité", status = "published" } = req.body || {};

  if (!title || !category || !description) {
    return res.status(400).json({ message: "Titre, catégorie et description sont requis." });
  }

  const item = await prisma.need.create({
    data: {
      title,
      category,
      description,
      imageUrl: imageUrl || null,
      priority: String(priority).toUpperCase(),
      targetAmount: Number(targetAmount) || 0,
      targetQuantity: Number(targetQuantity) || 0,
      unit,
      updatedById: req.user.id,
      status: writableStatuses.includes(String(status).toLowerCase()) ? String(status).toUpperCase() : "PUBLISHED",
    },
    include: { updatedBy: true },
  });

  await syncNeedLifecycle(item.id, req.user.id);
  await logAudit({ actorId: req.user.id, action: "CREATE_NEED", entityType: "needs", entityId: item.id, details: { title, category } });
  emitRealtimeEvent("need.created", { needId: item.id });

  const refreshed = await prisma.need.findUnique({ where: { id: item.id }, include: { updatedBy: true } });
  return res.status(201).json({ message: "Besoin créé.", item: mapNeed(refreshed) });
});

router.patch("/:id", authenticate, authorize("admin", "manager"), async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.need.findUnique({ where: { id } });

  if (!existing) {
    return res.status(404).json({ message: "Besoin introuvable." });
  }

  const nextStatus = req.body?.status ? writableStatuses.includes(String(req.body.status).toLowerCase()) ? String(req.body.status).toUpperCase() : String(existing.status).toUpperCase() : String(existing.status).toUpperCase();

  await prisma.need.update({
    where: { id },
    data: {
      title: req.body?.title ?? existing.title,
      category: req.body?.category ?? existing.category,
      description: req.body?.description ?? existing.description,
      imageUrl: req.body?.imageUrl ?? existing.imageUrl,
      priority: String(req.body?.priority ?? existing.priority).toUpperCase(),
      targetQuantity: Number(req.body?.targetQuantity ?? existing.targetQuantity),
      currentQuantity: Number(req.body?.currentQuantity ?? existing.currentQuantity),
      targetAmount: Number(req.body?.targetAmount ?? existing.targetAmount),
      currentAmount: Number(req.body?.currentAmount ?? existing.currentAmount),
      unit: req.body?.unit ?? existing.unit,
      status: nextStatus,
      updatedById: req.user.id,
    },
    include: { updatedBy: true },
  });

  await syncNeedLifecycle(id, req.user.id);
  await logAudit({ actorId: req.user.id, action: "UPDATE_NEED", entityType: "needs", entityId: id, details: req.body || {} });
  emitRealtimeEvent("need.updated", { needId: id });

  const refreshed = await prisma.need.findUnique({ where: { id }, include: { updatedBy: true } });
  return res.json({ message: "Besoin mis à jour.", item: mapNeed(refreshed) });
});

export default router;
