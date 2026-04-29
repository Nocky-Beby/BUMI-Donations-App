import prisma from "../lib/prisma.js";

export async function syncNeedLifecycle(needId, updatedById = null) {
  if (!needId) return null;

  const need = await prisma.need.findUnique({ where: { id: needId } });
  if (!need) return null;

  const amountProgress = need.targetAmount > 0 ? Number(need.currentAmount || 0) / Number(need.targetAmount || 1) : 0;
  const quantityProgress = need.targetQuantity > 0 ? Number(need.currentQuantity || 0) / Number(need.targetQuantity || 1) : 0;
  const isSatisfied = amountProgress >= 1 || quantityProgress >= 1;

  const nextStatus = ["CLOSED", "ARCHIVED"].includes(String(need.status).toUpperCase())
    ? String(need.status).toUpperCase()
    : isSatisfied
      ? "SATISFIED"
      : ["DRAFT", "PUBLISHED", "OPEN", "SATISFIED"].includes(String(need.status).toUpperCase())
        ? "PUBLISHED"
        : String(need.status).toUpperCase();

  if (nextStatus === String(need.status).toUpperCase()) return need;

  return prisma.need.update({
    where: { id: needId },
    data: {
      status: nextStatus,
      updatedById: updatedById || need.updatedById || null,
    },
  });
}
