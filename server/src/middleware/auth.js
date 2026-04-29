import prisma from "../lib/prisma.js";
import { verifyToken } from "../utils/jwt.js";
import { mapUser } from "../utils/mappers.js";

export async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentification requise." });
  }

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable." });
    }

    req.user = mapUser(user);
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Session invalide ou expirée." });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentification requise." });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès non autorisé pour ce rôle." });
    }

    next();
  };
}
