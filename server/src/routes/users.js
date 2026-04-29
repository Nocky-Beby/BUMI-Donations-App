import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { mapUser, roleToDb } from "../utils/mappers.js";
import { logAudit } from "../utils/audit.js";
import { emitRealtimeEvent } from "../utils/realtime.js";

const router = express.Router();

router.get("/", authenticate, authorize("admin"), async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { donations: true } } },
  });

  return res.json({ items: users.map((row) => ({ id: row.id, name: row.fullName, email: row.email, phone: row.phone, role: String(row.role).toLowerCase(), organization: row.organization, status: String(row.status).toLowerCase(), contributions: row._count?.donations || 0, createdAt: row.createdAt })) });
});

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const { name, email, phone, password, role = "donor", organization, status = "active" } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nom, email et mot de passe sont requis." });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    return res.status(409).json({ message: "Un utilisateur existe déjà avec cette adresse email." });
  }

  const user = await prisma.user.create({
    data: {
      fullName: name,
      email: normalizedEmail,
      phone: phone || null,
      passwordHash: bcrypt.hashSync(password, 10),
      role: roleToDb(role),
      organization: organization || null,
      status: String(status).toUpperCase(),
    },
  });

  await logAudit({ actorId: req.user.id, action: "CREATE_USER", entityType: "users", entityId: user.id, details: { role, email: normalizedEmail } });
  emitRealtimeEvent("user.created", { role, userId: user.id });

  return res.status(201).json({ message: "Utilisateur créé avec succès.", item: mapUser(user) });
});

router.put("/me", authenticate, async (req, res) => {
  const { name, phone, organization } = req.body || {};

  const updated = await prisma.user.update({ where: { id: req.user.id }, data: { fullName: name || req.user.name, phone: phone || null, organization: organization || null } });

  await logAudit({ actorId: req.user.id, action: "UPDATE_PROFILE", entityType: "users", entityId: req.user.id, details: { phone: updated.phone, organization: updated.organization } });
  emitRealtimeEvent("user.updated", { userId: req.user.id });

  return res.json({ message: "Profil mis à jour.", user: mapUser(updated) });
});

export default router;
