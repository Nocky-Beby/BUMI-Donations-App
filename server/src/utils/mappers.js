export const enumToClient = (value) => String(value || "").toLowerCase();
export const roleToDb = (role) => String(role || "").trim().toUpperCase();

export function mapUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    role: enumToClient(user.role),
    organization: user.organization,
    status: enumToClient(user.status),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function mapNeed(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    imageUrl: row.imageUrl || null,
    priority: enumToClient(row.priority),
    targetAmount: row.targetAmount,
    currentAmount: row.currentAmount,
    targetQuantity: row.targetQuantity,
    currentQuantity: row.currentQuantity,
    unit: row.unit,
    status: enumToClient(row.status),
    updatedBy: row.updatedBy?.fullName || null,
    updatedAt: row.updatedAt,
  };
}

export function mapPublicNeed(row) {
  const progress = row.targetAmount > 0
    ? Math.round((row.currentAmount / row.targetAmount) * 100)
    : row.targetQuantity > 0
      ? Math.round((row.currentQuantity / row.targetQuantity) * 100)
      : 0;

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    imageUrl: row.imageUrl || null,
    priority: enumToClient(row.priority),
    progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0,
    targetAmount: row.targetAmount,
    currentAmount: row.currentAmount,
    targetQuantity: row.targetQuantity,
    currentQuantity: row.currentQuantity,
    unit: row.unit,
    status: enumToClient(row.status),
    updatedAt: row.updatedAt,
  };
}

export function mapDonationForList(row) {
  return {
    id: row.id,
    type: enumToClient(row.type),
    amount: row.amount,
    currency: row.currency,
    normalizedValueCdf: row.normalizedValueCdf,
    description: row.description,
    source: enumToClient(row.source),
    status: enumToClient(row.status),
    donorName: row.user?.fullName || null,
    donorRole: row.user?.role ? enumToClient(row.user.role) : null,
    needId: row.needId || row.need?.id || null,
    needTitle: row.need?.title || null,
    validatedAt: row.validatedAt,
    receivedAt: row.receivedAt,
    allocatedAt: row.allocatedAt,
    createdAt: row.createdAt,
  };
}

export function mapDonationForOwner(row) {
  return {
    id: row.id,
    type: "Especes",
    amount: row.amount,
    currency: row.currency,
    normalizedValueCdf: row.normalizedValueCdf,
    purpose: row.need?.title || "Non specifie",
    date: row.createdAt,
    status: enumToClient(row.status),
    validatedAt: row.validatedAt,
    receivedAt: row.receivedAt,
    allocatedAt: row.allocatedAt,
    description: row.description,
  };
}
