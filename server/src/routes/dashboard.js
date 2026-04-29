import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { buildDonationMetrics } from "../utils/donationMetrics.js";

const router = express.Router();

router.get("/summary", authenticate, async (req, res) => {
  const role = req.user.role;
  if (role === "donor" || role === "partner") {
    const [donations, trackingCount, notificationsCount] = await Promise.all([
      prisma.donation.findMany({ where: { userId: req.user.id, type: "CASH" }, select: { type: true, amount: true, currency: true, normalizedValueCdf: true } }),
      prisma.donationTracking.count({ where: { donation: { userId: req.user.id } } }),
      prisma.notification.count({ where: { userId: req.user.id } }),
    ]);
    const donationBreakdown = buildDonationMetrics(donations);
    return res.json({
      role,
      summary: {
        donationsCount: donations.length,
        donationsValue: donationBreakdown.overallNormalizedCdf,
        donationsValueCdf: donationBreakdown.overallNormalizedCdf,
        donationBreakdown,
        trackingCount,
        notificationsCount,
      },
    });
  }

  const [donations, activeNeeds, totalDistributions, activeDonors] = await Promise.all([
    prisma.donation.findMany({ where: { type: "CASH" }, select: { type: true, amount: true, currency: true, normalizedValueCdf: true } }),
    prisma.need.count({ where: { status: { in: ["PUBLISHED", "OPEN"] } } }),
    prisma.distribution.count(),
    prisma.user.count({ where: { role: "DONOR" } }),
  ]);
  const donationBreakdown = buildDonationMetrics(donations);
  return res.json({
    role,
    summary: {
      totalDonationsValue: donationBreakdown.overallNormalizedCdf,
      totalDonationsValueCdf: donationBreakdown.overallNormalizedCdf,
      donationBreakdown,
      openNeeds: activeNeeds,
      totalDistributions,
      activeDonors,
    },
  });
});

export default router;
