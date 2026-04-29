import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET || "change-this-secret-in-production";

export function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: String(user.role || "").toLowerCase(),
      name: user.fullName || user.full_name || user.name,
    },
    secret,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, secret);
}
