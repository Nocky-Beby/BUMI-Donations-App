import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";
import { emitRealtimeEvent } from "../utils/realtime.js";

const router = express.Router();

router.get("/", authenticate, authorize("admin", "manager"), async (_req, res) => {
  const items = await prisma.partner.findMany({ orderBy: { createdAt: "desc" } });
  return res.json({ items: items.map((item) => ({ id: item.id, name: item.name, contactPerson: item.contactPerson, email: item.email, phone: item.phone, sector: item.sector, status: String(item.status).toLowerCase(), createdAt: item.createdAt })) });
});

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const { name, contactPerson, email, phone, sector } = req.body || {};

  if (!name) {
    return res.status(400).json({ message: "Le nom du partenaire est requis." });
  }

  const item = await prisma.partner.create({ data: { name, contactPerson: contactPerson || null, email: email || null, phone: phone || null, sector: sector || null, status: "ACTIVE" } });

  await logAudit({ actorId: req.user.id, action: "CREATE_PARTNER", entityType: "partners", entityId: item.id, details: { name, sector } });
  emitRealtimeEvent("partner.created", { partnerId: item.id });

  return res.status(201).json({ message: "Partenaire enregistré.", item: { id: item.id, name: item.name, contactPerson: item.contactPerson, email: item.email, phone: item.phone, sector: item.sector, status: String(item.status).toLowerCase(), createdAt: item.createdAt } });
});

export default router;
