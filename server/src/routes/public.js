import express from "express";
import prisma from "../lib/prisma.js";
import { mapPublicNeed } from "../utils/mappers.js";
import { buildDonationMetrics } from "../utils/donationMetrics.js";

const router = express.Router();
const PUBLIC_NEED_STATUSES = ["PUBLISHED", "OPEN"];

router.get("/needs", async (_req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const rows = await prisma.need.findMany({ where: { status: { in: PUBLIC_NEED_STATUSES } }, orderBy: [{ priority: "asc" }, { updatedAt: "desc" }] });
  return res.json({ items: rows.map(mapPublicNeed) });
});

router.get("/stats", async (_req, res) => {
  const [donors, partners, donations, publishedNeeds, completedNeeds, distributions] = await Promise.all([
    prisma.user.count({ where: { role: "DONOR" } }),
    prisma.partner.count(),
    prisma.donation.findMany({ where: { type: "CASH" }, select: { type: true, amount: true, currency: true, normalizedValueCdf: true } }),
    prisma.need.count({ where: { status: { in: PUBLIC_NEED_STATUSES } } }),
    prisma.need.count({ where: { status: { in: ["SATISFIED", "CLOSED"] } } }),
    prisma.distribution.count(),
  ]);

  const donationBreakdown = buildDonationMetrics(donations);
  return res.json({
    stats: {
      donors,
      partners,
      donationsAmount: donationBreakdown.overallNormalizedCdf,
      donationsAmountCdf: donationBreakdown.overallNormalizedCdf,
      donationBreakdown,
      openNeeds: publishedNeeds,
      completedNeeds,
      distributions,
    },
  });
});

router.get("/reports", async (_req, res) => {
  const donations = await prisma.donation.findMany({ include: { need: true }, orderBy: { createdAt: "desc" } });
  const monthlyMap = new Map();
  const categoryMap = new Map();
  for (const donation of donations) {
    const value = donation.normalizedValueCdf || 0;
    const month = new Date(donation.createdAt).toISOString().slice(0, 7);
    monthlyMap.set(month, Number(((monthlyMap.get(month) || 0) + value).toFixed(2)));
    const category = donation.need?.category || "Non classé";
    categoryMap.set(category, Number(((categoryMap.get(category) || 0) + value).toFixed(2)));
  }
  const monthly = [...monthlyMap.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6).map(([month, total]) => ({ month, total }));
  const byCategory = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]).map(([category, total]) => ({ category, total }));
  return res.json({ monthly, byCategory });
});

export default router;
