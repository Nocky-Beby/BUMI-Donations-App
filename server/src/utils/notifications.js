import prisma from "../lib/prisma.js";
import { sendEmailNotification } from "./mailer.js";

export async function createNotification({ userId, type, title, message, meta = null, email = null }) {
  if (!userId) return null;

  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      channel: email ? "EMAIL+IN_APP" : "IN_APP",
      status: "PENDING",
      meta: meta ? JSON.stringify(meta) : null,
    },
  });

  if (email) {
    try {
      const result = await sendEmailNotification({
        to: email,
        subject: `[BUMI] ${title}`,
        text: `${title}\n\n${message}`,
      });

      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: result.delivered ? "DELIVERED" : "IN_APP_ONLY" },
      });
    } catch (_error) {
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: "IN_APP_ONLY" },
      });
    }
  } else {
    await prisma.notification.update({
      where: { id: notification.id },
      data: { status: "IN_APP_ONLY" },
    });
  }

  return notification;
}

export async function notifyDonationOwner({ donationId, title, message, type = "DONATION_UPDATE" }) {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: { user: true, need: true },
  });

  if (!donation?.userId) return null;

  return createNotification({
    userId: donation.userId,
    type,
    title,
    message,
    email: donation.user?.email || null,
    meta: {
      donationId: donation.id,
      needId: donation.needId,
      needTitle: donation.need?.title || null,
    },
  });
}
