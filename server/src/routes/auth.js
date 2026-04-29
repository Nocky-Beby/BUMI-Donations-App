import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { signToken } from "../utils/jwt.js";
import { authenticate } from "../middleware/auth.js";
import { mapUser, roleToDb } from "../utils/mappers.js";
import { logAudit } from "../utils/audit.js";
import { emitRealtimeEvent } from "../utils/realtime.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { fullname, email, phone, password } = req.body || {};

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Nom complet, email et mot de passe sont requis." });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    return res.status(409).json({ message: "Un compte existe déjà avec cette adresse email." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = await prisma.user.create({
    data: {
      fullName: fullname,
      email: normalizedEmail,
      phone: phone || null,
      passwordHash,
      role: roleToDb("donor"),
      status: "ACTIVE",
    },
  });

  await logAudit({ actorId: user.id, action: "REGISTER", entityType: "users", entityId: user.id, details: { role: "donor", email: normalizedEmail } });
  emitRealtimeEvent("user.created", { role: "donor", userId: user.id });

  const token = signToken(user);

  return res.status(201).json({ message: "Compte donateur créé avec succès.", token, user: mapUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body || {};

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, mot de passe et rôle sont requis." });
  }

  const user = await prisma.user.findFirst({ where: { email: String(email).trim().toLowerCase(), role: roleToDb(role) } });

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides pour ce rôle." });
  }

  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Mot de passe incorrect." });
  }

  await logAudit({ actorId: user.id, action: "LOGIN", entityType: "users", entityId: user.id, details: { role } });

  return res.json({ message: "Connexion réussie.", token: signToken(user), user: mapUser(user) });
});

router.get("/me", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  return res.json({ user: mapUser(user) });
});

export default router;
