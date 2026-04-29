import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { logAudit } from "../utils/audit.js";
import { syncNeedLifecycle } from "../utils/needs.js";
import { notifyDonationOwner } from "../utils/notifications.js";
import { emitRealtimeEvent } from "../utils/realtime.js";

const router = express.Router();

router.get("/", authenticate, async (_req, res) => {
  const items = await prisma.distribution.findMany({
    include: {
      need: true,
      distributedBy: true,
      donation: {
        include: {
          need: true,
        },
      },
    },
    orderBy: { distributedAt: "desc" },
  });

  return res.json({
    items: items.map((row) => ({
      id: row.id,
      donationId: row.donationId,
      needId: row.needId,
      donationDescription: row.donation?.description || null,
      needTitle: row.need.title,
      allocatedNeedTitle: row.donation?.need?.title || row.need.title,
      quantity: row.quantity,
      amount: row.amount,
      distributedAmount: row.amount,
      totalDonationAmount: row.donation?.amount || 0,
      currency: row.donation?.currency || "CDF",
      beneficiaryGroup: row.beneficiaryGroup,
      notes: row.notes,
      status: String(row.status).toLowerCase(),
      distributedBy: row.distributedBy?.fullName || null,
      receivedAt: row.donation?.receivedAt || null,
      allocatedAt: row.donation?.allocatedAt || null,
      distributedAt: row.distributedAt,
    })),
  });
});

router.post("/", authenticate, authorize("admin", "manager"), async (req, res) => {
  const { donationId, needId, quantity = 0, amount = 0, beneficiaryGroup, notes } = req.body || {};

  if (!needId) {
    return res.status(400).json({ message: "Le besoin lié à la distribution est requis." });
  }

  const numericQuantity = Number(quantity) || 0;
  const numericAmount = Number(amount) || 0;

  const item = await prisma.distribution.create({
    data: {
      donationId: donationId || null,
      needId,
      quantity: numericQuantity,
      amount: numericAmount,
      beneficiaryGroup: beneficiaryGroup || "Enfants de l’orphelinat BUMI",
      notes: notes || null,
      status: "COMPLETED",
      distributedById: req.user.id,
    },
    include: { need: true, distributedBy: true, donation: true },
  });

  await prisma.need.update({ where: { id: needId }, data: { currentQuantity: { increment: numericQuantity }, updatedById: req.user.id } }).catch(() => null);

  if (donationId) {
    await prisma.donation.update({ where: { id: donationId }, data: { status: "DISTRIBUTED", needId } }).catch(() => null);

    await prisma.donationTracking.create({
      data: {
        donationId,
        status: "DISTRIBUTED",
        message: notes || "Don distribué aux bénéficiaires.",
        actorId: req.user.id,
        actorLabel: req.user.name,
      },
    });

    await notifyDonationOwner({ donationId, title: "Don distribué", message: notes || "Votre don a été distribué aux bénéficiaires du besoin concerné.", type: "DONATION_DISTRIBUTED" });
  }

  await syncNeedLifecycle(needId, req.user.id);
  await logAudit({ actorId: req.user.id, action: "CREATE_DISTRIBUTION", entityType: "distributions", entityId: item.id, details: { donationId, needId, quantity: numericQuantity, amount: numericAmount } });
  emitRealtimeEvent("distribution.created", { distributionId: item.id, donationId: donationId || null, needId });

  return res.status(201).json({ message: "Distribution enregistrée.", item: { id: item.id, donationId: item.donationId, needId: item.needId, needTitle: item.need.title, quantity: item.quantity, amount: item.amount, beneficiaryGroup: item.beneficiaryGroup, notes: item.notes, status: String(item.status).toLowerCase(), distributedBy: item.distributedBy?.fullName || null, distributedAt: item.distributedAt } });
});

export default router;
