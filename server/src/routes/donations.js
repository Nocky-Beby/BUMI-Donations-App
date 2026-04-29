import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { mapDonationForList, mapDonationForOwner } from "../utils/mappers.js";
import { logAudit } from "../utils/audit.js";
import { syncNeedLifecycle } from "../utils/needs.js";
import { notifyDonationOwner } from "../utils/notifications.js";
import { emitRealtimeEvent } from "../utils/realtime.js";

const router = express.Router();
const USD_TO_CDF = Number(process.env.USD_TO_CDF || 2800);

const toNormalizedCdf = (value, currency) => {
  const numeric = Number(value) || 0;
  return String(currency).toUpperCase() === "USD" ? numeric * USD_TO_CDF : numeric;
};

async function logTracking({ donationId, status, message, actorId, actorLabel }) {
  await prisma.donationTracking.create({
    data: { donationId, status: String(status).toUpperCase(), message, actorId: actorId || null, actorLabel: actorLabel || null },
  });
}

router.get("/", authenticate, authorize("admin", "manager"), async (_req, res) => {
  const items = await prisma.donation.findMany({ include: { user: true, need: true }, orderBy: { createdAt: "desc" } });
  return res.json({ items: items.map(mapDonationForList) });
});

router.get("/my", authenticate, async (req, res) => {
  const items = await prisma.donation.findMany({ where: { userId: req.user.id }, include: { need: true }, orderBy: { createdAt: "desc" } });
  return res.json({ items: items.map(mapDonationForOwner) });
});

router.post("/", authenticate, authorize("donor", "partner", "admin"), async (req, res) => {
  const { amount, currency = "CDF", needId, description } = req.body || {};
  const selectedCurrency = ["USD", "CDF"].includes(String(currency).toUpperCase()) ? String(currency).toUpperCase() : "CDF";
  const rawValue = Number(amount) || 0;
  const normalizedValueCdf = toNormalizedCdf(rawValue, selectedCurrency);

  const item = await prisma.donation.create({
    data: {
      userId: req.user.id,
      needId: needId || null,
      type: "CASH",
      amount: rawValue,
      currency: selectedCurrency,
      normalizedValueCdf,
      description: description || null,
      source: req.user.role === "partner" ? "PARTNER" : "PLATFORM",
      donorLabel: req.user.organization || req.user.name,
      status: "SUBMITTED",
    },
    include: { user: true, need: true },
  });

  if (needId) {
    await prisma.need.update({ where: { id: needId }, data: { currentAmount: { increment: normalizedValueCdf }, updatedById: req.user.id } }).catch(() => null);
    await syncNeedLifecycle(needId, req.user.id);
  }

  await logTracking({ donationId: item.id, status: "submitted", message: "Don en especes enregistre avec succes sur la plateforme.", actorId: req.user.id, actorLabel: req.user.organization || req.user.name });
  await notifyDonationOwner({ donationId: item.id, title: "Don enregistre", message: needId ? "Votre don a bien ete enregistre et pre-affecte a un besoin." : "Votre don a bien ete enregistre. Vous recevrez un message lors de sa validation ou affectation.", type: "DONATION_CREATED" });
  await logAudit({ actorId: req.user.id, action: "CREATE_DONATION", entityType: "donations", entityId: item.id, details: { type: "cash", needId, rawValue, currency: selectedCurrency, normalizedValueCdf } });
  emitRealtimeEvent("donation.created", { donationId: item.id, needId: item.needId || null, userId: req.user.id });

  return res.status(201).json({ message: "Don enregistre avec succes.", item: mapDonationForList(item) });
});

router.patch("/:id/status", authenticate, authorize("admin", "manager"), async (req, res) => {
  const { id } = req.params;
  const { status, message } = req.body || {};
  const allowed = ["submitted", "validated", "received", "allocated", "distributed", "closed"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Statut de don invalide." });

  const donation = await prisma.donation.findUnique({ where: { id } });
  if (!donation) return res.status(404).json({ message: "Don introuvable." });

  const now = new Date();
  const statusData = { status: String(status).toUpperCase() };
  if (status === "validated" && !donation.validatedAt) {
    statusData.validatedAt = now;
    statusData.validatedById = req.user.id;
  }
  if (status === "received" && !donation.receivedAt) {
    statusData.receivedAt = now;
    statusData.receivedById = req.user.id;
  }
  if (status === "allocated" && !donation.allocatedAt) {
    statusData.allocatedAt = now;
    statusData.allocatedById = req.user.id;
  }

  const updated = await prisma.donation.update({ where: { id }, data: statusData, include: { user: true, need: true } });
  await logTracking({ donationId: id, status, message: message || `Statut mis a jour : ${status}.`, actorId: req.user.id, actorLabel: req.user.name });
  await notifyDonationOwner({ donationId: id, title: "Mise a jour de votre don", message: message || `Le statut de votre don a ete mis a jour : ${status}.`, type: "DONATION_STATUS" });
  if (updated.needId) await syncNeedLifecycle(updated.needId, req.user.id);
  await logAudit({ actorId: req.user.id, action: "UPDATE_DONATION_STATUS", entityType: "donations", entityId: id, details: { status, message } });
  emitRealtimeEvent("donation.updated", { donationId: id, needId: updated.needId || null, status });
  return res.json({ message: "Statut du don mis a jour.", item: mapDonationForList(updated) });
});

router.post("/:id/allocate", authenticate, authorize("admin", "manager"), async (req, res) => {
  const { id } = req.params;
  const { needId, message } = req.body || {};
  if (!needId) return res.status(400).json({ message: "Le besoin cible est requis pour l'affectation." });

  const donation = await prisma.donation.findUnique({ where: { id }, include: { user: true, need: true } });
  if (!donation) return res.status(404).json({ message: "Don introuvable." });
  const targetNeed = await prisma.need.findUnique({ where: { id: needId } });
  if (!targetNeed) return res.status(404).json({ message: "Besoin introuvable." });

  const valueCdf = Number(donation.normalizedValueCdf || 0);
  if (donation.needId && donation.needId !== needId) {
    await prisma.need.update({ where: { id: donation.needId }, data: { currentAmount: { decrement: valueCdf }, updatedById: req.user.id } }).catch(() => null);
    await syncNeedLifecycle(donation.needId, req.user.id);
  }
  if (donation.needId !== needId) {
    await prisma.need.update({ where: { id: needId }, data: { currentAmount: { increment: valueCdf }, updatedById: req.user.id } }).catch(() => null);
  }

  const updated = await prisma.donation.update({
    where: { id },
    data: { needId, status: "ALLOCATED", allocatedAt: new Date(), allocatedById: req.user.id },
    include: { user: true, need: true },
  });
  await syncNeedLifecycle(needId, req.user.id);
  await logTracking({ donationId: id, status: "allocated", message: message || `Don affecte au besoin : ${targetNeed.title}.`, actorId: req.user.id, actorLabel: req.user.name });
  await notifyDonationOwner({ donationId: id, title: "Don affecte a un besoin", message: message || `Votre don a ete affecte au besoin "${targetNeed.title}".`, type: "DONATION_ALLOCATED" });
  await logAudit({ actorId: req.user.id, action: "ALLOCATE_DONATION", entityType: "donations", entityId: id, details: { needId, needTitle: targetNeed.title } });
  emitRealtimeEvent("donation.allocated", { donationId: id, needId });
  return res.json({ message: "Don affecte avec succes.", item: mapDonationForList(updated) });
});

export default router;
