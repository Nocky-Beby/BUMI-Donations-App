import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import publicRoutes from "./routes/public.js";
import userRoutes from "./routes/users.js";
import needRoutes from "./routes/needs.js";
import partnerRoutes from "./routes/partners.js";
import donationRoutes from "./routes/donations.js";
import trackingRoutes from "./routes/tracking.js";
import distributionRoutes from "./routes/distributions.js";
import reportRoutes from "./routes/reports.js";
import dashboardRoutes from "./routes/dashboard.js";
import notificationRoutes from "./routes/notifications.js";
import { registerRealtimeRoute } from "./utils/realtime.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origine non autorisée par la politique CORS."));
    },
    credentials: true,
  })
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use(express.json());
registerRealtimeRoute(app);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "API BUMI SQLite + Prisma opérationnelle.",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/users", userRoutes);
app.use("/api/needs", needRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/distributions", distributionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: err?.message || "Une erreur interne est survenue sur le serveur.",
  });
});

app.listen(port, () => {
  console.log(`BUMI API running on http://localhost:${port}`);
});
