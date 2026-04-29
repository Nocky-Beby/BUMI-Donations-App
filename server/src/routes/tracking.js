import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/my", authenticate, authorize("donor", "partner"), async (req, res) => {
  const items = await prisma.donationTracking.findMany({
    where: {
      donation: { userId: req.user.id },
    },
    include: {
      donation: {
        include: {
          distributions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({
    items: items.map((row) => {
      const status = String(row.status).toLowerCase();
      const donationAmount = Number(row.donation.amount || 0);
      const distributedAmount = (row.donation.distributions || []).reduce(
        (total, distribution) => total + (Number(distribution.amount) || 0),
        0
      );

      return {
        id: row.id,
        donationId: row.donation.id,
        date: row.createdAt,
        title: status,
        description: row.message,
        actor: row.actorLabel,
        currency: row.donation.currency,
        amountLabel:
          status === "allocated"
            ? "Montant affecte"
            : status === "distributed"
              ? "Montant distribue"
              : null,
        amount:
          status === "allocated"
            ? donationAmount
            : status === "distributed" && distributedAmount > 0
              ? distributedAmount
              : null,
      };
    }),
  });
});

router.get("/:donationId", authenticate, authorize("admin", "manager"), async (req, res) => {
  const items = await prisma.donationTracking.findMany({
    where: { donationId: req.params.donationId },
    orderBy: { createdAt: "asc" },
  });

  return res.json({
    items: items.map((row) => ({
      id: row.id,
      donationId: row.donationId,
      status: String(row.status).toLowerCase(),
      message: row.message,
      actorId: row.actorId,
      actorLabel: row.actorLabel,
      createdAt: row.createdAt,
    })),
  });
});

export default router;
