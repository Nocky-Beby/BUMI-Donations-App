import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { buildDonationMetrics } from "../utils/donationMetrics.js";

const router = express.Router();

router.get("/overview", authenticate, authorize("admin", "manager", "partner"), async (_req, res) => {
  const [totalDonors, totalPartners, totalNeeds, activeNeeds, totalDistributions, donations, donationStatus, needs, recentDonations] = await Promise.all([
    prisma.user.count({ where: { role: "DONOR" } }),
    prisma.partner.count(),
    prisma.need.count({ where: { status: { not: "ARCHIVED" } } }),
    prisma.need.count({ where: { status: { in: ["PUBLISHED", "OPEN"] } } }),
    prisma.distribution.count(),
    prisma.donation.findMany({ where: { type: "CASH" }, select: { type: true, amount: true, currency: true, normalizedValueCdf: true } }),
    prisma.donation.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.need.findMany({ where: { status: { not: "ARCHIVED" } }, orderBy: { updatedAt: "desc" } }),
    prisma.donation.findMany({ include: { user: true, need: true }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  const donationBreakdown = buildDonationMetrics(donations);
  const needsProgress = needs.map((need) => {
    const progress = need.targetAmount > 0 ? Math.round((need.currentAmount / need.targetAmount) * 100) : need.targetQuantity > 0 ? Math.round((need.currentQuantity / need.targetQuantity) * 100) : 0;
    return { title: need.title, status: String(need.status).toLowerCase(), currentAmount: Number(need.currentAmount), targetAmount: Number(need.targetAmount), currentQuantity: Number(need.currentQuantity), targetQuantity: Number(need.targetQuantity), progress: Number.isFinite(progress) ? Math.min(100, Math.max(progress, 0)) : 0 };
  });
  return res.json({
    totals: {
      totalDonors,
      totalPartners,
      totalNeeds,
      openNeeds: activeNeeds,
      totalDistributions,
      totalDonationsValue: donationBreakdown.overallNormalizedCdf,
      totalDonationsValueCdf: donationBreakdown.overallNormalizedCdf,
      donationBreakdown,
    },
    donationStatus: donationStatus.map((row) => ({ status: String(row.status).toLowerCase(), total: row._count.status })),
    needsProgress,
    recentDonations: recentDonations.filter((d) => d.type === "CASH").map((d) => ({ id: d.id, type: String(d.type).toLowerCase(), status: String(d.status).toLowerCase(), createdAt: d.createdAt, donor: d.user.fullName, needTitle: d.need?.title || null, value: d.amount, currency: d.currency, normalizedValueCdf: d.normalizedValueCdf })),
  });
});

export default router;
