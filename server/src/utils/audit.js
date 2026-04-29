import prisma from "../lib/prisma.js";

export async function logAudit({ actorId = null, action, entityType, entityId = null, details = null }) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error("Audit log error:", error.message);
  }
}
